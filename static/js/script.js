const PAISES = [
    { nombre: 'Brasil', code: 'br', color: '#FFE100', text: '#000000' },
    { nombre: 'Alemania', code: 'de', color: '#FFFFFF', text: '#000000' },
    { nombre: 'Argentina', code: 'ar', color: '#75AADB', text: '#FFFFFF' },
    { nombre: 'Italia', code: 'it', color: '#004BB6', text: '#FFFFFF' },
    { nombre: 'Francia', code: 'fr', color: '#002395', text: '#FFFFFF' },
    { nombre: 'España', code: 'es', color: '#C60B1E', text: '#FFE100' },
    { nombre: 'Costa Rica', code: 'cr', color: '#002B7F', text: '#FFFFFF' }
];

const CLUBES_OFERTAS = {
    'Argentina': [
        { nombre: 'Tristán Suárez', liga: 'Primera Nacional', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Club_Social_y_Deportivo_Trist%C3%A1n_Su%C3%A1rez.png' },
        { nombre: 'Racing (C)', liga: 'Primera Nacional', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Escudo_de_Racing_de_C%C3%B3rdoba.svg/1200px-Escudo_de_Racing_de_C%C3%B3rdoba.svg.png' }
    ],
    'Costa Rica': [
        { nombre: 'UCR Fútbol', liga: 'Liga de Ascenso', logo: 'https://cdn-icons-png.flaticon.com/512/824/824722.png' },
        { nombre: 'Uruguay de Coronado', liga: 'Liga de Ascenso', logo: 'https://cdn-icons-png.flaticon.com/512/824/824730.png' }
    ],
    'Default': [
        { nombre: 'Juventud FC', liga: 'Segunda División', logo: 'https://cdn-icons-png.flaticon.com/512/824/824722.png' },
        { nombre: 'Deportivo Promesas', liga: 'Segunda División', logo: 'https://cdn-icons-png.flaticon.com/512/824/824730.png' }
    ]
};

let estadoPerfil = {
    apellido: 'RAMIREZ',
    numero: '13',
    pierna: 'Izquierda',
    pais: PAISES[2],
    posicion: 'MCO',
    ovr: 50,
    club: null
};

document.addEventListener('DOMContentLoaded', () => {
    initNacionalidades();
    initEventos();
    actualizarCamiseta();
});

function initNacionalidades() {
    const contenedor = document.getElementById('contenedor-paises');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    PAISES.forEach(p => {
        const div = document.createElement('div');
        div.className = `item-pais ${p.nombre === estadoPerfil.pais.nombre ? 'active' : ''}`;
        div.innerHTML = `<img class="img-bandera" src="https://flagcdn.com/w40/${p.code}.png"> <span>${p.nombre}</span>`;
        div.addEventListener('click', () => {
            document.querySelectorAll('.item-pais').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            estadoPerfil.pais = p;
            actualizarCamiseta();
        });
        contenedor.appendChild(div);
    });
}

function initEventos() {
    // Abrir pantalla de Perfil
    document.querySelectorAll('.btn-iniciar').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('menu-principal').classList.add('hidden');
            document.getElementById('pantalla-identidad').classList.remove('hidden');
        });
    });

    // Volver
    document.getElementById('btn-volver-identidad')?.addEventListener('click', () => {
        document.getElementById('pantalla-identidad').classList.add('hidden');
        document.getElementById('menu-principal').classList.remove('hidden');
    });

    // Inputs
    document.getElementById('input-apellido')?.addEventListener('input', (e) => {
        estadoPerfil.apellido = e.target.value.toUpperCase() || 'RAMIREZ';
        document.getElementById('preview-apellido').innerText = estadoPerfil.apellido;
    });

    document.getElementById('input-numero')?.addEventListener('input', (e) => {
        estadoPerfil.numero = e.target.value || '13';
        document.getElementById('preview-numero').innerText = estadoPerfil.numero;
    });

    // Posición
    document.querySelectorAll('.btn-pos').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-pos').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estadoPerfil.posicion = btn.dataset.pos;
        });
    });

    // Paso a la Pantalla de Elección de Ofertas
    document.getElementById('btn-confirmar-identidad')?.addEventListener('click', () => {
        document.getElementById('pantalla-identidad').classList.add('hidden');
        document.getElementById('pantalla-ofertas').classList.remove('hidden');
        renderPantallaOfertas();
    });
}

function actualizarCamiseta() {
    const baseSvg = document.querySelector('.camiseta-base');
    if (baseSvg) baseSvg.setAttribute('fill', estadoPerfil.pais.color);
    document.getElementById('preview-apellido').style.color = estadoPerfil.pais.text;
    document.getElementById('preview-numero').style.color = estadoPerfil.pais.text;
}

// Renderizar las ofertas iniciales
function renderPantallaOfertas() {
    const ofertas = CLUBES_OFERTAS[estadoPerfil.pais.nombre] || CLUBES_OFERTAS['Default'];
    const contenedor = document.getElementById('contenedor-ofertas-iniciales');
    contenedor.innerHTML = '';

    ofertas.forEach(club => {
        const card = document.createElement('div');
        card.className = 'card-oferta-club';
        card.innerHTML = `
            <span class="lbl-fichar">Propuesta de Cantera</span>
            <h3 class="nombre-oferta-club">${club.nombre}</h3>
            <img class="escudo-club" src="${club.logo}">
            <div class="liga-tag">
                <img src="https://flagcdn.com/w40/${estadoPerfil.pais.code}.png" class="img-bandera">
                <span>${club.liga}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            estadoPerfil.club = club.nombre;
            // Pasar a la Cancha / Hub Principal de Carrera
            document.getElementById('pantalla-ofertas').classList.add('hidden');
            document.getElementById('pantalla-carrera').classList.remove('hidden');
            iniciarHubCarrera();
        });

        contenedor.appendChild(card);
    });
}

// Cargar la cancha y datos del Hub
function iniciarHubCarrera() {
    document.getElementById('carrera-flag').src = `https://flagcdn.com/w40/${estadoPerfil.pais.code}.png`;
    document.getElementById('carrera-nombre-bar').innerText = estadoPerfil.apellido;
    document.getElementById('carrera-pos-bar').innerText = estadoPerfil.posicion;
    document.getElementById('carrera-club-bar').innerText = estadoPerfil.club;
    document.getElementById('token-pos').innerText = estadoPerfil.posicion;
}