document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario");
    const nombreInput = document.getElementById("nombre");   
    const errorNombre = document.getElementById("error-nombre");
    const contraseñaInput = document.getElementById("password");   
    const errorContraseña = document.getElementById("error-password");
    const botonLimpiar = document.getElementById("limpiar");

    //validar nombre
    function validarNombre(nombre) {
        //borramos mensajes anteriores
        errorNombre.textContent = "";
        errorNombre.style.display = "none";
        nombre = nombre.trim();

        //comprobamos que no este vacío
        if (!nombre) {
            errorNombre.textContent = "Nombre obligatorio.";
            errorNombre.style.display = "block";
            return false;
        }

        //comprobamos longitud
        if (nombre.length > 20) {
            errorNombre.textContent = "El nombre no puede tener más de 20 caracteres";
            errorNombre.style.display = "block";
            return false;
        }

        //comprobamos formato
        const nombreFormato = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nombreFormato.test(nombre)) {
            errorNombre.textContent = "Nombre inválido";
            errorNombre.style.display = "block";
            return false;
        }

        return true;
    }

    //validar contraseña
    function validarContraseña(password) {
        //borramos mensajes anteriores
        errorContraseña.textContent = "";
        errorContraseña.style.display = "none";
        password = password.trim();

        //comprobamos que no este vacío
        if (!password) {
            errorContraseña.textContent = "La contraseña es obligatoria.";
            errorContraseña.style.display = "block";
            return false;
        }
        
        //comprobamos longitud y formato
        const passwordFormato = /^[a-zA-Z0-9·$%&/()]+$/;
        if (password.length > 16 || password.length < 8 ||!passwordFormato.test(password)) {
            errorContraseña.textContent = "La contraseña debe tener entre 8 y 16 caracteres y solo puede contener letras, números y los caracteres ·$%&/().";
            errorContraseña.style.display = "block";
            return false;
        }
        return true;
    }

    //eventos de validación cuando perdemos el foco
    nombreInput.addEventListener("blur", () => validarNombre(nombreInput.value));
    contraseñaInput.addEventListener("blur", () => validarContraseña(contraseñaInput.value));

    //validamos el formulario al enviarlo
    formulario.addEventListener("submit", (event) => {
        let valido = true;

        if (!validarNombre(nombreInput.value)) valido = false;
        if (!validarContraseña(contraseñaInput.value)) valido = false;
        
        if (!valido) {
            event.preventDefault(); //evitamos que el formulario se envíe si hay cualquier error
        }
    });



    //botón de limpiar
    botonLimpiar.addEventListener("click", () => {
        formulario.reset();
        const mensajes = document.querySelectorAll(".error-message");
        mensajes.forEach((error) => {
            error.textContent = "";
            error.style.display = "none";
        });
    });
});