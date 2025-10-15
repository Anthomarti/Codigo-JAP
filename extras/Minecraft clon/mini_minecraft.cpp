// mini_minecraft.cpp (versión limpia)
// Mundo voxel finito con cámara FPS manual (sin UpdateCamera), spawn y colisión con piso.
// Dep: raylib 4/5.x

#include "raylib.h"
#include <vector>
#include <array>
#include <cstdint>
#include <cmath>
#include <algorithm>

static const int WORLD_W = 64;
static const int WORLD_D = 64;
static const int WORLD_H = 32;

enum Block : uint8_t { Air=0, Grass=1, Dirt=2, Stone=3, Wood=4 };

struct World {
    std::vector<uint8_t> v;
    World() : v(WORLD_W*WORLD_D*WORLD_H, Air) {}
    inline bool InBounds(int x,int y,int z) const {
        return x>=0 && x<WORLD_W && y>=0 && y<WORLD_H && z>=0 && z<WORLD_D;
    }
    inline int idx(int x,int y,int z) const { return x + z*WORLD_W + y*(WORLD_W*WORLD_D); }
    Block get(int x,int y,int z) const { if(!InBounds(x,y,z)) return Air; return (Block)v[idx(x,y,z)]; }
    void set(int x,int y,int z, Block b){ if(InBounds(x,y,z)) v[idx(x,y,z)]=b; }
};

// ---------------- Terreno (ruido value/fbm simple) ----------------
static inline uint32_t hash32(uint32_t x) {
    x ^= x >> 17; x *= 0xed5ad4bbU; x ^= x >> 11;
    x *= 0xac4c1b51U; x ^= x >> 15; x *= 0x31848babU; x ^= x >> 14;
    return x;
}
static float valueNoise2D(int x, int y, uint32_t seed=1337) {
    uint32_t h = hash32((uint32_t)x*0x8da6b343U ^ (uint32_t)y*0xd8163841U ^ seed);
    return (h / 4294967295.0f);
}
static float smoothNoise2D(float x, float y) {
    int x0 = (int)floorf(x), y0 = (int)floorf(y);
    float fx = x - x0, fy = y - y0;
    auto v00 = valueNoise2D(x0,y0);
    auto v10 = valueNoise2D(x0+1,y0);
    auto v01 = valueNoise2D(x0,y0+1);
    auto v11 = valueNoise2D(x0+1,y0+1);
    auto lerp = [](float a,float b,float t){ return a + (b-a)*t; };
    float ix0 = lerp(v00, v10, fx);
    float ix1 = lerp(v01, v11, fx);
    return lerp(ix0, ix1, fy);
}
static float fbm2D(float x, float y) {
    float f=0, amp=1.0f, sum=0;
    for(int i=0;i<4;i++){
        f += smoothNoise2D(x,y)*amp;
        sum += amp;
        x*=2.0f; y*=2.0f; amp*=0.5f;
    }
    return f/sum;
}

static void GenerateTerrain(World& w) {
    const float scale = 0.06f;
    const int sea = 10;
    for (int z=0; z<WORLD_D; ++z) {
        for (int x=0; x<WORLD_W; ++x) {
            float hNoise = fbm2D(x*scale, z*scale);
            int h = sea + (int)roundf(hNoise * 12.0f);
            h = std::clamp(h, 1, WORLD_H-1);
            for (int y=0; y<=h; ++y) {
                if (y == h)       w.set(x,y,z, Grass);
                else if (y > h-3) w.set(x,y,z, Dirt);
                else              w.set(x,y,z, Stone);
            }
        }
    }
    // tronquitos
    for (int i=0;i<80;i++){
        int x = GetRandomValue(0,WORLD_W-1);
        int z = GetRandomValue(0,WORLD_D-1);
        int y= WORLD_H-2;
        while(y>1 && w.get(x,y,z)==Air) y--;
        if (w.get(x,y,z)!=Air && y+1 < WORLD_H-1) {
            for (int t=1;t<=3;t++) w.set(x,y+t,z, Wood);
        }
    }
}

// ---------------- Utilidades colisión/altura ----------------
static inline bool IsSolid(Block b){ return b != Air; }

static int SurfaceYAt(const World& w, int x, int z){
    x = std::clamp(x, 0, WORLD_W-1);
    z = std::clamp(z, 0, WORLD_D-1);
    for (int y = WORLD_H-1; y >= 0; --y){
        if (IsSolid(w.get(x,y,z))) return y;
    }
    return -1;
}

