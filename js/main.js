var mCastillo = null;
var mTerreno = null;
var mCatapulta = null;

var mOrbCastillo = null;  
var mOrbCat = null; 
var mFP = null; 

var mCamara = null;

var aspect=null;

var rotacionBrazo = 0;
var rotacionV = 0.01;

var anterior = vec3.create();
var actual = vec3.create();

var anteriorDis = null;
var actualDis = null;
var velDis = vec3.create();

var disparo = null;

var CATAPULTA_DISPONIBLE = true;

function disparar_catapulta() {	
	if(!CATAPULTA_DISPONIBLE)
		return;

	if (rotacionBrazo > .45) {
		disparo = mCatapulta.lanzar_municion();
		disparo.setEscala(.03, .03, .03);
		disparo.setProgram(glProgram);

		CATAPULTA_DISPONIBLE = false;
		
		anteriorDis = anterior;
		actualDis = actual;
		velDis = vec3.sub(velDis, actual, anterior);
		
		lanzar_municion();
		restaurar_catapulta();
	} else{	
		requestAnimationFrame(disparar_catapulta);

		if(disparo){
			disparo = null;
			mCatapulta.restaurar_municion();

			return;
		}
		
		mCatapulta.disparar(rotacionBrazo);
		rotacionBrazo += rotacionV;
		
		
		anterior = actual;
		actual = mCatapulta.get_municion_pos();

		draw_scene();		
	}
	
}

function restaurar_catapulta() {
	if (rotacionBrazo > 0) 
		requestAnimationFrame(restaurar_catapulta);
	else
		CATAPULTA_DISPONIBLE = true;
		
	rotacionBrazo -= rotacionV/2;
	mCatapulta.disparar(rotacionBrazo);
}

function lanzar_municion() {
	if(disparo == null)
		return;
	if(actualDis[1] <= 0){
		disparo = null;
		mCatapulta.restaurar_municion();

		return;
	}

	requestAnimationFrame(lanzar_municion);
	anteriorDis = actualDis;
	actualDis = [anteriorDis[0] + velDis[0],anteriorDis[1] + velDis[1],anteriorDis[2] +  velDis[2]];

	disparo.setPosicion(actualDis[0], actualDis[1], actualDis[2]);

	velDis[1] -= 0.00001;
}

function setup_modelos() {
	mCastillo = new Castillo(anchoEdificio, largoEdificio, pisosEdificio, ladosMuralla, altoMuralla);
	mCastillo.setPosicion(0, 0, 0);
	
	mTerreno = new Terreno();
	mTerreno.setPosicion(0, 0, 0);

	mCatapulta = new Catapulta();
	mCatapulta.setPosicion(-5, .05, -5);    
	mCatapulta.setRotacion(0,1,0, (rotacionCatapulta + 310) / 180 * Math.PI);

	mCastillo.setEscala(.1, .1, .1);
	mTerreno.setEscala(.1, .1, .1);
	mCatapulta.setEscala(.1, .1, .1);    
}



function draw_scene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	
				
	var obj = mCamara.obtenerTarget();
	
	mat4.lookAt(viewMatrix,
	vec3.fromValues(mCamara.pos[0], mCamara.pos[1], mCamara.pos[2]),
	vec3.fromValues(obj[0], obj[1], obj[2]),
	vec3.fromValues(0, 1, 0)
	);

	
	let m = mat4.create;
	mat4.identity(m, m);
	
	mCastillo.setProgram(glProgram);
	mTerreno.setProgram(glProgramTerreno);
	mCatapulta.setProgram(glProgram);
	
	var munPos = mCatapulta.get_municion_pos();
	if(disparo != null && actualDis != null){
		munPos =  actualDis;
	}
	
	var antPos = mCastillo.get_antorcha_pos();
	
	if(!lavaEmisiva)
	mTerreno.apagarLava();
	
	
	gl.useProgram(glProgram);
	
	setupVertexShaderMatrix(munPos, antPos.pos1, antPos.pos2);
	var camPosUniform = gl.getUniformLocation(glProgram, "uCamPos");
	gl.uniform3f(camPosUniform, mCamara.pos[0], mCamara.pos[1], mCamara.pos[2]);
	
	gl.useProgram(glProgramTerreno);

	setupVertexShaderMatrixTerreno(munPos, antPos.pos1, antPos.pos2);
	var camPosUniformT = gl.getUniformLocation(glProgramTerreno, "uCamPos");
	gl.uniform3f(camPosUniformT, mCamara.pos[0], mCamara.pos[1], mCamara.pos[2]);
	
	if (DIBUJAR_TERRENO)
		mTerreno.dibujar(m);
	if(DIBUJAR_CASTILLO)
		mCastillo.dibujar(m);
	if(DIBUJAR_CATAPULTA)
		mCatapulta.dibujar(m);

	if(disparo != null && actualDis != null){
		disparo.dibujar(m);
	}

}


function tick() {
	requestAnimationFrame(tick);
	mCamara.rotar();

	draw_scene();
}

window.onload = initWebGL;