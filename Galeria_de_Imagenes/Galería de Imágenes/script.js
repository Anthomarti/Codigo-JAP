const images = [
    {
        src: "img1.jpg",
        alt: "Imagen de la NASA",
        title: "Descripción de la imagen",
        description: "El planeta tierra visto desde el espacio por la NASA"
    },
    {
        src: "img2.jpg",
        alt: "Sala de servidores",
        title: "Sala de servidores moderna",
        description: "Infraestructura de red representando el corazón de la tecnología"
    },
    {
        src: "https://blog.lg.com.br/wp-content/uploads/2019/11/tecnologia-e-ser-humano-1.png",
        alt: "Humano y tecnología",
        title: "Tecnología y ser humano",
        description: "La relación entre el ser humano y la tecnología moderna"
    },
    {
        src: "https://s1.significados.com/foto/tecnologia-dura-fa.jpg?class=article",
        alt: "Tecnología dura",
        title: "Tecnología dura",
        description: "Componentes físicos que permiten el funcionamiento de sistemas tecnológicos"
    }
];

let currentIndex = 0;

const imgElement = document.getElementById("gallery-image");
const titleElement = document.getElementById("image-title");
const descElement = document.getElementById("image-description");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const linkUno = document.getElementById("linkUno");

function updateGallery(index) {
    const image = images[index];
    imgElement.src = image.src;
    imgElement.alt = image.alt;
    titleElement.textContent = image.title;
    descElement.textContent = image.description;
}

prevButton.addEventListener("click", function (e) {
    e.preventDefault();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateGallery(currentIndex);
});

nextButton.addEventListener("click", function (e) {
    e.preventDefault();
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery(currentIndex);
});

linkUno.addEventListener("click", function (e) {
    e.preventDefault();
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery(currentIndex);
});
