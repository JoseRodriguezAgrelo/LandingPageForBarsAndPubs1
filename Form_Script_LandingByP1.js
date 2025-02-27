// Importar configuración
const { apiKey, calendarId } = CONFIG;

// Seleccionar elementos del formulario
const form = document.getElementById("reservaForm");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");

// Obtener reservas ya existentes en el calendario
async function obtenerReservas() {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.items.map(evento => ({
        fecha: evento.start.dateTime.split("T")[0],
        hora: evento.start.dateTime.split("T")[1].substring(0, 5)
    }));
}

// Bloquear fechas ya reservadas
async function bloquearFechas() {
    const reservas = await obtenerReservas();

    fechaInput.addEventListener("change", function () {
        const fechaSeleccionada = this.value;
        horaInput.innerHTML = ""; // Limpiar opciones de hora
        
        let horariosDisponibles = [
            "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
        ];

        reservas.forEach(reserva => {
            if (reserva.fecha === fechaSeleccionada) {
                horariosDisponibles = horariosDisponibles.filter(h => h !== reserva.hora);
            }
        });

        // Mostrar solo horarios disponibles
        horariosDisponibles.forEach(hora => {
            let option = document.createElement("option");
            option.value = hora;
            option.textContent = hora;
            horaInput.appendChild(option);
        });

        if (horariosDisponibles.length === 0) {
            alert("No hay horarios disponibles en esta fecha.");
            fechaInput.value = "";
        }
    });
}

// Enviar reserva a Google Calendar
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const personas = document.getElementById("personas").value;

    const evento = {
        summary: `Reserva de ${nombre}`,
        description: `Reserva para ${personas} personas. Email: ${email}`,
        start: { dateTime: `${fecha}T${hora}:00`, timeZone: "America/Argentina/Buenos_Aires" },
        end: { dateTime: `${fecha}T${parseInt(hora) + 1}:00`, timeZone: "America/Argentina/Buenos_Aires" }
    };

    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evento)
    });

    if (response.ok) {
        alert("¡Reserva confirmada! Te esperamos.");
        form.reset();
    } else {
        alert("Error al reservar. Intenta de nuevo.");
    }
});

// Iniciar bloqueo de fechas ocupadas
bloquearFechas();