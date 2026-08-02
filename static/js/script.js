// Lista de países con banderas SVG y paleta de colores
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

// Ofertas juveniles por país
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

// Coordenadas para posicionar la ficha táctica en el campo
const COORDENADAS_POSICION = {
    'POR': { top: '50%', left: '8%' },
    'DFC': { top: '50%', left: '22%' },
    'LI': { top: '20%', left: '25%' },
    'LD': { top: '80%', left: '25%' },
    'MCD': { top: '50%', left: '38%' },
    'MC': { top: '50%', left: '50%' },
    'MI': { top: '20%', left: '50%' },
    'MD': { top: '80%', left: '50%' },
    'MCO': { top: '50%', left: '65%' },
    'EI': { top: '20%', left: '78%' },
    'ED': { top: '80%', left: '78%' },
    'DC': { top: '50%', left: '85%' }
};

// Estado global de la carrera
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
    pj: 0,
    goles: 0,
    club: null
};

document.addEventListener('DOMContentLoaded', () => {
    comprobarPartidaGuardada();
    initNacionalidades();
    initEventos();
    actualizarCamiseta();
});

function comprobarPartidaGuardada() {
    const data = localStorage.getItem('futbolincr_carrera');
    if (data) {
        document.getElementById('btn-cargar-carrera')?.classList.remove('hidden');
    }
}

function guardarPartida() {
    localStorage.setItem('futbolincr_carrera', JSON.stringify(estadoPerfil));
}

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
    // Iniciar desde el menú
    document.querySelectorAll('.btn-iniciar').forEach(btn => {
        btn.addEventListener('click', () => {
            estadoPerfil.modoJuego = btn.dataset.modo;
            document.getElementById('menu-principal')?.classList.add('hidden');
            document.getElementById('pantalla-identidad')?.classList.remove('hidden');
        });
    });

    // Cargar carrera
    document.getElementById('btn-cargar-carrera')?.addEventListener('click', () => {
        const data = localStorage.getItem('futbolincr_carrera');
        if (data) {
            estadoPerfil = JSON.parse(data);
            document.getElementById('menu-principal')?.classList.add('hidden');
            document.getElementById('pantalla-carrera')?.classList.remove('hidden');
            cargarPantallaCarrera();
        }
    });

    // Volver de Identidad
    document.getElementById('btn-volver-identidad')?.addEventListener('click', () => {
        document.getElementById('pantalla-identidad')?.classList.add('hidden');
        document.getElementById('menu-principal')?.classList.remove('hidden');
    });

    // Filtro de búsqueda
    document.getElementById('buscar-pais')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.item-pais').forEach(item => {
            item.style.display = item.innerText.toLowerCase().includes(query) ? 'flex' : 'none';
        });
    });

    // Inputs dinámicos
    document.getElementById('input-apellido')?.addEventListener('input', (e) => {
        estadoPerfil.apellido = e.target.value.toUpperCase() || 'RAMIREZ';
        const p = document.getElementById('preview-apellido');
        if (p) p.innerText = estadoPerfil.apellido;
    });

    document.getElementById('input-numero')?.addEventListener('input', (e) => {
        estadoPerfil.numero = e.target.value || '13';
        const p = document.getElementById('preview-numero');
        if (p) p.innerText = estadoPerfil.numero;
    });

    // Pierna
    document.querySelectorAll('.btn-pierna').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-pierna').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estadoPerfil.pierna = btn.dataset.pierna;
        });
    });

    // Posición
    document.querySelectorAll('.btn-pos').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-pos').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estadoPerfil.posicion = btn.dataset.pos;
        });
    });

    // Confirmar Identidad -> Ir a Ofertas Iniciales (ZONA 3.1)
    document.getElementById('btn-confirmar-identidad')?.addEventListener('click', () => {
        document.getElementById('pantalla-identidad')?.classList.add('hidden');
        document.getElementById('pantalla-ofertas')?.classList.remove('hidden');
        cargarPantallaOfertasIniciales();
    });

    // Toggle Drawer Lateral
    document.getElementById('btn-toggle-drawer')?.addEventListener('click', () => {
        document.getElementById('drawer-trayectoria')?.classList.toggle('retraido');
    });

    // Partido y Reset
    document.getElementById('btn-jugar-partido')?.addEventListener('click', simularPartido);

    document.getElementById('btn-cerrar-partido')?.addEventListener('click', () => {
        document.getElementById('modal-partido')?.classList.add('hidden');
        cargarPantallaCarrera();
    });

    document.getElementById('btn-reset-partida')?.addEventListener('click', () => {
        if (confirm('¿Reiniciar todo el progreso?')) {
            localStorage.removeItem('futbolincr_carrera');
            location.reload();
        }
    });
}

