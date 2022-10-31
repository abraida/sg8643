var anchoEdificio = 15;
var largoEdificio = 15;
var altoMuralla = 10;
var pisosEdificio = 4;
var ladosMuralla = 8;

var rotacionCatapulta = 0;

var DIBUJAR_CASTILLO = true;
var DIBUJAR_CATAPULTA = true;
var DIBUJAR_TERRENO = true;

var disparar = function() {
	disparar_catapulta();
}

var renderizar = function() {
	setup_modelos();	
}

$("canvas").mousemove(function (e) {	
	camara.movimientoMouse(e.clientX || e.pageX, e.clientY || e.pageY);
});

$('canvas').mousedown(function (event) {
	camara.mouseDown();

});

$('canvas').mouseup(function (event) {
	camara.mouseUp();
});

function zoom(event) {
	if (event.deltaY < 0) {					
		camara.disminuirZoom(event.deltaY * -0.001);
	} else {
		camara.aumentarZoom(event.deltaY * 0.001);				
	}
}

document.addEventListener('wheel', zoom);

document.addEventListener('keyup', (event) => {
	const keyName = event.key;
	if (keyName === '1') {
		camara = orbital_castillo;
		camara.rotar();
		draw_scene();
	}
	if (keyName === '2') {
		camara = orbital_catapulta;
		camara.rotar();
		draw_scene();                
	}
	
	if (keyName === 'd') {
		disparar_catapulta();
	}
}, false);

function initMenu() {
	let gui = new dat.GUI();

	var edificio = gui.addFolder('Castillo');
	gui.add(window, "anchoEdificio", 10, 20).step(0.5);
	gui.add(window, "largoEdificio", 10, 20).step(0.5);
	gui.add(window, "pisosEdificio", 1, 10).step(1);

	var muralla = gui.addFolder('Muralla');
	gui.add(window, "altoMuralla", 5, 15).step(0.5);
	gui.add(window, "ladosMuralla", 4, 8).step(1);

	var escena = gui.addFolder("escena");

	gui.add(window, "rotacionCatapulta", 0, 360).step(1).onChange(event => {
		setup_modelos();
	});
	gui.add(window, "disparar");

	var debug = gui.addFolder('Debug');

	gui.add(window, 'DIBUJAR_CASTILLO');
	gui.add(window, 'DIBUJAR_CATAPULTA');
	gui.add(window, 'DIBUJAR_TERRENO');

	var render = gui.addFolder('Renderizar');

	gui.add(window, "renderizar");
}