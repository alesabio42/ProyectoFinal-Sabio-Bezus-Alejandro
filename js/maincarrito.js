
const tbody = document.querySelector('tbody');
const btnConfirmar = document.querySelector('button#btnConfirmar');
const mensajeCompra = document.getElementById('mensajeCompra');
const resumenPedido = document.getElementById('resumenPedido');

const armarTablaHTML = ({ id, imagen, nombre, importe, categoria }) => {
  const importeFormateado = importe.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS'
  });

  return `<tr>
          <td><img src="${imagen}" alt="Imagen del producto" style="max-width: 100px; max-height: 100px;"></td>
          <td>${nombre}</td>
          <td>${importeFormateado}</td>
          <td>${categoria}</td>
          <td><button class="btnEliminar" data-id="${id.toString()}">Eliminar</button></td>
          </tr>`;
};

const eliminarProducto = (id) => {
  let productosCarrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
  console.log('Productos antes de eliminar:', productosCarrito);
  
  // Convertir el ID a número antes de compararlo en el loop
  id = parseInt(id);
  
  // Variable para rastrear si se ha eliminado el producto
  let productoEliminado = false;

  // Recorre los productos del carrito
  for (let i = 0; i < productosCarrito.length; i++) {
    if (productosCarrito[i].id === id) {
      // Eliminar el producto con el ID especificado
      productosCarrito.splice(i, 1);
      productoEliminado = true;
      break; // Detener el bucle después de eliminar el primer producto con el ID especificado
    }
  }

  if (!productoEliminado) {
    // Si no se encontró ningún producto con el ID dado, mostrar un mensaje
    Swal.fire({
      icon: 'warning',
      title: 'Producto no encontrado',
      text: 'No se encontró ningún producto con el ID especificado en el carrito',
      timer: 3000
    });
  } else {
    // Si se eliminó un producto, mostrar el mensaje de éxito
    Swal.fire({
      icon: 'info',
      title: 'Producto eliminado',
      text: 'El producto ha sido eliminado del carrito',
      timer: 3000
    })
    .then(() => {
      location.reload();
    });
  }

  // Actualizar el carrito en el almacenamiento local
  localStorage.setItem('productosCarrito', JSON.stringify(productosCarrito));
};


const agregarEventosEliminar = () => {
  console.log('Función agregarEventosEliminar ejecutada');
  const btnEliminar = document.querySelectorAll('.btnEliminar');
  btnEliminar.forEach((boton) => {
    boton.addEventListener('click', () => {
      const idProducto = boton.dataset.id; // Obtener el id del producto desde el atributo data-id del botón actual
      eliminarProducto(idProducto); // Llamar a la función eliminarProducto con el id del producto a eliminar
    });
  });
};


const mostrarCarrito = () => {
  console.log('Función mostrarCarrito ejecutada');
  const productosCarrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
  let totalCarrito = 0; // Variable para almacenar el total del carrito

  if (productosCarrito.length > 0) {
    tbody.innerHTML = productosCarrito
      .map((carrito) => {
        totalCarrito += carrito.importe; // Sumar el importe de cada producto al total del carrito
        return armarTablaHTML(carrito);
      })
      .join('');

      
    // Agregar una fila adicional para mostrar el total del carrito sin el envío y las cuotas
    tbody.innerHTML += `<tr>
                          <td colspan="4"></td>
                          <td>Total Carrito: ${totalCarrito.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS'
                          })}</td>
                        </tr>`;

    const cantidadProductos = productosCarrito.length;
    const envioSelect = document.getElementById('envio');
    const cuotasSelect = document.getElementById('cuotas');
    const totalPedido = document.getElementById('totalPedido');

    document.getElementById('cantidadProductos').textContent = `Cantidad de productos en el carrito: ${cantidadProductos}`;

    // Calcular el costo de envío según la opción seleccionada
    const calcularCostoEnvio = () => {
      const seleccionEnvio = envioSelect.value;
      let costoEnvio = 1000; // Variable para almacenar el costo de envío
      return costoEnvio;
    };

    // Actualizar el total del pedido al cambiar la opción de envío o cuotas
    const actualizarTotalPedido = () => {
      const seleccionEnvio = envioSelect.value;
      const seleccionCuotas = cuotasSelect.value;
      let totalFinal = totalCarrito;

      if (seleccionEnvio === 'conEnvio') {
        // Agregar el costo de envío al total del pedido
        const costoEnvio = calcularCostoEnvio();
        totalFinal += costoEnvio;
      }

      if (seleccionCuotas !== '1') {
        // Calcular el interés según las cuotas seleccionadas y agregarlo al total del pedido
        const interesPorcentaje = seleccionCuotas === '3' ? 5 : 10; // Porcentaje de interés según las cuotas seleccionadas
        const interes = totalFinal * (interesPorcentaje / 100);
        totalFinal += interes;
      }

      totalPedido.textContent = `Total del pedido: ${totalFinal.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'
      })}`;
    };

    envioSelect.addEventListener('change', actualizarTotalPedido);
    cuotasSelect.addEventListener('change', actualizarTotalPedido);

    // Mostrar el resumen del pedido inicial
    resumenPedido.style.display = 'block';
    actualizarTotalPedido();
  } else {
    tbody.innerHTML = '';
    document.getElementById('cantidadProductos').textContent = 'Sin productos en carrito';
    document.getElementById('totalPedido').textContent = '';
    resumenPedido.style.display = 'none';
  }

  btnConfirmar.style.display = productosCarrito.length > 0 ? 'block' : 'none'; // Mostrar u ocultar el botón CONFIRMAR según si hay productos en el carrito
};

mostrarCarrito();
agregarEventosEliminar();

btnConfirmar.addEventListener('click', () => {
  localStorage.removeItem('productosCarrito');
  tbody.innerHTML = '';
  document.getElementById('cantidadProductos').textContent = 'Sin productos en carrito';
  document.getElementById('totalPedido').textContent = '';
  resumenPedido.style.display = 'none';

  Swal.fire({
    icon: 'success',
    title: 'Su compra se ha realizado satisfactoriamente',
    text: '¡Vuelva pronto!',
    showConfirmButton: false,
    timer: 3000
  }).then(() => {
    btnConfirmar.style.display = 'none'; // Ocultar el botón CONFIRMAR después de confirmar la compra
  });
});