// ---------------- Selección de bloques (raycast DDA) ----------------
struct HitInfo {
    bool hit=false; int x=0,y=0,z=0; int px=0,py=0,pz=0;
};
static HitInfo RaycastVoxel(const World& w, Vector3 ro, Vector3 rd, float maxDist=8.0f){
    HitInfo h{};
    int x = (int)floorf(ro.x), y = (int)floorf(ro.y), z = (int)floorf(ro.z);
    int stepX = (rd.x>0)?1:-1;
    int stepY = (rd.y>0)?1:-1;
    int stepZ = (rd.z>0)?1:-1;

    auto intBound = [](float s, float ds){
        if (ds>0) return (1.0f - (s - floorf(s))) / ds;
        else      return (s - floorf(s)) / -ds;
    };

    float tMaxX = (rd.x==0)? INFINITY : intBound(ro.x, rd.x);
    float tMaxY = (rd.y==0)? INFINITY : intBound(ro.y, rd.y);
    float tMaxZ = (rd.z==0)? INFINITY : intBound(ro.z, rd.z);
    float tDeltaX = (rd.x==0)? INFINITY : fabsf(1.0f/rd.x);
    float tDeltaY = (rd.y==0)? INFINITY : fabsf(1.0f/rd.y);
    float tDeltaZ = (rd.z==0)? INFINITY : fabsf(1.0f/rd.z);

    float t = 0.0f;
    int px=x,py=y,pz=z;

    for (int i=0;i<256 && t<=maxDist;i++){
        if (w.InBounds(x,y,z) && w.get(x,y,z)!=Air){
            h.hit=true; h.x=x; h.y=y; h.z=z; h.px=px; h.py=py; h.pz=pz;
            return h;
        }
        px = x; py = y; pz = z;
        if (tMaxX < tMaxY) {
            if (tMaxX < tMaxZ) { x += stepX; t = tMaxX; tMaxX += tDeltaX; }
            else               { z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; }
        } else {
            if (tMaxY < tMaxZ) { y += stepY; t = tMaxY; tMaxY += tDeltaY; }
            else               { z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; }
        }
    }
    return h;
}

static Color BlockColor(Block b){
    switch(b){
        case Grass: return Color{ 90, 160, 60, 255 };
        case Dirt:  return Color{ 134,  92, 60, 255 };
        case Stone: return Color{ 110, 110, 110, 255 };
        case Wood:  return Color{ 120,  80, 40, 255 };
        default:    return BLANK;
    }
}

