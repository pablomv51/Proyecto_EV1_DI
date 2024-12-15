document.addEventListener("DOMContentLoaded", () => {
    const productosCarrito = document.getElementById("carrito-productos");
    const totalCarrito = document.getElementById("Total");
    const carritoVacio = document.getElementById("carrito-vacio");
    const carritoComprado = document.getElementById("carrito-comprado");
    const carritoAcciones = document.getElementById("carrito-acciones");
    const botonVaciar = document.querySelector(".carrito-acciones-vaciar");
    const botonComprar = document.querySelector(".carrito-acciones-comprar");
    const logoInicio = document.getElementById("inicio"); //este lo necesito para que no se guarden los elementos del carrito cuando vuelvo al login

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];/*esta declaración de carrito hace que recupere los datos del localstorage, que va a estar en formato JSON gracias al parse*/

    //mostramos productos en el carrito(le iba a poner mostrarProductos pero ya hay una función así en el main.js y así evito redundancia)
    const mostrarCarrito = () => {
        productosCarrito.innerHTML = ""; //limpiamos

        if (carrito.length === 0) { //si el carrito esta vacío
            carritoVacio.style.display = "block"; //mostramos el mensaje de carrito vacío
            carritoComprado.style.display = "none";//ocultamos el mensaje de compra completada
            carritoAcciones.style.display = "none";

            
        } else {
            carritoVacio.style.display = "none";
            carritoComprado.style.display = "none"; ////ocultamos el mensaje de compra completada
            carritoAcciones.style.display = "flex"; //mostramos acciones del carrito

            carrito.forEach(producto => {
                //contenedor para cada producto, llamando a cada parámetro del json
                const div = document.createElement("div"); 
                div.classList.add("carrito-producto");
                div.innerHTML = `
                    <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                    <div class="carrito-producto-titulo">
                        <small>Título</small>
                        <h3>${producto.titulo}</h3>
                    </div>
                    <div class="carrito-producto-cantidad">
                        <small>Cantidad</small>
                        <p class="info">${producto.cantidad}</p>
                    </div>
                    <div class="carrito-producto-precio">
                        <small>Precio</small>
                        <p class="info">$${producto.precio}</p>
                    </div>
                    <div class="carrito-producto-subtotal">
                        <small>Subtotal</small>
                        <p class="info">$${producto.precio * producto.cantidad}</p>
                    </div>
                     <button class="carrito-producto-comprar" data-id="${producto.id}">
                        <p class="comprar">Comprar</p>
                    </button>
                    <button class="carrito-producto-eliminar" data-id="${producto.id}">
                        <p class="elimina">Eliminar</p>
                    </button>
                `;
                productosCarrito.appendChild(div); //añadimos el producto al contenedor
            });

            actualizarTotal(); //actualizamos el total del carrito
        }
    };

    //actualizamos el total del carrito
    const actualizarTotal = () => {
        const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0); //suma de todos los productos
        totalCarrito.textContent = `$${total}`; //mostramos el total
    };

    //compramos un producto
    const comprarProducto = (id) => {
        carrito = carrito.filter(producto => producto.id !== id); //eliminamos el producto por id
        localStorage.setItem("carrito", JSON.stringify(carrito)); //guardamos
        mostrarCarrito(); //actualizamos
        actualizarContadorCarrito();
    };

    //evento para comprar
    productosCarrito.addEventListener("click", (e) => {
        if (e.target.classList.contains("carrito-producto-comprar") || e.target.closest(".carrito-producto-comprar")) {
            const id = e.target.closest(".carrito-producto-comprar").dataset.id; //esto es para obtener el id del producto

                const confirmacion = confirm(`¿Quieres comprar el producto?`); //mensaje de confirmación

                if (confirmacion) { //si confirmamos
                    comprarProducto(id);
                }
        }
    });

    //eliminamos un producto
    const eliminarProducto = (id) => {
        carrito = carrito.filter(producto => producto.id !== id); //eliminamos el producto por id
        localStorage.setItem("carrito", JSON.stringify(carrito)); //guardamos
        mostrarCarrito();//actualizamos
        actualizarContadorCarrito();
    };

    //evento para eliminar
    productosCarrito.addEventListener("click", (e) => {
        if (e.target.classList.contains("carrito-producto-eliminar") || e.target.closest(".carrito-producto-eliminar")) {
            const id = e.target.closest(".carrito-producto-eliminar").dataset.id; //esto es para obtener el id del producto
            
            const confirmacion = confirm("¿Quieres eliminar el producto?");//mensaje de confirmación
            
            if (confirmacion) { //si confirmamos
            eliminarProducto(id);
            }
        }

    });

    //evento para vaciar el carrito del todo
    botonVaciar.addEventListener("click", () => {
        const confirmacion = confirm("¿Estás seguro que quieres eliminar todos los productos del carrito?");//mensaje de confirmación
        
        if (confirmacion) { //si confirmamos
        carrito = []; //vaciamos el carrito
        localStorage.setItem("carrito", JSON.stringify(carrito)); //actualiza
        
        mostrarCarrito();
        actualizarContadorCarrito();
        }
    });

    //evento para comprar todo el carrito
    botonComprar.addEventListener("click", () => {
        const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0); //calculamos el total para mostrarlo en el mensaje de alerta
        
        const confirmacion = confirm(`¿Estás seguro que quieres comprar todos los productos por un total de $${total}?`);//mensaje de confirmación
        if (confirmacion) { //si le damos a confirmar
        carrito = []; //vaciamos el carrito después de haber realizado la compra
        localStorage.setItem("carrito", JSON.stringify(carrito)); //actualiza

        mostrarCarrito(); //refrescamos el carrito
        carritoVacio.style.display = "none";
        carritoComprado.style.display = "block"; //mostramos el mensaje de compra completada
        carritoAcciones.style.display = "none";
        actualizarContadorCarrito();
        }
    });

 
    //evento para borrar el carrito antes de movernos al login
    logoInicio.addEventListener("click", (e) => {
        e.preventDefault(); //evitamos redirección inmediata para que de tiempo a borrarse
       
            carrito = [];//vaciamos carrito
            localStorage.removeItem("carrito"); //eliminamos el carrito del localstorage

            //redirigimos manualmente sin hacer caso al "a"
            window.location.href = "index.html";
    });


    //actualiza el contador del carrito
    const actualizarContadorCarrito = () => {
        const totalProductos = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0); //esta linea sirve para calcular el numero total de productos que hay en el carrito (reduce lo que hace es reducir a un valor la cuenta, me informe en internet)
        numerito.textContent = totalProductos; //el numerito es el total de los productos
    };

    //mostramos el carrito al cargar la página
    mostrarCarrito();
    actualizarContadorCarrito();
});
