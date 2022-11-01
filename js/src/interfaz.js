var anchoEdificio = 15;
var largoEdificio = 15;
var altoMuralla = 10;
var pisosEdificio = 4;
var ladosMuralla = 8;

var rotacionCatapulta = 0;

var DIBUJAR_CASTILLO = true;
var DIBUJAR_CATAPULTA = true;
var DIBUJAR_TERRENO = true;

var adelante = null;
var derecha = null;

parameters = {
  a: true,
  b: false,
  c: false
}

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

document.addEventListener('keydown', (event) => {
	const keyName = event.key;
      	switch(event.key){
		case "a":
			camara.mover(1, 0);

		break;
		case "d":
			camara.mover(-1, 0);
		break;


		case "w":
			camara.mover(0, 1);
		break;  
		case "s":
			camara.mover(0, -1);
		break;

		case "q":
                	camara.rotarEje(0.1);

		break; 
		case "e":
                	camara.rotarEje(-0.1);
		break;        
		
		case '1':
			camara = orbital_castillo;
			setChecked('a');
			camara.rotar();
		break;

		case '2':
			camara = orbital_catapulta;
			setChecked('b');
			camara.rotar();

		break;

		case '3':
			camara = primera_persona;
			setChecked('c');

			camara.rotar();
		break;


		case 'l':
			disparar_catapulta();		
		break;

        }
}, false);

function setChecked( prop ){
	for (let param in parameters){
		parameters[param] = false;
	}
	parameters[prop] = true;
}

function initMenu() {
	let gui = new dat.GUI();

	var edificio = gui.addFolder('Castillo');
	gui.add(window, "anchoEdificio", 10, 20).step(0.5);
	gui.add(window, "largoEdificio", 10, 20).step(0.5);
	gui.add(window, "pisosEdificio", 1, 10).step(1);

	var muralla = gui.addFolder('Muralla');
	gui.add(window, "altoMuralla", 5, 15).step(0.5);
	gui.add(window, "ladosMuralla", 4, 8).step(1);

	var escena = gui.addFolder("Escena");

	gui.add(window, "rotacionCatapulta", 0, 360).step(1).onChange(event => {
		setup_modelos();
	});
	gui.add(window, "disparar");



	var first = gui.addFolder("Camara");
	var pos1 = gui.add(parameters, 'a').name('Castillo').listen().onChange(function(){
		setChecked("a");
		camara = orbital_castillo;
	});
	var neg1 = gui.add(parameters, 'b').name('Catapulta').listen().onChange(function(){
		setChecked("b");
		camara = orbital_catapulta;
	});
	var neu1 = gui.add(parameters, 'c').name('Primera Persona').listen().onChange(function(){
		setChecked("c");
		camara = primera_persona;

	});

	var render = gui.addFolder('Renderizar');

	gui.add(window, "renderizar");
}