// ------------------------------- main -------------------------------
int main(){
    SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_RESIZABLE);
    InitWindow(1280, 720, "Mini Minecraft (C++/raylib) - Mundo finito");
    SetTargetFPS(90);

    World world;
    GenerateTerrain(world);

    // Cámara y estado del jugador (sin UpdateCamera)
    Camera3D cam = {0};
    const float eye = 1.7f;
    float spawnX = 32.0f, spawnZ = 32.0f;
    int sy = SurfaceYAt(world, (int)spawnX, (int)spawnZ); if (sy < 0) sy = 0;
    cam.position = { spawnX, sy + eye + 0.05f, spawnZ };
    cam.target   = { spawnX + 1.0f, sy + eye + 0.05f, spawnZ };
    cam.up       = { 0.0f, 1.0f, 0.0f };
    cam.fovy     = 70.0f;
    cam.projection = CAMERA_PERSPECTIVE;

    float yaw = 0.0f, pitch = 0.0f;
    DisableCursor();

    int currentBlock = (int)Grass;
    float velY = 0.0f;
    bool onGround = false;

    while (!WindowShouldClose()){
        float dt = GetFrameTime();

        // --- Mirar con mouse (yaw/pitch) ---
        Vector2 md = GetMouseDelta();
        const float sens = 0.0035f;
        yaw   += md.x * sens;
        pitch += -md.y * sens;
        pitch = std::clamp(pitch, -1.55f, 1.55f);

        Vector3 forward = {
            cosf(pitch) * cosf(yaw),
            sinf(pitch),
            cosf(pitch) * sinf(yaw)
        };
        Vector3 right = { -sinf(yaw), 0.0f, cosf(yaw) };

        // --- Movimiento en plano XZ ---
        float baseSpeed = 6.0f;
        float speed = baseSpeed * (IsKeyDown(KEY_LEFT_SHIFT) ? 1.8f : 1.0f);
        Vector3 move = {0,0,0};
        if (IsKeyDown(KEY_W)) { move.x += forward.x; move.z += forward.z; }
        if (IsKeyDown(KEY_S)) { move.x -= forward.x; move.z -= forward.z; }
        if (IsKeyDown(KEY_D)) { move.x += right.x;   move.z += right.z;   }
        if (IsKeyDown(KEY_A)) { move.x -= right.x;   move.z -= right.z;   }
        float len = sqrtf(move.x*move.x + move.z*move.z);
        if (len > 0.0001f) { move.x/=len; move.z/=len; }
        cam.position.x += move.x * speed * dt;
        cam.position.z += move.z * speed * dt;

        // --- Gravedad + salto + apoyo en superficie ---
        if (IsKeyPressed(KEY_SPACE) && onGround) { velY = 8.5f; onGround = false; }
        velY -= 22.0f * dt;
        cam.position.y += velY * dt;

        int cx_col = (int)floorf(cam.position.x);
        int cz_col = (int)floorf(cam.position.z);
        int gy = SurfaceYAt(world, cx_col, cz_col);
        float minY = (gy >= 0 ? gy + eye : eye);
        if (cam.position.y <= minY) {
            cam.position.y = minY + 0.001f;
            velY = 0.0f;
            onGround = true;
        } else {
            onGround = false;
        }

        // actualizar target
        cam.target.x = cam.position.x + forward.x;
        cam.target.y = cam.position.y + forward.y;
        cam.target.z = cam.position.z + forward.z;

        // Selección de bloque (ray desde centro de pantalla)
        Vector2 screen = {(float)GetScreenWidth()/2.0f,(float)GetScreenHeight()/2.0f};
        Ray ray = GetMouseRay(screen, cam);
        HitInfo hit = RaycastVoxel(world, ray.position, ray.direction, 8.0f);

        // Cambiar bloque actual
        if (IsKeyPressed(KEY_ONE))   currentBlock = (int)Grass;
        if (IsKeyPressed(KEY_TWO))   currentBlock = (int)Dirt;
        if (IsKeyPressed(KEY_THREE)) currentBlock = (int)Stone;
        if (IsKeyPressed(KEY_FOUR))  currentBlock = (int)Wood;

        // Picar / Poner
        if (hit.hit && IsMouseButtonPressed(MOUSE_BUTTON_LEFT)) {
            world.set(hit.x, hit.y, hit.z, Air);
        }
        if (IsMouseButtonPressed(MOUSE_BUTTON_RIGHT)) {
            int x = hit.hit ? hit.px : (int)floorf(ray.position.x + ray.direction.x*3.0f);
            int y = hit.hit ? hit.py : (int)floorf(ray.position.y + ray.direction.y*3.0f);
            int z = hit.hit ? hit.pz : (int)floorf(ray.position.z + ray.direction.z*3.0f);
            if (world.InBounds(x,y,z) && world.get(x,y,z)==Air)
                world.set(x,y,z, (Block)currentBlock);
        }

        // ---------------- Dibujo ----------------
        BeginDrawing();
        ClearBackground(Color{ 155, 210, 255, 255 });

        BeginMode3D(cam);

        DrawPlane({WORLD_W/2.0f, 0.0f, WORLD_D/2.0f}, { (float)WORLD_W, (float)WORLD_D }, Color{120,170,255,80});

        int cx = (int)cam.position.x, cy=(int)cam.position.y, cz=(int)cam.position.z;
        int R = 36;
        for (int z=std::max(0,cz-R); z<std::min(WORLD_D, cz+R); ++z){
            for (int y=0; y<WORLD_H; ++y){
                for (int x=std::max(0,cx-R); x<std::min(WORLD_W, cx+R); ++x){
                    Block b = world.get(x,y,z);
                    if (b==Air) continue;
                    // expuesto (una cara al aire)
                    bool exposed = false;
                    static const int N[6][3]={{1,0,0},{-1,0,0},{0,1,0},{0,-1,0},{0,0,1},{0,0,-1}};
                    for (auto& d : N){
                        if (world.get(x+d[0], y+d[1], z+d[2])==Air){ exposed=true; break; }
                    }
                    if (!exposed) continue;

                    Vector3 pos = { (float)x+0.5f, (float)y+0.5f, (float)z+0.5f };
                    DrawCube(pos, 1.0f,1.0f,1.0f, BlockColor(b));
                    DrawCubeWires(pos, 1.0f,1.0f,1.0f, Color{0,0,0,40});
                }
            }
        }

        if (hit.hit){
            Vector3 hp = { (float)hit.x+0.5f, (float)hit.y+0.5f, (float)hit.z+0.5f };
            DrawCubeWires(hp, 1.02f,1.02f,1.02f, YELLOW);
        }

        EndMode3D();

        DrawRectangle(10, 10, 260, 92, Fade(BLACK, 0.35f));
        DrawText("Mini Minecraft (mundo finito)", 20, 18, 18, RAYWHITE);
        DrawText("WASD/Mouse: mover/mirar | Espacio: saltar | Shift: correr", 20, 44, 14, RAYWHITE);
        DrawText("Click izq.: picar | Click der.: poner | 1/2/3/4: bloque | Esc: salir", 20, 62, 14, RAYWHITE);
        const char* nb = (currentBlock==Grass)?"Pasto":(currentBlock==Dirt)?"Tierra":(currentBlock==Stone)?"Piedra":"Madera";
        DrawText(TextFormat("Bloque actual: %s", nb), 20, 80, 14, RAYWHITE);

        EndDrawing();
    }

    CloseWindow();
    return 0;
}
