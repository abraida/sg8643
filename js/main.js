var mCastillo = null;
var mTerreno = null;
var mCatapulta = null;
var mCielo = null;

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var viewDirectionProjectionInverseMatrix = mat4.create();

var rotacionBrazo = 0;
var rotacionV = 0.01;

var anterior = vec3.create();
var actual = vec3.create();

var anteriorDis = null;
var actualDis = null;
var velDis = vec3.create();

var disparo = null;
var CATAPULTA_DISPONIBLE = true;


antPos1 = null
antPos2 = null

var skyTexs = [
	"res/sky/right.png",
	"res/sky/left.png",
	"res/sky/bottom.png",
	"res/sky/top.png",
	"res/sky/front.png",
	"res/sky/back.png",
]

modelMatrixUniform = null;
viewMatrixUniform = null;
projMatrixUniform = null;
normalMatrixUniform = null;

ambientColorUniform = null;
lightColorsUniform = null;
lightPosUniform = null;
lightConstUniform = null;
lightIsDirUniform = null;
debugMode = null;
camPosUniform = null;


function getUniforms(program) {
	modelMatrixUniform = gl.getUniformLocation(program, "modelMatrix");
	viewMatrixUniform = gl.getUniformLocation(program, "viewMatrix");
	projMatrixUniform = gl.getUniformLocation(program, "projMatrix");
	normalMatrixUniform = gl.getUniformLocation(program, "normalMatrix");

	ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
	lightColorsUniform = gl.getUniformLocation(program, "uLightColor");
	lightPosUniform = gl.getUniformLocation(program, "uLightPos");
	lightConstUniform = gl.getUniformLocation(program, "uLightConst");
	lightIsDirUniform = gl.getUniformLocation(program, "uLightIsDirectional");

	debugMode = gl.getUniformLocation(program, "debugMode");
	camPosUniform = gl.getUniformLocation(program, "uCamPos");
}

function setupMatrices() {
	var obj = mCamara.obtenerTarget();
	
	mat4.lookAt(viewMatrix,
		vec3.fromValues(mCamara.pos[0], mCamara.pos[1], mCamara.pos[2]),
		vec3.fromValues(obj[0], obj[1], obj[2]),
		vec3.fromValues(0, 1, 0)
	);
	
	mat4.copy(viewDirectionProjectionInverseMatrix, viewMatrix);

	viewDirectionProjectionInverseMatrix[12] = 0;
	viewDirectionProjectionInverseMatrix[13] = 0;
	viewDirectionProjectionInverseMatrix[14] = 0;
	
	mat4.mul(viewDirectionProjectionInverseMatrix, projMatrix, viewDirectionProjectionInverseMatrix);
	mat4.invert(viewDirectionProjectionInverseMatrix, viewDirectionProjectionInverseMatrix);
}

function setupVertexShaderMatrixTerreno(munPos, antPos1, antPos2) {
	gl.useProgram(glProgramTerreno);
	getUniforms(glProgramTerreno);

	gl.uniform1i(debugMode, modoNormales);



	gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
	gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
	gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

	gl.uniform3f(ambientColorUniform, ambColor[0], ambColor[1], ambColor[2]);

	gl.uniform3fv(lightColorsUniform, colors);
	gl.uniform3fv(lightPosUniform, pos);
	gl.uniform3fv(lightConstUniform, coeff);

	gl.uniform1iv(lightIsDirUniform, isDirectional);

	gl.uniform3f(camPosUniform, mCamara.pos[0], mCamara.pos[1], mCamara.pos[2]);
}


function setupVertexShaderMatrix(munPos, antPos1, antPos2) {
	gl.useProgram(glProgram);
	getUniforms(glProgram);

	gl.uniform1i(debugMode, modoNormales);

	gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
	gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
	gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

	gl.uniform3f(ambientColorUniform, ambColor[0], ambColor[1], ambColor[2]);

	gl.uniform3fv(lightColorsUniform, colors);
	gl.uniform3fv(lightPosUniform, pos);
	gl.uniform3fv(lightConstUniform, coeff);

	gl.uniform1iv(lightIsDirUniform, isDirectional);

	gl.uniform3f(camPosUniform, mCamara.pos[0], mCamara.pos[1], mCamara.pos[2]);

}

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
		vec3.scale(velDis, velDis, 1.5);
		
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

	velDis[1] -= 0.00003 * 1.5;
}

function setup_modelos() {
	mCastillo = new Castillo(anchoEdificio, largoEdificio, pisosEdificio, ladosMuralla, altoMuralla);
	mCastillo.setPosicion(0, 0, 0);
	
	mTerreno = new Terreno();
	mTerreno.setPosicion(0, 0, 0);

	mCatapulta = new Catapulta();
	mCatapulta.setPosicion(-5, .05, -5);    
	
	mCielo = new Cubo();
	mCielo.generarCubo();
	mCielo.generarTextura(skyTexs);

	mCastillo.setEscala(.1, .1, .1);
	mTerreno.setEscala(.1, .1, .1);
	mCatapulta.setEscala(.1, .1, .1);    
}



function draw_scene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	
				
	mCastillo.setProgram(glProgram);
	mTerreno.setProgram(glProgramTerreno);
	mCatapulta.setProgram(glProgram);
	mCatapulta.setRotacion(0,1,0, (rotacionCatapulta + 310) / 180 * Math.PI);

	mCielo.setProgram(glProgramCielo);
	
	munPos = mCatapulta.get_municion_pos();
	if(disparo != null && actualDis != null){
		munPos =  actualDis;
	}
	
	var antPos = mCastillo.get_antorcha_pos();
	antPos1 = antPos.pos1;
	antPos2 = antPos.pos2;

	if(!lavaEmisiva) {
		mTerreno.apagarLava();
	}

	setupMatrices();
	setupLights();
	
	mCielo.m = viewDirectionProjectionInverseMatrix;
	
	let m = mat4.create();
	mat4.identity(m, m);

	setupVertexShaderMatrix();
	mCastillo.dibujar(m);
	mCatapulta.dibujar(m);

	setupVertexShaderMatrixTerreno();
	
	mCielo.dibujar();
	mTerreno.dibujar(m);

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