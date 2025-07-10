const productos = [
  {
    id: "01",
    imagen: "./public/cheeseCake.jpg",
    nombre: "Cheese Cake",
    precio: 5000,
  },
  {
    id: "02",
    imagen: "./public/donuts.jpg",
    nombre: "Donas",
    precio: 7000,
  },
  {
    id: "03",
    imagen: "./public/brownies.jpg",
    nombre: "Brownies",
    precio: 4000,
  },
  {
    id: "04",
    imagen: "./public/alfajores.jpg",
    nombre: "Alfajores",
    precio: 7000,
  },
  {
    id: "05",
    imagen: "./public/chocolate.jpg",
    nombre: "Bombones",
    precio: 4000,
  },
  {
    id: "06",
    imagen: "./public/cupcakes.jpg",
    nombre: "Cupcakes",
    precio: 7000,
  },
  {
    id: "07",
    imagen: "./public/macarons.jpg",
    nombre: "Macarons",
    precio: 4000,
  },
  {
    id: "08",
    imagen: "./public/facturas.jpg",
    nombre: "Facturas",
    precio: 7000,
  },
  {
    id: "09",
    imagen: "./public/masas.jpg",
    nombre: "Masas",
    precio: 4000,
  },
  {
    id: "10",
    imagen: "./public/tortas.jpg",
    nombre: "Tortas",
    precio: 4000,
  },
];

let carrito = [];

function agregarProductoAlCarrito(idProducto) {
  let productoEnCarrito = null;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === idProducto) {
      productoEnCarrito = carrito[i];
      break;
    }
  }

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    let productoOriginal = null;
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id === idProducto) {
        productoOriginal = productos[i];
        break; // Salir del bucle
      }
    }

    carrito.push({ ...productoOriginal, cantidad: 1 });
  }
  actualizarCarritoHTML();
}

function manejarClicComprar(evento) {
  const productoId = evento.target.dataset.id;
  agregarProductoAlCarrito(productoId);
}

function agregarProductos() {
  const divProductos = document.querySelector(".box");

  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];

    divProductos.insertAdjacentHTML(
      "afterbegin",
      `
            <div class="cards">
                <div class="box-card">
                    <img src="${producto.imagen}" alt="${producto.nombre}" />
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="label">    
                    <h3>Precio: $ ${producto.precio}</h3>
                    <button class="btn" type="button" data-id="${producto.id}">Comprar</button>
                </div>
            </div>
            `
    );
  }
  divProductos.addEventListener("click", manejarClicComprar);
}

function manejarClicCarrito(evento) {
  const target = evento.target;

  if (
    target.classList.contains("btn-cantidad") ||
    target.classList.contains("btn-eliminar")
  ) {
    const productoId = target.dataset.id;
    const accion = target.dataset.action;

    if (accion === "eliminar") {
      eliminarProductoDelCarrito(productoId);
    } else if (accion === "restar") {
      restarCantidadProducto(productoId);
    } else if (accion === "sumar") {
      sumarCantidadProducto(productoId);
    }
  }
}

function actualizarCarritoHTML() {
  const carritoCompras = document.querySelector(".carrito");

  if (!carritoCompras) {
    console.error(
      "Error: No se encontró el contenedor con la clase 'CarritoCompras'. Asegúrate de que exista en tu HTML."
    );
    return;
  }

  carritoCompras.innerHTML = `
        <h2>Tu Carrito</h2>
        <ul class="lista-carrito"></ul>
        <p class="total-carrito"></p>
        <p class="cantidad-carrito"></p>
    `;

  const listaCarrito = carritoCompras.querySelector(".lista-carrito");
  let totalPagar = 0;
  let cantidadProductosUnicos = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
  } else {
    for (let i = 0; i < carrito.length; i++) {
      const item = carrito[i];
      const li = document.createElement("li");
      li.innerHTML = `
                <span>${item.nombre} - $${item.precio} x ${item.cantidad}</span>
                <div>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="restar">-</button>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="sumar">+</button>
                    <button class="btn-eliminar" data-id="${item.id}" data-action="eliminar">x</button>
                </div>
            `;
      listaCarrito.appendChild(li);
      totalPagar += item.precio * item.cantidad;
      cantidadProductosUnicos++;
    }
  }

  carritoCompras.querySelector(
    ".total-carrito"
  ).textContent = `Total a pagar: $${totalPagar}`;
  carritoCompras.querySelector(
    ".cantidad-carrito"
  ).textContent = `Productos en carrito: ${cantidadProductosUnicos}`;

  const nuevoListaCarrito = carritoCompras.querySelector(".lista-carrito");
  nuevoListaCarrito.addEventListener("click", manejarClicCarrito);
}

function sumarCantidadProducto(idProducto) {
  let productoEnCarrito = null;

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === idProducto) {
      productoEnCarrito = carrito[i];
      break;
    }
  }

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
    actualizarCarritoHTML();
  }
}

function restarCantidadProducto(idProducto) {
  let productoEnCarrito = null;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === idProducto) {
      productoEnCarrito = carrito[i];
      break;
    }
  }

  if (productoEnCarrito) {
    productoEnCarrito.cantidad--;
    if (productoEnCarrito.cantidad <= 0) {
      eliminarProductoDelCarrito(idProducto);
    } else {
      actualizarCarritoHTML();
    }
  }
}

function eliminarProductoDelCarrito(idProducto) {
  const nuevoCarrito = [];
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id !== idProducto) {
      nuevoCarrito.push(carrito[i]);
    }
  }
  carrito = nuevoCarrito;
  actualizarCarritoHTML();
}

agregarProductos();
actualizarCarritoHTML();
