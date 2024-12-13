document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-productos");
    const titulo = document.getElementById("titulo-principal");
    const botones = document.querySelectorAll(".boton-categoria");

    let productos = [];

    //esto es para cargar los productos desde el json que tenemos referenciado
    fetch('./js/productos.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al cargar productos.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            productos = data;
            mostrarProductos(productos); //mostramos todos los productos
        })
        .catch((error) => console.error("Error al cargar productos:", error));

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
    })
});