function actualizarCamiseta() {
    const baseSvg = document.querySelector('.camiseta-base');
    const txtApellido = document.getElementById('preview-apellido');
    const txtNumero = document.getElementById('preview-numero');

    if (baseSvg) baseSvg.setAttribute('fill', estadoPerfil.pais.color);
    if (txtApellido) txtApellido.style.color = estadoPerfil.pais.text;
    if (txtNumero) txtNumero.style.color = estadoPerfil.pais.text;
}

// ZONA 3.1: Renderizar vista intermedia de selección de club inicial
function cargarPantallaOfertasIniciales() {
    const ofertas = CLUBES_OFERTAS[estadoPerfil.pais.nombre] || CLUBES_OFERTAS['Default'];
    const contenedor = document.getElementById('contenedor-ofertas-iniciales');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    ofertas.forEach(club => {
        const card = document.createElement('div');
        card.className = 'card-oferta-club';
        card.innerHTML = `
            <span class="lbl-fichar">Primer Contrato</span>
            <h4 class="nombre-oferta-club">${club.nombre}</h4>
            <img class="escudo-club" src="${club.logo}" alt="${club.nombre}">
            <div class="liga-tag">
                <img src="https://flagcdn.com/w40/${estadoPerfil.pais.code}.png" class="img-bandera-sm">
                <span>${club.liga}</span>
            </div>
        `;
        card.addEventListener('click', () => {
            estadoPerfil.club = club.nombre;
            guardarPartida();
            document.getElementById('pantalla-ofertas')?.classList.add('hidden');
            document.getElementById('pantalla-carrera')?.classList.remove('hidden');
            cargarPantallaCarrera();
        });
        contenedor.appendChild(card);
    });
}

