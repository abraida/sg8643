
var castillo = null;
var terreno = null;
var catapulta = null;

var orbital_castillo = new Camara(0, 0, 0, 10);
var orbital_catapulta = new Camara(-5, 0, -5, 2);
var primera_persona = new CamaraFP(-8, 1, -8, 1);

var camara = orbital_castillo;

var aspect=null;

var rotacion_brazo = 0;
var rotacion_velocidad = 0.01;

var anterior = vec3.create();
var actual = vec3.create();
var vel = vec3.create();
var disparo = null;
var DISPARO_ACTIVO = false;

function disparar_catapulta() {	
	if (rotacion_brazo > .5) {
		disparo = catapulta.lanzar_municion();
		disparo.setEscala(.03, .03, .03);
		disparo.setProgram(glProgram);
		DISPARO_ACTIVO = true;
		lanzar_municion();
		restaurar_catapulta();
	} else{
		DISPARO_ACTIVO = false;
		requestAnimationFrame(disparar_catapulta)
		catapulta.disparar(rotacion_brazo);
		rotacion_brazo += rotacion_velocidad;
		draw_scene();		
		actual = catapulta.get_municion_pos();
		vel = vec3.sub(vel, actual, anterior);	
		anterior = actual;
	}
	
}

function restaurar_catapulta() {
	if (rotacion_brazo < 0) {
		catapulta.restaurar_municion();
	} else {
		requestAnimationFrame(restaurar_catapulta);
		
	}
	
	catapulta.disparar(rotacion_brazo);
	rotacion_brazo -= rotacion_velocidad/5;
}

function lanzar_municion() {
	requestAnimationFrame(lanzar_municion);
	actual = [anterior[0] + vel[0],anterior[1] + vel[1],anterior[2] +  vel[2]]
	disparo.setPosicion(actual[0], actual[1], actual[2]);
	anterior = actual;
}

function setup_modelos() {
	castillo = crear_castillo(anchoEdificio, largoEdificio, pisosEdificio, altoMuralla, ladosMuralla);
	castillo.setPosicion(0, 0, 0);
	
	terreno = crear_terreno();
	terreno.setPosicion(0, 0, 0);

	catapulta = new Catapulta();
	catapulta.setPosicion(-5, .05, -5);    
	catapulta.setRotacion(0,1,0, (rotacionCatapulta + 310) / 180 * Math.PI);

	castillo.setEscala(.1, .1, .1);
	terreno.setEscala(.1, .1, .1);
	catapulta.setEscala(.1, .1, .1);    
}


function draw_scene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	
				
	var obj = camara.obtenerTarget();
	
	mat4.lookAt(viewMatrix,
	vec3.fromValues(camara.pos[0], camara.pos[1], camara.pos[2]),
	vec3.fromValues(obj[0], obj[1], obj[2]),
	vec3.fromValues(0, 1, 0)
	);
	
	setupVertexShaderMatrix();

	let m = mat4.create;
	mat4.identity(m, m);
	
	castillo.setProgram(glProgram);
	terreno.setProgram(glProgram);
	catapulta.setProgram(glProgram);

	if(DIBUJAR_CASTILLO)
		castillo.dibujar(m);
	if(DIBUJAR_CATAPULTA)
		catapulta.dibujar(m);
	if (DIBUJAR_TERRENO)
		terreno.dibujar(m);
	if (DISPARO_ACTIVO)
		disparo.dibujar(m);
}


function tick() {
	requestAnimationFrame(tick);
	camara.rotar();

	draw_scene();
}

window.onload = initWebGL;