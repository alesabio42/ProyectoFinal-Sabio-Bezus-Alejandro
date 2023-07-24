const divContainer = document.querySelector('div.container');

// Esta funcion se utiliza para generar dinámicamente el contenido HTML de cada tarjeta de producto con la información proporcionada
const armarCardDinamica = (producto) => {
  return `<div class="card">
            <div class="card-img"><img src="${producto.imagen}" class="imagen-prod">
            </div>
            <div class="card-title">${producto.nombre}</div>
            <div class="card-price">$ ${producto.importe}</div>
            <div class="card-button">
                <button class="button button-outline button-add" id="${producto.id}" title="Clic para agregar al Carrito">🛒</button>
            </div>
          </div>`;
};


// Esta funcion es utilizada para obtener la información de un producto específico
const obtenerProductoPorId = (id) => {
  return productosIndumentaria.find((producto) => producto.id === parseInt(id));
};

const agregarClickEnBotonesCarrito = () => {
  const botones = document.querySelectorAll('button.button.button-outline.button-add');
  for (boton of botones) {
    boton.addEventListener('click', (e) => {
      const producto = obtenerProductoPorId(e.target.id);
      agregarCarrito(e.target.id);
      guardarCarrito();
      mostrarMensaje(producto);
    });
  }
};

const mostrarMensaje = (producto) => {
    const contenido = `
      <div style="font-size: 18px; padding-bottom: 8px;">Se agregó el siguiente producto al carrito:</div>
      <div><img src="${producto.imagen}" style="width: 150px; height: auto;"></div>
      <div style="font-size: 25px; padding-top: 10px;">${producto.nombre}</div>
      <div style="font-size: 20px; padding-bottom: 10px;">$ ${producto.importe}</div>
    `;

  Swal.fire({
    title: '<span style="font-size: 30px;">PRODUCTO AÑADIDO AL CARRITO!</span>',
    html: contenido,
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Seguir comprando',
    confirmButtonText: 'Ir al carrito',
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      const cubeloaderDiv = document.querySelector('.cube-loader');
      cubeloaderDiv.style.display = 'block';

      setTimeout(() => {
        cubeloaderDiv.style.display = 'none';
        window.location.href = 'carrito.html';
      }, 3000); // Mostrar la animación durante 5 segundos
    }
  });
};


function cargarProductos(productos) {
  divContainer.innerHTML = ''; // Vaciamos el contenido del contenedor antes de agregar los productos filtrados
  productos.forEach((producto) => {
    divContainer.innerHTML += armarCardDinamica(producto);
  });
  agregarClickEnBotonesCarrito(); // Aseguramos que los eventos de click estén presentes para los nuevos botones agregados
}

async function solicitarProductosIndumentaria() {
  const response = await fetch(URL);
  const data = await response.json();
  productosIndumentaria.push(...data);
  if (productosIndumentaria.length > 0) {
    cargarProductos(productosIndumentaria);
  } else {
    divContainer.innerHTML = retornoCardError();
  }
}

const campoBusqueda = document.querySelector('input[type="search"]');

campoBusqueda.addEventListener('input', buscarProductos);

function buscarProductos() {
  const terminoBusqueda = campoBusqueda.value.toLowerCase();

  const productosFiltrados = productosIndumentaria.filter((producto) => {
    const nombreProducto = producto.nombre.toLowerCase();
    return nombreProducto.includes(terminoBusqueda);
  });

  cargarProductos(productosFiltrados); // Mostramos los productos filtrados
}

solicitarProductosIndumentaria()


// Función para crear un escudo
function crearEscudo() {
  const escudoContainer = document.createElement("div");
  escudoContainer.className = "escudo-container";

  const escudo = document.createElement("div");
  escudo.className = "escudo";
  escudo.style.backgroundImage = "url('images/BOCA-RIBBON_tcm216-647531.avif')";

  escudoContainer.appendChild(escudo);
  document.getElementById("escudos-container").appendChild(escudoContainer);
}

// Cantidad de escudos que deseas mostrar
const cantidadEscudos = 10;

// Crear múltiples escudos
for (let i = 0; i < cantidadEscudos; i++) {
  crearEscudo();
}