// ZONA 3.2: Renderizar Hub de Carrera
function cargarPantallaCarrera() {
    // Header
    const flag = document.getElementById('carrera-flag');
    if (flag) flag.src = `https://flagcdn.com/w40/${estadoPerfil.pais.code}.png`;

    const txtNombre = document.getElementById('carrera-nombre-bar');
    if (txtNombre) txtNombre.innerText = estadoPerfil.apellido;

    const txtPosBar = document.getElementById('carrera-pos-bar');
    if (txtPosBar) txtPosBar.innerText = `#${estadoPerfil.numero} ${estadoPerfil.posicion}`;

    const txtClubBar = document.getElementById('carrera-club-bar');
    if (txtClubBar) txtClubBar.innerText = estadoPerfil.club || 'Sin Club';

    // Stats
    const txtOvr = document.getElementById('carrera-ovr');
    if (txtOvr) txtOvr.innerText = estadoPerfil.ovr;

    const txtEdad = document.getElementById('carrera-edad');
    if (txtEdad) txtEdad.innerText = estadoPerfil.edad;

    const txtValor = document.getElementById('carrera-valor');
    if (txtValor) txtValor.innerText = estadoPerfil.valor;

    const txtPj = document.getElementById('stat-pj');
    if (txtPj) txtPj.innerText = estadoPerfil.pj;

    const txtGoles = document.getElementById('stat-goles');
    if (txtGoles) txtGoles.innerText = estadoPerfil.goles;

    // Token en Cancha
    const token = document.getElementById('token-cancha');
    const tokenPos = document.getElementById('token-pos');
    if (token && tokenPos) {
        tokenPos.innerText = estadoPerfil.posicion;
        const coords = COORDENADAS_POSICION[estadoPerfil.posicion] || { top: '50%', left: '50%' };
        token.style.top = coords.top;
        token.style.left = coords.left;
    }

    // Drawer Lateral
    const flagNac = document.getElementById('timeline-flag-nac');
    if (flagNac) flagNac.src = `https://flagcdn.com/w40/${estadoPerfil.pais.code}.png`;

    const paisNombre = document.getElementById('timeline-pais-nombre');
    if (paisNombre) paisNombre.innerText = estadoPerfil.pais.nombre;

    const timelineStatus = document.getElementById('timeline-status-club');
    if (timelineStatus) timelineStatus.innerText = estadoPerfil.club || 'Libre';

    // Ofertas del Drawer
    const ofertas = CLUBES_OFERTAS[estadoPerfil.pais.nombre] || CLUBES_OFERTAS['Default'];
    const contenedorDrawer = document.getElementById('contenedor-ofertas-drawer');
    
    if (contenedorDrawer) {
        contenedorDrawer.innerHTML = '';
        ofertas.forEach(club => {
            const card = document.createElement('div');
            card.className = 'card-oferta-club';
            card.innerHTML = `
                <span class="lbl-fichar">Traspaso a</span>
                <h4 class="nombre-oferta-club">${club.nombre}</h4>
                <img class="escudo-club" src="${club.logo}" alt="${club.nombre}">
                <div class="liga-tag">
                    <img src="https://flagcdn.com/w40/${estadoPerfil.pais.code}.png" class="img-bandera-sm">
                    <span>${club.liga}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                estadoPerfil.club = club.nombre;
                guardarPartida();
                cargarPantallaCarrera();
                document.getElementById('drawer-trayectoria')?.classList.add('retraido');
            });
            contenedorDrawer.appendChild(card);
        });
    }
}

// Simulador
function simularPartido() {
    if (!estadoPerfil.club) {
        alert('Debes firmar con un equipo primero.');
        return;
    }

    const modal = document.getElementById('modal-partido');
    const log = document.getElementById('sim-log');
    const resTxt = document.getElementById('sim-resultado');
    const btnCerrar = document.getElementById('btn-cerrar-partido');

    document.getElementById('sim-local').innerText = estadoPerfil.club;
    document.getElementById('sim-visita').innerText = 'Rival FC';
    resTxt.innerText = '0 - 0';
    log.innerHTML = '';
    btnCerrar.classList.add('hidden');
    modal.classList.remove('hidden');

    let golesLocal = 0;
    let golesVisita = 0;
    let minuto = 0;
    let misGoles = 0;

    const intervalo = setInterval(() => {
        minuto += 15;
        const probGol = estadoPerfil.ovr / 180; 
        const rand = Math.random();

        if (rand < 0.3) {
            if (Math.random() < probGol) {
                golesLocal++;
                misGoles++;
                log.innerHTML += `<div>⚽ <strong>Min ${minuto}':</strong> ¡GOL DE ${estadoPerfil.apellido}!</div>`;
            } else {
                golesLocal++;
                log.innerHTML += `<div>⚽ <strong>Min ${minuto}':</strong> Gol de tu equipo.</div>`;
            }
        } else if (rand > 0.7) {
            golesVisita++;
            log.innerHTML += `<div>⚠️ <strong>Min ${minuto}':</strong> Gol del rival.</div>`;
        } else {
            log.innerHTML += `<div>⏱️ <strong>Min ${minuto}':</strong> Balón disputado.</div>`;
        }

        resTxt.innerText = `${golesLocal} - ${golesVisita}`;
        log.scrollTop = log.scrollHeight;

        if (minuto >= 90) {
            clearInterval(intervalo);
            estadoPerfil.pj += 1;
            estadoPerfil.goles += misGoles;
            estadoPerfil.ovr += misGoles;

            log.innerHTML += `<div style="color: #22c55e; margin-top: 8px;"><strong>Fin del Partido.</strong> Anotaste ${misGoles} gol(es).</div>`;
            guardarPartida();
            btnCerrar.classList.remove('hidden');
        }
    }, 500);
}