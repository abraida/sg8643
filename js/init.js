var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var gl = null;

var canvas = null,
glProgram = null,
glProgramTerreno = null,
glProgramCielo = null,

fragmentShader = null,
vertexShader = null;

vertexShaderTerreno = null;
fragmentShaderTerreno = null;

vertexShaderCielo = null;
fragmentShaderCielo = null;

var vertexPositionAttribute = null;
var vertexNormalAttribute = null;
var vertexTextureAttribute = null;
var colorAttribute = null;


var mOrbCastillo = null;  
var mOrbCat = null; 
var mFP = null; 
var mCamara = null;

var aspect=null;


function initWebGL() {
	canvas = document.getElementById("canvas");
	
	try {
		gl = canvas.getContext("webgl");
	} catch (e) {
		alert("Error: Your browser does not appear to support WebGL.");
	}
	
	if (gl) {
		setupWebGL();

		glProgram = gl.createProgram();
		glProgramTerreno = gl.createProgram();
		glProgramCielo = gl.createProgram();

		initShader("shader-vs", "shader-fs", glProgram);
		initShader("shader-vst", "shader-fst", glProgramTerreno);
		initShader("shader-vss", "shader-fss", glProgramCielo);

		initMenu();
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


function initShader(src_vs, src_fs, program) {
	var fs_source = document.getElementById(src_fs).innerHTML,
	vs_source = document.getElementById(src_vs).innerHTML;

	var vs = makeShader(vs_source, gl.VERTEX_SHADER);
	var fs = makeShader(fs_source, gl.FRAGMENT_SHADER);



	//attach and link shaders to the program
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}
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

function setupCameras() {
	mOrbCastillo = new Camara(0, 0, 0, 10);

	mOrbCat = new Camara(-5, 0, -5, 2);
	mFP = new CamaraFP(-8, .6, -8, 1);

	mCamara = mOrbCastillo;
}