document.addEventListener("DOMContentLoaded", () => {
const nombreInput = document.getElementById("nombre");   
const errorNombre = document.getElementById("error-nombre");

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
    nombreInput.addEventListener("blur", () => validarNombre(nombreInput.value));
});
