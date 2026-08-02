// Lista de los países solicitados con sus colores (Camiseta / Texto)
const PAISES = [
    { nombre: 'Brasil', flag: '🇧🇷', color: '#FFE100', text: '#000000' },
    { nombre: 'Alemania', flag: '🇩🇪', color: '#FFFFFF', text: '#000000' },
    { nombre: 'Argentina', flag: '🇦🇷', color: '#75AADB', text: '#FFFFFF' },
    { nombre: 'Italia', flag: '🇮🇹', color: '#004BB6', text: '#FFFFFF' },
    { nombre: 'Francia', flag: '🇫🇷', color: '#002395', text: '#FFFFFF' },
    { nombre: 'España', flag: '🇪🇸', color: '#C60B1E', text: '#FFE100' },
    { nombre: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#FFFFFF', text: '#CF081F' },
    { nombre: 'Países Bajos', flag: '🇳🇱', color: '#F65200', text: '#FFFFFF' },
    { nombre: 'Uruguay', flag: '🇺🇾', color: '#55B5E5', text: '#FFFFFF' },
    { nombre: 'Portugal', flag: '🇵🇹', color: '#046A38', text: '#FFFFFF' },
    { nombre: 'Bélgica', flag: '🇧🇪', color: '#E30613', text: '#FFE100' },
    { nombre: 'Croacia', flag: '🇭🇷', color: '#FF0000', text: '#FFFFFF' },
    { nombre: 'República Checa', flag: '🇨🇿', color: '#D7141A', text: '#FFFFFF' },
    { nombre: 'Hungría', flag: '🇭🇺', color: '#477050', text: '#FFFFFF' },
    { nombre: 'Dinamarca', flag: '🇩🇰', color: '#C8102E', text: '#FFFFFF' },
    { nombre: 'Colombia', flag: '🇨🇴', color: '#FCD116', text: '#003893' },
    { nombre: 'México', flag: '🇲🇽', color: '#006847', text: '#FFFFFF' },
    { nombre: 'Polonia', flag: '🇵🇱', color: '#DC143C', text: '#FFFFFF' },
    { nombre: 'Suecia', flag: '🇸🇪', color: '#FECC00', text: '#006AA7' },
    { nombre: 'Japón', flag: '🇯🇵', color: '#000555', text: '#FFFFFF' }
];

// Estado de la selección
let estadoIdentidad = {
    modoJuego: 'simulacion',
    apellido: 'APELLIDO',
    numero: '10',
    pierna: 'Derecha',
    pais: PAISES[1], // Alemania por defecto
    posicion: 'MC'
};

document.addEventListener('DOMContentLoaded', () => {
    initNacionalidades();
    initEventos();
    actualizarCamiseta();
});

// Renderizar lista de países
function initNacionalidades() {
    const contenedor = document.getElementById('contenedor-paises');
    contenedor.innerHTML = '';

    PAISES.forEach(p => {
        const div = document.createElement('div');
        div.className = `item-pais ${p.nombre === estadoIdentidad.pais.nombre ? 'active' : ''}`;
        div.innerHTML = `<span>${p.flag}</span> <span>${p.nombre}</span>`;
        div.addEventListener('click', () => {
            document.querySelectorAll('.item-pais').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            estadoIdentidad.pais = p;
            actualizarCamiseta();
        });
        contenedor.appendChild(div);
    });
}

// Filtro de búsqueda de país
document.getElementById('buscar-pais').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.item-pais').forEach(item => {
        const texto = item.innerText.toLowerCase();
        item.style.display = texto.includes(query) ? 'flex' : 'none';
    });
});

function initEventos() {
    // Abrir pantalla de identidad desde el menú
    document.querySelectorAll('.btn-iniciar').forEach(btn => {
        btn.addEventListener('click', () => {
            estadoIdentidad.modoJuego = btn.dataset.modo;
            document.getElementById('menu-principal').classList.add('hidden');
            document.getElementById('pantalla-identidad').classList.remove('hidden');
        });
    });

    // Volver al menú
    document.getElementById('btn-volver-identidad').addEventListener('click', () => {
        document.getElementById('pantalla-identidad').classList.add('hidden');
        document.getElementById('menu-principal').classList.remove('hidden');
    });

    // Inputs en tiempo real
    const inputApellido = document.getElementById('input-apellido');
    const inputNumero = document.getElementById('input-numero');

    inputApellido.addEventListener('input', (e) => {
        estadoIdentidad.apellido = e.target.value.toUpperCase() || 'APELLIDO';
        document.getElementById('preview-apellido').innerText = estadoIdentidad.apellido;
    });

    inputNumero.addEventListener('input', (e) => {
        estadoIdentidad.numero = e.target.value || '10';
        document.getElementById('preview-numero').innerText = estadoIdentidad.numero;
    });

    // Pierna hábil
    document.querySelectorAll('.btn-pierna').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-pierna').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estadoIdentidad.pierna = btn.dataset.pierna;
        });
    });

    // Seleccionar Posición
    document.querySelectorAll('.btn-pos').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-pos').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estadoIdentidad.posicion = btn.dataset.pos;
        });
    });

    // Confirmar
    document.getElementById('btn-confirmar-identidad').addEventListener('click', () => {
        alert(`¡Identidad Creada!\nModo: ${estadoIdentidad.modoJuego}\nJugador: ${estadoIdentidad.apellido} (#${estadoIdentidad.numero})\nPaís: ${estadoIdentidad.pais.nombre}\nPosición: ${estadoIdentidad.posicion}`);
    });
}

// Actualizar colores de la Camiseta dinámicamente según el País
function actualizarCamiseta() {
    const baseSvg = document.querySelector('.camiseta-base');
    const txtApellido = document.getElementById('preview-apellido');
    const txtNumero = document.getElementById('preview-numero');

    baseSvg.setAttribute('fill', estadoIdentidad.pais.color);
    txtApellido.style.color = estadoIdentidad.pais.text;
    txtNumero.style.color = estadoIdentidad.pais.text;
}