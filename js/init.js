var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var gl = null;

var canvas = null,
glProgram = null,
fragmentShader = null,
vertexShader = null;

var vertexPositionAttribute = null;
var vertexNormalAttribute = null;

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
		setupVertexShaderMatrix();
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
		gl.clearColor(0.1, 0.1, 0.1, 1.0);
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

	//compile shaders
	vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
	fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

	//create program
	glProgram = gl.createProgram();

	//attach and link shaders to the program
	gl.attachShader(glProgram, vertexShader);
	gl.attachShader(glProgram, fragmentShader);
	gl.linkProgram(glProgram);

	if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
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

function setupVertexShaderMatrix() {
	var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
	var viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");
	var projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");
	var normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");

	gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
	gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
	gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}

function setupCameras() {
	mOrbCastillo = new Camara(0, 0, 0, 10);

	mOrbCat = new Camara(-5, 0, -5, 2);
	mFP = new CamaraFP(-8, .6, -8, 1);

	mCamara = mOrbCastillo;
}