// Desplazamiento suave al hacer clic en los enlaces del menú
document.querySelectorAll('nav ul li a').forEach(enlace => {
    enlace.addEventListener('click', function (e) {
        e.preventDefault();
        const seccion = document.querySelector(this.getAttribute('href'));
        seccion.scrollIntoView({ behavior: 'smooth' });
    });
});

// Validación del formulario de reservas
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar que la página se recargue

    let nombre = document.querySelector('input[type="text"]').value.trim();
    let email = document.querySelector('input[type="email"]').value.trim();
    let fecha = document.querySelector('input[type="date"]').value;
    let personas = document.querySelector('input[type="number"]').value.trim();

    if (nombre === "" || email === "" || fecha === "" || personas === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (!email.includes("@")) {
        alert("Por favor, introduce un correo válido.");
        return;
    }

    if (personas <= 0) {
        alert("El número de personas debe ser mayor a 0.");
        return;
    }

    // Simulación de reserva exitosa
    alert(`¡Reserva confirmada para ${nombre}! Te esperamos el ${fecha}.`);

    // Limpiar formulario después de enviar
    document.querySelector("form").reset();
});