const container = document.getElementById("container");
const divCarrito = document.getElementById("carrito");
const mostrarCarritoBtn = document.getElementById("mostrar-carrito");
const ocultarCarritoBtn = document.getElementById("ocultar-carrito");
const searchInput = document.getElementById("search-input");

const productos = [];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let idProducto = productos.length + 1;

function crearProducto(nombre, precio, imagen, stock) {
  const nuevoProducto = {
    id: idProducto++,
    nombre: nombre,
    precio: precio,
    imagen: imagen,
    stock: stock,
    alt: `Camiseta ${nombre}`,
  };
  productos.push(nuevoProducto);
  crearCard(nuevoProducto, "container");
}

function crearCard(camiseta, contenedor) {
  const card = document.createElement("div");
  card.className = camiseta.stock ? "card" : "no-card";

  const titulo = document.createElement("p");
  titulo.innerText = camiseta.nombre;
  titulo.className = "titulo";

  const imagen = document.createElement("img");
  imagen.src = camiseta.imagen;
  imagen.alt = camiseta.alt;
  imagen.className = "img";

  const precio = document.createElement("p");
  precio.innerText = `$${camiseta.precio}`;
  precio.className = "titulo";

  const botonAgregar = document.createElement("button");
  botonAgregar.innerText =
    contenedor === "container" ? "Agregar" : "Quitar del Carrito";
  botonAgregar.className = "btn-add";
  if (contenedor === "container") {
    botonAgregar.onclick = () => {
      if (camiseta.stock) {
        agregarAlCarrito(camiseta.id);
      } else {
        alert("Este producto no tiene stock.");
      }
    };
  } else {
    botonAgregar.onclick = () => quitarDelCarrito(camiseta.id);
  }

  card.appendChild(titulo);
  card.appendChild(imagen);
  card.appendChild(precio);
  card.appendChild(botonAgregar);

  const nuevoContenedor = document.getElementById(contenedor);
  nuevoContenedor.appendChild(card);
}

function displayProducts(products) {
  container.innerHTML = "";
  products.forEach((camiseta) => crearCard(camiseta, "container"));
}

productos.forEach((camiseta) => crearCard(camiseta, "container"));

function agregarAlCarrito(id) {
  const producto = productos.find((camiseta) => camiseta.id === id);
  if (producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

function quitarDelCarrito(id) {
  const index = carrito.findIndex((camiseta) => camiseta.id === id);
  if (index !== -1) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

function mostrarCarrito() {
  divCarrito.innerHTML = "";
  let totalPrecio = 0;

  carrito.forEach((producto, index) => {
    const itemCarrito = document.createElement("div");
    itemCarrito.className = "item-carrito";
    itemCarrito.innerHTML = `
      <p>${index + 1}. ${producto.nombre} - $${producto.precio}</p>
      <button onclick="quitarDelCarrito(${producto.id})">Quitar</button>
    `;
    divCarrito.appendChild(itemCarrito);
    totalPrecio += producto.precio;
  });

  const total = document.createElement("p");
  total.className = "total";
  total.innerText = `Total del precio de todos los productos en el carrito: $${totalPrecio}`;
  divCarrito.appendChild(total);

  if (carrito.length > 0) {
    mostrarCarritoBtn.style.display = "none";
    ocultarCarritoBtn.style.display = "block";
    divCarrito.style.display = "block";
  } else {
    mostrarCarritoBtn.style.display = "block";
    ocultarCarritoBtn.style.display = "none";
    divCarrito.style.display = "none";
  }
}

mostrarCarritoBtn.addEventListener("click", () => {
  mostrarCarritoBtn.style.display = "none";
  ocultarCarritoBtn.style.display = "block";
  divCarrito.style.display = "block";
  mostrarCarrito();
});

ocultarCarritoBtn.addEventListener("click", () => {
  mostrarCarritoBtn.style.display = "block";
  ocultarCarritoBtn.style.display = "none";
  divCarrito.style.display = "none";
});

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProducts = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
});
