var anchoEdificio = 15;
var largoEdificio = 15;
var altoMuralla = 8;
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

lights = {
	amb: "#0e0e1f",
	diff: "#7b7bb2",
	spec: "#000000",
	ant1: "#000000",
	ant2: "#000000",
	cat: "#000000",
}

var ambColor = hexToRgb(lights.amb);
var diffColor = hexToRgb(lights.diff);
var antColor1 = hexToRgb(lights.ant1);
var antColor2 = hexToRgb(lights.ant2);
var catColor = hexToRgb(lights.cat);




var disparar = function() {
	disparar_catapulta();
}

var renderizar = function() {
	setup_modelos();	
}

$("canvas").mousemove(function (e) {	
	if(!mCamara)
		return;

	mCamara.movimientoMouse(e.clientX || e.pageX, e.clientY || e.pageY);
});



$('canvas').mousedown(function (e) {
	if(!mCamara)
		return;
		
	mCamara.mouseDown(e.clientX || e.pageX, e.clientY || e.pageY);

});

$('canvas').mouseup(function (event) {
	if(!mCamara)
		return;
		
	mCamara.mouseUp();
});

function zoom(event) {
	if (event.deltaY < 0) {					
		mCamara.disminuirZoom(event.deltaY * -0.001);
	} else {
		mCamara.aumentarZoom(event.deltaY * 0.001);				
	}
}

document.addEventListener('wheel', zoom);

document.addEventListener('keydown', (event) => {
	const keyName = event.key;
      	switch(event.key){
		case "a":
			mCamara.mover(1, 0);

		break;
		case "d":
			mCamara.mover(-1, 0);
		break;


		case "w":
			mCamara.mover(0, 1);
		break;  
		case "s":
			mCamara.mover(0, -1);
		break;

		case "q":
                	mCamara.rotarEje(0.1);

		break; 
		case "e":
                	mCamara.rotarEje(-0.1);
		break;        
		
		case '1':
			mCamara = mOrbCastillo;
			setChecked('a');
			mCamara.rotar();
		break;

		case '2':
			mCamara = mOrbCat;
			setChecked('b');
			mCamara.rotar();

		break;

		case '3':
			mCamara = mFP;
			setChecked('c');

			mCamara.rotar();
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
	edificio.add(window, "anchoEdificio", 10, 20).step(0.5);
	edificio.add(window, "largoEdificio", 10, 20).step(0.5);
	edificio.add(window, "pisosEdificio").step(1);
	edificio.add(window, "altoMuralla", 5, 15).step(0.5);
	edificio.add(window, "ladosMuralla", 4, 8).step(1);
	edificio.add(window, "renderizar");

	var escena = gui.addFolder("Escena");

	escena.add(window, "rotacionCatapulta", 0, 360).step(1).onChange(event => {
		setup_modelos();
	});
	escena.add(window, "disparar");



	var cam = gui.addFolder("Camara");
	cam.add(parameters, 'a').name('Castillo').listen().onChange(function(){
		setChecked("a");
		mCamara = mOrbCastillo;
	});
	cam.add(parameters, 'b').name('Catapulta').listen().onChange(function(){
		setChecked("b");
		mCamara = mOrbCat;
	});
	cam.add(parameters, 'c').name('Primera Persona').listen().onChange(function(){
		setChecked("c");
		mCamara = mFP;

	});

	var fLight = gui.addFolder("Luces");
	fLight.addColor(lights, "amb").onChange(function() {
		ambColor = hexToRgb(lights.amb);
	});

	fLight.addColor(lights, "diff").onChange(function() {
		diffColor = hexToRgb(lights.diff);
	});
	fLight.addColor(lights, "spec").onChange(function() {
		specColor = hexToRgb(lights.spec);
	});
	fLight.addColor(lights, "ant1").onChange(function() {
		antColor1 = hexToRgb(lights.ant1);
	});
	fLight.addColor(lights, "ant2").onChange(function() {
		antColor2 = hexToRgb(lights.ant2);
	});
	fLight.addColor(lights, "cat").onChange(function() {
		catColor = hexToRgb(lights.cat);
	});

}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return [parseInt(result[1], 16)/255, parseInt(result[2], 16)/255, parseInt(result[3], 16)/255]
}