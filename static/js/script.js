 document.addEventListener('DOMContentLoaded', () => {
    const menuPrincipal = document.getElementById('menu-principal');
    const pantallaSimulacion = document.getElementById('pantalla-simulacion');
    
    const btnSimulacion = document.getElementById('btn-modo-simulacion');
    const btnVolver = document.getElementById('btn-volver-menu');

    // Al hacer clic en Simulación Rápida, mostramos la pantalla de ese modo
    btnSimulacion.addEventListener('click', () => {
        menuPrincipal.classList.add('hidden');
        pantallaSimulacion.classList.remove('hidden');
    });

    // Botón para regresar al menú de modos
    btnVolver.addEventListener('click', () => {
        pantallaSimulacion.classList.add('hidden');
        menuPrincipal.classList.remove('hidden');
    });
});