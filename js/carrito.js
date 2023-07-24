const URL = "js/productos.json"; // Esta constante almacena la ruta del archivo JSON que contiene la información de los productos.
const productosIndumentaria = []; // array vacío donde se cargarán los productos obtenidos desde el archivo JSON.

const guardarCarrito = ()=> {
    if (productosCarrito.length > 0) {
        localStorage.setItem('productosCarrito', JSON.stringify(productosCarrito))
    }
}

const recuperarCarrito = ()=> {
    return JSON.parse(localStorage.getItem('productosCarrito')) || [] 
}

const productosCarrito = recuperarCarrito()

const agregarCarrito = (productoId)=> {
    if (productoId > 0) {
        const resultado = productosIndumentaria.find((producto)=> producto.id === parseInt(productoId))
        if (resultado !== undefined) {
            productosCarrito.push(resultado)
        } else {
            console.warn('No se encontró producto con ese código.')
        }
    }
}

