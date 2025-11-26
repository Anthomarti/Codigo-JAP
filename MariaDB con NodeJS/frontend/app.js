const API = "http://localhost:3000/todo";

const taskList = document.getElementById("taskList");
const btnAdd = document.getElementById("btnAdd");

const inputName = document.getElementById("name");
const inputDesc = document.getElementById("description");
const inputStatus = document.getElementById("status");

// Cargar tareas
async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <strong>${task.name}</strong> <br>
      ${task.description} <br>
      Estado: ${task.status} <br>
      <button class="edit">Editar</button>
      <button class="delete">Eliminar</button>
    `;

    // Eliminar
    li.querySelector(".delete").addEventListener("click", () => {
      deleteTask(task.id);
    });

    // Editar
    li.querySelector(".edit").addEventListener("click", () => {
      editTask(task);
    });

    taskList.appendChild(li);
  });
}

// Crear tarea
btnAdd.addEventListener("click", async () => {
  const newTask = {
    name: inputName.value,
    description: inputDesc.value,
    status: inputStatus.value
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask)
  });

  inputName.value = "";
  inputDesc.value = "";
  inputStatus.value = "pending";

  loadTasks();
});

// Eliminar
async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadTasks();
}

// Editar
async function editTask(task) {
  const name = prompt("Nuevo nombre:", task.name);
  if (!name) return;

  const desc = prompt("Nueva descripción:", task.description);
  if (!desc) return;

  const status = prompt("Nuevo estado (pending / in_progress / completed):", task.status);
  if (!status) return;

  await fetch(`${API}/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      description: desc,
      status
    })
  });

  loadTasks();
}

// Iniciar
loadTasks();
