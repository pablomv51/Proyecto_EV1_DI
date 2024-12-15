document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-productos");
    const titulo = document.getElementById("titulo-principal");
    const botones = document.querySelectorAll(".boton-categoria");
    const numerito = document.getElementById("numerito");
    const logoInicio = document.getElementById("inicio");//este lo necesito para que no se guarden los elementos del carrito cuando vuelvo al login
    const abrirMenu = document.getElementById("open-menu");
    const cerrarMenu = document.getElementById("close-menu");
    const aside = document.querySelector(".aside-visible"); 

    let carrito = JSON.parse(localStorage.getItem("carrito")) || []; /*esta declaración de carrito hace que recupere los datos del localstorage, que va a estar en formato JSON gracias al parse*/
    let productos = [];

    //esto es para cargar los productos desde el json que tenemos referenciado
    fetch('./js/productos.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`error al cargar el json: productos.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            productos = data;
            mostrarProductos(productos); //mostramos todos los productos
        })
        .catch((error) => console.error("error cargando productos:", error));

    //mostramos productos
    function mostrarProductos(listaProductos) {
        contenedor.innerHTML = ""; //limpiamos

        listaProductos.forEach((producto) => {
            const div = document.createElement("div");
            div.classList.add("producto");


            div.innerHTML = ` <div class="producto">
                <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" onerror="this.src='../img/default.jpg'">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.titulo}</h3>
                    <p class="producto-precio">$${producto.precio}</p>
                    <button class="producto-agregar" data-id="${producto.id}">AGREGAR</button>
                </div>
            `; //permite insertar contenido HTML como una cadena de texto (todo esto dentro del div)
            contenedor.appendChild(div);

        });
    }
        //agregamos producto al carrito (si pulsamos sobre agregar sobre cualquier producto)
        const agregarAlCarrito = (producto) => {
            const productoExistente = carrito.find((item) => item.id === producto.id); //esta línea, la acabe haciendo con una función flecha porque lo que quiero es buscar un producto que ya existe en el carrito (pero con el id)
    
            if (productoExistente) {
                //si el producto ya está en el carrito lo que hacemos es sumar uno a la cantidad
                productoExistente.cantidad++;
            } else {
                //sino existe empieza la cantidad en 1 (porque no había este producto antes)
                carrito.push({ ...producto, cantidad: 1 }); //devuelve la nueva cantidad, añadiendo al final
            }
    
            //guardamos el carrito en el localstorage para que se quede aunque hayamos cerrado en el navegador(pensé en hacerlo con session storage pero me pareció más óptimo este)
            localStorage.setItem("carrito", JSON.stringify(carrito)); //convertimos en una cadena
            actualizarContadorCarrito(); //actualizamos el contador del carrito (aside)
        };
    
        //actualiza el contador del carrito
        const actualizarContadorCarrito = () => {
            const totalProductos = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0); //esta linea sirve para calcular el numero total de productos que hay en el carrito (reduce lo que hace es reducir a un valor la cuenta, me informe en internet)
            numerito.textContent = totalProductos; //el numerito es el total de los productos
        };

    //filtramos por categoría(portatiles,moviles...)

     function filtrarProductos(categoriaId, categoriaNombre) {
        if (categoriaId === "todos") {
            titulo.textContent = "Todos los productos";//título si estamos en todos los productos
            mostrarProductos(productos); //mostramos todos
        } else {
            const productosFiltrados = productos.filter(
                (producto) => producto.categoria.id === categoriaId,
            );
            mostrarProductos(productosFiltrados); //productos filtrados dependiendo del id
            titulo.textContent = categoriaNombre; //actualizamos título dependiendo del botón que se pulse

        }
    }

    //asignamos el evento a cada botón al hacer click sobre ellos

    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            botones.forEach((btn) => btn.classList.remove("active"));//aquí quitamos la clase active para todos
            e.currentTarget.classList.add("active"); //la clase active la utilizo para resaltar el botón que esté seleccionado

            const categoriaId = e.currentTarget.id; //obtenemos el id del botón
            const categoriaNombre = e.currentTarget.textContent; //obtenemos el texto del botón
            filtrarProductos(categoriaId, categoriaNombre); //filtramos productos
        });
    });

//asignamos evento a cada botón de agregar (al hacer click)

contenedor.addEventListener("click", (e) => {
    if (e.target.classList.contains("producto-agregar")) {
        //estas variables las creo para luego que me de los valores correspondientes en cada parámetro del objeto de los productos
        const idProducto = e.target.dataset.id;
        const tituloProducto = e.target.parentElement.querySelector(".producto-titulo").textContent;
        const precioProducto = parseFloat(
            e.target.parentElement.querySelector(".producto-precio").textContent.replace("$", "") //el replace se lo puse para que me ponga el dinero
        );
        const imagenProducto = e.target.parentElement.parentElement.querySelector(".producto-imagen").src;

        //creamos los objetos productos
        const producto = {
            id: idProducto, //id
            titulo: tituloProducto, //título
            precio: precioProducto, //precio
            imagen: imagenProducto, //imagen
        };

        agregarAlCarrito(producto); //añadimos el producto al carrito llamando a la función de antes
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

//evento para abrir el menú
abrirMenu.addEventListener("click", () => {
    aside.style.display = "flex"; //mostramos el menu
    aside.style.position = "absolute";
    aside.style.width = "15rem";
    aside.style.backgroundColor = "var(--clr-main)";
});

//evento para cerrar el menú
cerrarMenu.addEventListener("click", () => {
    aside.style.display = "none"; //ocultamos
});

//actualiza el contador del carrito al cargar la página
actualizarContadorCarrito();

});
