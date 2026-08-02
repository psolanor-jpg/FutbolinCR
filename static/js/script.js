// Lista de países con banderas SVG y paleta de colores (Camiseta / Texto)
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
    { nombre: 'Japón', code: 'jp', color: '#000555', text: '#FFFFFF' },
    { nombre: 'Costa Rica', code: 'cr', color: '#002B7F', text: '#FFFFFF' }
];

// Base de datos de ofertas juveniles por país
const CLUBES_OFERTAS = {
    'Argentina': [
        { nombre: 'Tristán Suárez', liga: 'Primera Nacional', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Club_Social_y_Deportivo_Trist%C3%A1n_Su%C3%A1rez.png' },
        { nombre: 'Racing (C)', liga: 'Primera Nacional', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Escudo_de_Racing_de_C%C3%B3rdoba.svg/1200px-Escudo_de_Racing_de_C%C3%B3rdoba.svg.png' },
        { nombre: 'Nueva Chicago', liga: 'Primera Nacional', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Escudo_del_Club_Atl%C3%A9tico_Nueva_Chicago.svg/1200px-Escudo_del_Club_Atl%C3%A9tico_Nueva_Chicago.svg.png' }
    ],
    'Costa Rica': [
        { nombre: 'UCR Fútbol', liga: 'Liga de Ascenso', logo: 'https://cdn-icons-png.flaticon.com/512/824/824722.png' },
        { nombre: 'Uruguay de Coronado', liga: 'Liga de Ascenso', logo: 'https://cdn-icons-png.flaticon.com/512/824/824730.png' },
        { nombre: 'Consultants FC', liga: 'Liga de Ascenso', logo: 'https://cdn-icons-png.flaticon.com/512/824/824738.png' }
    ],
    'Default': [
        { nombre: 'Juventud FC', liga: 'Segunda División', logo: 'https://cdn-icons-png.flaticon.com/512/824/824722.png' },
        { nombre: 'Deportivo Promesas', liga: 'Segunda División', logo: 'https://cdn-icons-png.flaticon.com/512/824/824730.png' },
        { nombre: 'Unión Juvenil', liga: 'Segunda División', logo: 'https://cdn-icons-png.flaticon.com/512/824/824738.png' }
    ]
};

// Estado global de la selección y carrera
let estadoPerfil = {
    modoJuego: 'jugador',
    apellido: 'RAMIREZ',
    numero: '13',
    pierna: 'Izquierda',
    pais: PAISES[2], // Argentina por defecto
    posicion: 'MCO',
    ovr: 50,
    edad: 16,
    valor: '€100K',
    club: null
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

    // Filtro de búsqueda de país
    document.getElementById('buscar-pais')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.item-pais').forEach(item => {
            const texto = item.innerText.toLowerCase();
            item.style.display = texto.includes(query) ? 'flex' : 'none';
        });
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

    // Confirmar Perfil Creado -> Transición a Zona 3 (Carrera)
    document.getElementById('btn-confirmar-identidad')?.addEventListener('click', () => {
        document.getElementById('pantalla-identidad')?.classList.add('hidden');
        document.getElementById('pantalla-carrera')?.classList.remove('hidden');
        cargarPantallaCarrera();
    });

    // Control del Panel Retráctil Lateral
    document.getElementById('btn-toggle-drawer')?.addEventListener('click', () => {
        const drawer = document.getElementById('drawer-trayectoria');
        drawer?.classList.toggle('retraido');
    });
}

// Actualizar colores dinámicos de la Camiseta SVG
function actualizarCamiseta() {
    const baseSvg = document.querySelector('.camiseta-base');
    const txtApellido = document.getElementById('preview-apellido');
    const txtNumero = document.getElementById('preview-numero');

    if (baseSvg) baseSvg.setAttribute('fill', estadoPerfil.pais.color);
    if (txtApellido) txtApellido.style.color = estadoPerfil.pais.text;
    if (txtNumero) txtNumero.style.color = estadoPerfil.pais.text;
}

// Inicializar y renderizar los datos en el Hub de Carrera (Zona 3)
function cargarPantallaCarrera() {
    // 1. Renderizar Ficha del Jugador
    const tagPais = document.getElementById('carrera-pais-tag');
    if (tagPais) {
        tagPais.innerHTML = `
            <img src="https://flagcdn.com/w40/${estadoPerfil.pais.code}.png" class="img-bandera-sm"> 
            ${estadoPerfil.pais.code.toUpperCase()}
        `;
    }

    const tagPos = document.getElementById('carrera-pos-tag');
    if (tagPos) tagPos.innerText = `#${estadoPerfil.numero} ${estadoPerfil.posicion}`;

    const txtOvr = document.getElementById('carrera-ovr');
    if (txtOvr) txtOvr.innerText = estadoPerfil.ovr;

    const txtEdad = document.getElementById('carrera-edad');
    if (txtEdad) txtEdad.innerText = estadoPerfil.edad;

    const txtValor = document.getElementById('carrera-valor');
    if (txtValor) txtValor.innerText = estadoPerfil.valor;

    // 2. Actualizar Drawer Lateral
    const flagNac = document.getElementById('timeline-flag-nac');
    if (flagNac) flagNac.src = `https://flagcdn.com/w40/${estadoPerfil.pais.code}.png`;

    const paisNombre = document.getElementById('timeline-pais-nombre');
    if (paisNombre) paisNombre.innerText = estadoPerfil.pais.nombre;

    // 3. Renderizar Tarjetas de Ofertas de Cantera
    const ofertas = CLUBES_OFERTAS[estadoPerfil.pais.nombre] || CLUBES_OFERTAS['Default'];
    const contenedor = document.getElementById('contenedor-ofertas');
    
    if (contenedor) {
        contenedor.innerHTML = '';
        ofertas.forEach(club => {
            const card = document.createElement('div');
            card.className = 'card-oferta-club';
            card.innerHTML = `
                <span class="lbl-fichar">Fichar por</span>
                <h4 class="nombre-oferta-club">${club.nombre}</h4>
                <img class="escudo-club" src="${club.logo}" alt="${club.nombre}">
                <div class="liga-tag">
                    <img src="https://flagcdn.com/w40/${estadoPerfil.pais.code}.png" class="img-bandera-sm">
                    <span>${club.liga}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                estadoPerfil.club = club.nombre;
                const clubActual = document.getElementById('carrera-club-actual');
                const timelineStatus = document.getElementById('timeline-status-club');
                
                if (clubActual) clubActual.innerText = club.nombre;
                if (timelineStatus) timelineStatus.innerText = club.nombre;
            });

            contenedor.appendChild(card);
        });
    }
}