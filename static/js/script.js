// Lista de países solicitados con banderas SVG oficiales y paleta de colores (Camiseta / Texto)
const PAISES = [
    { nombre: 'Brasil', code: 'br', color: '#FFE100', text: '#000000' },
    { nombre: 'Alemania', code: 'de', color: '#FFFFFF', text: '#000000' },
    { nombre: 'Argentina', code: 'ar', color: '#75AADB', text: '#FFFFFF' },
    { nombre: 'Italia', code: 'it', color: '#004BB6', text: '#FFFFFF' },
    { nombre: 'Francia', code: 'fr', color: '#002395', text: '#FFFFFF' },
    { nombre: 'España', code: 'es', color: '#C60B1E', text: '#FFE100' },
    { nombre: 'Inglaterra', code: 'gb-eng', color: '#FFFFFF', text: '#CF081F' },
    { nombre: 'Países Bajos', code: 'nl', color: '#F65200', text: '#FFFFFF' },
    { nombre: 'Uruguay', code: 'uy', color: '#55B5E5', text: '#FFFFFF' },
    { nombre: 'Portugal', code: 'pt', color: '#046A38', text: '#FFFFFF' },
    { nombre: 'Bélgica', code: 'be', color: '#E30613', text: '#FFE100' },
    { nombre: 'Croacia', code: 'hr', color: '#FF0000', text: '#FFFFFF' },
    { nombre: 'República Checa', code: 'cz', color: '#D7141A', text: '#FFFFFF' },
    { nombre: 'Hungría', code: 'hu', color: '#477050', text: '#FFFFFF' },
    { nombre: 'Dinamarca', code: 'dk', color: '#C8102E', text: '#FFFFFF' },
    { nombre: 'Colombia', code: 'co', color: '#FCD116', text: '#003893' },
    { nombre: 'México', code: 'mx', color: '#006847', text: '#FFFFFF' },
    { nombre: 'Polonia', code: 'pl', color: '#DC143C', text: '#FFFFFF' },
    { nombre: 'Suecia', code: 'se', color: '#FECC00', text: '#006AA7' },
    { nombre: 'Japón', code: 'jp', color: '#000555', text: '#FFFFFF' }
];

// Estado global de la selección
let estadoPerfil = {
    modoJuego: 'simulacion',
    apellido: 'RAMIREZ',
    numero: '13',
    pierna: 'Izquierda',
    pais: PAISES[1], // Alemania por defecto
    posicion: 'MCO'
};

document.addEventListener('DOMContentLoaded', () => {
    initNacionalidades();
    initEventos();
    actualizarCamiseta();
});

// Renderizar lista de países con banderas en SVG
function initNacionalidades() {
    const contenedor = document.getElementById('contenedor-paises');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    PAISES.forEach(p => {
        const div = document.createElement('div');
        div.className = `item-pais ${p.nombre === estadoPerfil.pais.nombre ? 'active' : ''}`;
        div.innerHTML = `
            <img class="img-bandera" src="https://flagcdn.com/w40/${p.code}.png" alt="${p.nombre}">
            <span>${p.nombre}</span>
        `;
        div.addEventListener('click', () => {
            document.querySelectorAll('.item-pais').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            estadoPerfil.pais = p;
            actualizarCamiseta();
        });
        contenedor.appendChild(div);
    });
}

// Filtro de búsqueda de país
document.getElementById('buscar-pais')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.item-pais').forEach(item => {
        const texto = item.innerText.toLowerCase();
        item.style.display = texto.includes(query) ? 'flex' : 'none';
    });
});

function initEventos() {
    // Abrir pantalla de creación de perfil desde el menú
    document.querySelectorAll('.btn-iniciar').forEach(btn => {
        btn.addEventListener('click', () => {
            estadoPerfil.modoJuego = btn.dataset.modo;
            document.getElementById('menu-principal')?.classList.add('hidden');
            document.getElementById('pantalla-identidad')?.classList.remove('hidden');
        });
    });

    // Volver al menú principal
    document.getElementById('btn-volver-identidad')?.addEventListener('click', () => {
        document.getElementById('pantalla-identidad')?.classList.add('hidden');
        document.getElementById('menu-principal')?.classList.remove('hidden');
    });

    // Actualización de texto e inputs en tiempo real
    const inputApellido = document.getElementById('input-apellido');
    const inputNumero = document.getElementById('input-numero');

    inputApellido?.addEventListener('input', (e) => {
        estadoPerfil.apellido = e.target.value.toUpperCase() || 'APELLIDO';
        const preview = document.getElementById('preview-apellido');
        if (preview) preview.innerText = estadoPerfil.apellido;
    });

    inputNumero?.addEventListener('input', (e) => {
        estadoPerfil.numero = e.target.value || '10';
        const preview = document.getElementById('preview-numero');
        if (preview) preview.innerText = estadoPerfil.numero;
    });

    // Selección de Pierna hábil
    document.querySelectorAll('.btn-pierna').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-pierna').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estadoPerfil.pierna = btn.dataset.pierna;
        });
    });

    // Seleccionar Posición táctica
    document.querySelectorAll('.btn-pos').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-pos').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estadoPerfil.posicion = btn.dataset.pos;
        });
    });

    // Confirmar Perfil Creado
    document.getElementById('btn-confirmar-identidad')?.addEventListener('click', () => {
        alert(`¡Perfil Creado!\nModo: ${estadoPerfil.modoJuego}\nJugador: ${estadoPerfil.apellido} (#${estadoPerfil.numero})\nPaís: ${estadoPerfil.pais.nombre}\nPosición: ${estadoPerfil.posicion}`);
    });
}

// Actualizar colores dinámicos de la Camiseta
function actualizarCamiseta() {
    const baseSvg = document.querySelector('.camiseta-base');
    const txtApellido = document.getElementById('preview-apellido');
    const txtNumero = document.getElementById('preview-numero');

    if (baseSvg) baseSvg.setAttribute('fill', estadoPerfil.pais.color);
    if (txtApellido) txtApellido.style.color = estadoPerfil.pais.text;
    if (txtNumero) txtNumero.style.color = estadoPerfil.pais.text;
}