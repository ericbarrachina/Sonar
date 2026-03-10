// Toggle entre modo claro y oscuro
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Cargar preferencia guardada al iniciar
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '🌙';
    }
});

// Event listener para cambiar tema
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
});

// Animación suave al hacer scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Efecto parallax suave en las tarjetas
const cards = document.querySelectorAll('.card');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// Año actual en el footer
const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Función para comprobar la conexión con el backend
async function comprobar() {
    try {
        console.log("Intentando conectar con el backend en 172.20.10.3...");
        
        const respuesta = await fetch('http://172.20.10.3:3000/test-conexion');
        
        if (respuesta.ok) {
            const datos = await respuesta.json();
            console.log("✅ RESPUESTA DEL BACKEND:", datos);
            alert("¡CONECTADOS! El backend dice: " + datos.mensaje);
        } else {
            console.error("❌ El servidor respondió pero con error");
        }
    } catch (error) {
        console.error("❌ NO SE PUDO CONECTAR. Posibles causas:");
    }
}

comprobar();

// Función para ver usuarios en la consola
async function verUsuariosEnConsola() {
    try {
        console.log("Solicitando usuarios a la base de datos de la VM...");
        
        const respuesta = await fetch('http://172.20.10.3:3000/usuarios');
        
        if (respuesta.ok) {
            const usuarios = await respuesta.json();
            
            console.log("✅ TABLA DE USUARIOS RECIBIDA:");
            console.table(usuarios); // Esto lo muestra en una tabla bonita en la consola
        } else {
            console.error("❌ El servidor respondió, pero hubo un problema.");
        }
    } catch (error) {
        console.error("❌ Error de conexión al intentar obtener usuarios:", error);
    }
}

// Ejecutamos la función
verUsuariosEnConsola();

// Función para hacer login con el backend
const loginUser = async (email, password) => {
    try {
        const response = await fetch('http://172.20.10.3:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correu: email, contrasenya: password })
        });
        
        // Comprobamos si la respuesta es JSON antes de parsear
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("El servidor no devolvió JSON");
        }

        const data = await response.json();

        if (response.ok) {
            console.log("Login correcto", data);
            // Guardamos el nombre en el storage para saludar en home.html
            localStorage.setItem('userName', data.user.nom);
            window.location.href = 'home.html';
        } else {
            console.error("Error en el login:", data.message);
            alert(`Error en el login: ${data.message || 'Credenciales incorrectas'}`);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert('No se pudo conectar con el servidor de Sonar. Revisa la IP o el Firewall.');
    }
};

// Funcionalidad del formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validación simple
        if (email && password) {
            // Llamar a la función de login con el backend
            await loginUser(email, password);
        } else {
            alert('Por favor, completa todos los campos');
        }
    });
}
