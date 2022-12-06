var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var gl = null;

var canvas = null,
glProgram = null,
glProgramTerreno = null,

fragmentShader = null,
vertexShader = null;

var vertexPositionAttribute = null;
var vertexNormalAttribute = null;
var vertexTextureAttribute = null;
var colorAttribute = null;

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();


function initWebGL() {
	canvas = document.getElementById("canvas");
	
	try {
		gl = canvas.getContext("webgl");
	} catch (e) {
		alert("Error: Your browser does not appear to support WebGL.");
	}
	
	if (gl) {
		setupWebGL();
		initShaders();
		initMenu();

		gl.useProgram(glProgram);
		setupVertexShaderMatrix()
		gl.useProgram(glProgramTerreno);
		;
		setupVertexShaderMatrixTerreno();

		setupCameras();
		setup_modelos();
		draw_scene();
		
		tick();
	} else {
		alert("Error: Your browser does not appear to support WebGL.");
	}
}

function setupWebGL() {
		gl.enable(gl.DEPTH_TEST);
		//set the clear color
		gl.clearColor(20/255, 25/255, 47/255, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.viewport(0, 0, canvas.width, canvas.height);
		
		aspect = canvas.width/canvas.height;
		
		// Matrix de Proyeccion Perspectiva
		mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
		
		mat4.identity(viewMatrix);
		mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -5.0]);
}

function initShaders() {
	//get shader source
	var fs_source = document.getElementById("shader-fs").innerHTML,
	vs_source = document.getElementById("shader-vs").innerHTML;
	
	var fst_source = document.getElementById("shader-fst").innerHTML,
	vst_source = document.getElementById("shader-vst").innerHTML;
	
	//compile shaders
	vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
	fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

	vertexShaderTerreno = makeShader(vst_source, gl.VERTEX_SHADER);
	fragmentShaderTerreno = makeShader(fst_source, gl.FRAGMENT_SHADER);

	//create program
	glProgram = gl.createProgram();
	glProgramTerreno = gl.createProgram();


	//attach and link shaders to the program
	gl.attachShader(glProgram, vertexShader);
	gl.attachShader(glProgram, fragmentShader);
	gl.linkProgram(glProgram);

	gl.attachShader(glProgramTerreno, vertexShaderTerreno);
	gl.attachShader(glProgramTerreno, fragmentShaderTerreno);
	gl.linkProgram(glProgramTerreno);

	if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}

	if (!gl.getProgramParameter(glProgramTerreno, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}

	//use program
	gl.useProgram(glProgram);
}

function makeShader(src, type) {
	//compile the vertex shader
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
	}

	return shader;
}

function setupVertexShaderMatrixTerreno(munPos, antPos1, antPos2) {
	var munCol = catColor; 
	var antCol1 = antColor1;
	var antCol2 = antColor2; 

	if (!munPos){
		munPos = [0, 0, 0];
		munCol = [0, 0, 0];
	}

	if(!antPos1){
		antPos1 = [0, 0, 0]
		antCol1 = [0, 0, 0]
	}

	if(!antPos2){
		antPos2 = [0, 0, 0]
		antCol2 = [0, 0, 0]
	}	

	var modelMatrixUniform = gl.getUniformLocation(glProgramTerreno, "modelMatrix");
	var viewMatrixUniform = gl.getUniformLocation(glProgramTerreno, "viewMatrix");
	var projMatrixUniform = gl.getUniformLocation(glProgramTerreno, "projMatrix");
	var normalMatrixUniform = gl.getUniformLocation(glProgramTerreno, "normalMatrix");

	gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
	gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
	gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

	var debugMode = gl.getUniformLocation(glProgramTerreno, "debugMode");
	gl.uniform1i(debugMode, modoNormales);

	var ambientColorUniform = gl.getUniformLocation(glProgramTerreno, "uAmbientColor");
	var lightColorsUniform = gl.getUniformLocation(glProgramTerreno, "uLightColor");
	var lightPosUniform = gl.getUniformLocation(glProgramTerreno, "uLightPos");
	var lightConstUniform = gl.getUniformLocation(glProgramTerreno, "uLightConst");

	var lightIsDirUniform = gl.getUniformLocation(glProgramTerreno, "uLightIsDirectional");

	gl.uniform3f(ambientColorUniform, ambColor[0], ambColor[1], ambColor[2]);

	var colors = []
	colors = colors.concat(diffColor, antCol1, antCol2, munCol);
	
	var pos = []
	pos = pos.concat([1.0, 1.0, -0.7], antPos1[0], antPos1[1], antPos1[2], antPos2[0], antPos2[1], antPos2[2], munPos[0], munPos[1], munPos[2]);
	
	var coeff = []
	coeff = coeff.concat([0.0, 0.0, 0.0], [.7, 0.4, 0.3], [.5, 0.4, 0.3],  [.8, 0.4, 0.1])

	var isDirectional = [1, 0, 0, 0];

	gl.uniform3fv(lightColorsUniform, colors);
	gl.uniform3fv(lightPosUniform, pos);
	gl.uniform3fv(lightConstUniform, coeff);

	gl.uniform1iv(lightIsDirUniform, isDirectional);
}


function setupVertexShaderMatrix(munPos, antPos1, antPos2) {
	var munCol = catColor; 
	var antCol1 = antColor1;
	var antCol2 = antColor2; 

	if (!munPos){
		munPos = [0, 0, 0];
		munCol = [0, 0, 0];
	}

	if(!antPos1){
		antPos1 = [0, 0, 0]
		antCol1 = [0, 0, 0]
	}

	if(!antPos2){
		antPos2 = [0, 0, 0]
		antCol2 = [0, 0, 0]
	}	

	var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
	var viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");
	var projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");
	var normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");

	gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
	gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
	gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

	var debugMode = gl.getUniformLocation(glProgram, "debugMode");
	gl.uniform1i(debugMode, modoNormales);

	var ambientColorUniform = gl.getUniformLocation(glProgram, "uAmbientColor");
	var lightColorsUniform = gl.getUniformLocation(glProgram, "uLightColor");
	var lightPosUniform = gl.getUniformLocation(glProgram, "uLightPos");
	var lightConstUniform = gl.getUniformLocation(glProgram, "uLightConst");

	var lightIsDirUniform = gl.getUniformLocation(glProgram, "uLightIsDirectional");

	gl.uniform3f(ambientColorUniform, ambColor[0], ambColor[1], ambColor[2]);

	var colors = []
	colors = colors.concat(diffColor, antCol1, antCol2, munCol);
	
	var pos = []
	pos = pos.concat([-1, .9, 1], antPos1[0], antPos1[1], antPos1[2], antPos2[0], antPos2[1], antPos2[2], munPos[0], munPos[1], munPos[2]);
	
	var coeff = []
	coeff = coeff.concat([0.0, 0.0, 0.0], [.7, 0.4, 0.3], [.5, 0.4, 0.3],  [.8, 0.4, 0.1])

	var isDirectional = [1, 0, 0, 0];

	gl.uniform3fv(lightColorsUniform, colors);
	gl.uniform3fv(lightPosUniform, pos);
	gl.uniform3fv(lightConstUniform, coeff);

	gl.uniform1iv(lightIsDirUniform, isDirectional);

}


function setupCameras() {
	mOrbCastillo = new Camara(0, 0, 0, 10);

	mOrbCat = new Camara(-5, 0, -5, 2);
	mFP = new CamaraFP(-8, .6, -8, 1);

	mCamara = mOrbCastillo;
}