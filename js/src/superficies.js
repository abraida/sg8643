
let vec4 = glMatrix.vec4;

function generar_esfera() {
	var pos=[];
	var normal=[];
	var uv=[];
	var tan=[];
	var bin=[];

	var r=1;
	var longitudeBands=128;
	var latitudeBands=256;

    for (let latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta =latNumber * Math.PI / (latitudeBands);
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);


        for (let longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta*r;
            var y = cosTheta*r;
            var z = sinPhi * sinTheta*r;

            var u =  (longNumber / longitudeBands);
            var v = 1-(latNumber / latitudeBands);

            normal.push(x);
            normal.push(y);
            normal.push(z);
            
            pos.push(x);
            pos.push(y);
            pos.push(z);

	    uv.push(u);
	    uv.push(v);

	    tan.push(0);
	    tan.push(0);
	    tan.push(0);

	    bin.push(0);
	    bin.push(0);
	    bin.push(0);

        }
    }

	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);    


	normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

	var tanBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tanBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tan), gl.STATIC_DRAW);
		
	var binBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, binBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bin), gl.STATIC_DRAW);

	var index=[];

    for (latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (longNumber=0; longNumber < longitudeBands; longNumber++) {

            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;

            index.push(first);
            index.push(second);
            index.push(first + 1);

            index.push(second);
            index.push(second + 1);
            index.push(first + 1);
        }
    }


	indexBuffer = gl.createBuffer();

	indexBuffer.number_vertex_point = index.length;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);    

	var uvBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

    return {
        vertexBuffer,
        normalBuffer,
	tanBuffer, 
	binBuffer,
        indexBuffer,
	uvBuffer
    }	
}

function generar_plano(ancho, alto, repeatU, repeatV) {
	if (!repeatU) repeatU=1;
	if (!repeatV) repeatV=1;
		
	let indices = [0, 2, 1, 1, 2, 3];
  	let pos = [
		0, alto, 0,
		ancho, alto, 0,
		0, 0, 0,
		ancho, 0, 0,
	];
  	let nml = [
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
	];

	let uv = [
		0, repeatV,
		repeatU, repeatV,
		0, 0,
		repeatU, 0
	];

	let tan = [
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,
	];

	let bin = [
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
	];

	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

	var normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nml), gl.STATIC_DRAW);

	var indexBuffer = gl.createBuffer();
	indexBuffer.number_vertex_point = indices.length;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	var tanBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tanBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tan), gl.STATIC_DRAW);
		
	var binBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, binBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bin), gl.STATIC_DRAW);

	var uvBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);


    return {
        vertexBuffer,
        normalBuffer,
        indexBuffer,
	tanBuffer,
	binBuffer,
	uvBuffer
    }

}

function generar_superficie_barrido(curva, figura, dibujarTapa = false, 
				repeatU, repeatV) {
	if (!repeatU) repeatU=1;
	if (!repeatV) repeatV=1;
		
	let indices = [];
	let pos = [];
	let nrm = [];
	let tan = [];
	let bin = [];
	let uv = [];

	var segLongitud = curva.matricesPuntos.length;
	var segRadiales = figura.puntos.length;

	var totalLength = getShapeLenght(figura);
	var acumLength = 0;				

	for (let i = 0; i < segLongitud; i++) {
		for (let j = 0; j < segRadiales; j++) {				
			let v = vec3.fromValues(figura.puntos[j][0], figura.puntos[j][1], 0);
			vec3.transformMat4(v, v, curva.matricesPuntos[i]);

			pos.push(v[0]);
			pos.push(v[1]);
			pos.push(v[2]);

			let n = vec3.fromValues(figura.normales[j][0], figura.normales[j][1], 0);

			vec3.transformMat4(n, n, curva.matricesNormales[i]);
			vec3.normalize(n, n);

			nrm.push(n[0]);
			nrm.push(n[1]);
			nrm.push(n[2]);
			
			if(j>0)
				acumLength += vec3.dist(figura.puntos[j], figura.puntos[j-1])

			let cU = repeatU*(acumLength/(totalLength))
			let cV = repeatV*(i/curva.matricesPuntos.length)

			uv.push(cU);
			uv.push(cV);
			
			let t = curva.tangentes[i];

			tan.push(t[0]);
			tan.push(t[1]);
			tan.push(t[2]);

			let b = vec3.create();
			vec3.cross(b, vec3.fromValues(t[0], t[1], t[2]), n);

			bin.push(b[0]);
			bin.push(b[1]);
			bin.push(b[2]);

		}
		acumLength = 0;
	}
			
	for (let i = 0; i < segLongitud - 1; i++) {
		for (let j = 0; j < segRadiales - 1; j++) {
			indices.push(i * segRadiales + j);
			indices.push(i * segRadiales + j + 1);
			indices.push((i + 1) * segRadiales + j);

			indices.push(i * segRadiales + j + 1);
			indices.push((i + 1) * segRadiales + j + 1);
			indices.push((i + 1) * segRadiales + j);
		}
    	}
	
	if(dibujarTapa){
		var bordes = getBoundaries(figura);

		for (var j=0;j<segRadiales;j++){
			let p = vec3.fromValues(figura.puntos[j][0], figura.puntos[j][1], 0);
			vec3.transformMat4(p, p, curva.matricesPuntos[segLongitud-1]);

			var n = vec3.fromValues(0, 0, -1);
			vec3.transformMat4(n, n, curva.matricesNormales[segLongitud-1]);		
			vec3.normalize(n, n);

			var cU = (figura.puntos[j][0] - bordes.xmin)/(bordes.xmax - bordes.xmin);
			var cV = (figura.puntos[j][1] - bordes.ymin)/(bordes.ymax - bordes.ymin);

			pos.push(p[0]);
			pos.push(p[1]);
			pos.push(p[2]);

			nrm.push(n[0]);
			nrm.push(n[1]);
			nrm.push(n[2]);					

			uv.push(cU);
			uv.push(cV);

			let t = curva.tangentes[segLongitud-1];

			tan.push(t[0]);
			tan.push(t[1]);
			tan.push(t[2]);

			let b = vec3.create();

			vec3.cross(b, vec3.fromValues(t[0], t[1], t[2]), n);

			bin.push(b[0]);
			bin.push(b[1]);
			bin.push(b[2]);
		}	

		let p = vec3.fromValues(0, 0, 0);
		
		var cU = (p[0] - bordes.xmin)/(bordes.xmax - bordes.xmin);
		var cV = (p[1] - bordes.ymin)/(bordes.ymax - bordes.ymin);

		vec3.transformMat4(p, p, curva.matricesPuntos[segLongitud-1]);

		var n = vec3.fromValues(0, 0, -1);
		vec3.transformMat4(n, n, curva.matricesNormales[segLongitud-1]);		
		vec3.normalize(n, n);

		let t = curva.tangentes[segLongitud-1];
		let b = vec3.create();

		vec3.cross(b, vec3.fromValues(t[0], t[1], t[2]), n);

		for (var j=0;j<segRadiales;j++){
			pos.push(p[0]);
			pos.push(p[1]);
			pos.push(p[2]);

			nrm.push(n[0]);
			nrm.push(n[1]);
			nrm.push(n[2]);					

			uv.push(cU);
			uv.push(cV);

			tan.push(t[0]);
			tan.push(t[1]);
			tan.push(t[2]);

			bin.push(b[0]);
			bin.push(b[1]);
			bin.push(b[2]);			
		}

		for (let j = 0; j < segRadiales - 1; j++) {
			indices.push((segLongitud-1)* segRadiales + j);
			indices.push((segLongitud-1+ 1) * segRadiales + j);
			indices.push((segLongitud-1)* segRadiales + j + 1);

			indices.push((segLongitud-1)* segRadiales + j + 1);
			indices.push((segLongitud-1+ 1) * segRadiales + j);
			indices.push((segLongitud-1+ 1) * segRadiales + j + 1);
		}

		for (let j = 0; j < segRadiales - 1; j++) {
			indices.push((segLongitud)* segRadiales + j);
			indices.push((segLongitud + 1) * segRadiales + j);
			indices.push((segLongitud)* segRadiales + j + 1);

			indices.push((segLongitud)* segRadiales + j + 1);
			indices.push((segLongitud + 1) * segRadiales + j);
			indices.push((segLongitud + 1) * segRadiales + j + 1);
		}
	}


  // Creación e Inicialización de los buffers

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nrm), gl.STATIC_DRAW);

    var tanBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tanBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tan), gl.STATIC_DRAW);
	
    var binBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, binBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bin), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    indexBuffer.number_vertex_point = indices.length;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

    return {
        vertexBuffer,
        normalBuffer,
        indexBuffer,
	tanBuffer,
	binBuffer,
	uvBuffer
    }
}

function generar_superficie_barrido_variable(curva, figuras, 
					dibujarTapa = false, repeatU, repeatV) {
  	let indices = [];
 	let pos = [];
  	let nrm = [];
	let tan = [];
	let bin = [];

	let uv = [];

	var segLongitud = curva.matricesPuntos.length;
  	var segRadiales = figuras[0].puntos.length;

	if (!repeatU) repeatU=1;
	if (!repeatV) repeatV=1;


	
	for (let i = 0; i < segLongitud; i++) {
		var totalLength = getShapeLenght(figuras[i]);
		var acumLength = 0;	
		
		for (let j = 0; j < segRadiales; j++) {
			let v = vec3.fromValues(figuras[i].puntos[j][0], figuras[i].puntos[j][1], 0);
			vec3.transformMat4(v, v, curva.matricesPuntos[i]);

			pos.push(v[0]);
			pos.push(v[1]);
			pos.push(v[2]);

			let n = vec3.fromValues(figuras[i].normales[j][0], figuras[i].normales[j][1], 0);

			vec3.transformMat4(n, n, curva.matricesNormales[i]);
			vec3.normalize(n, n);

			nrm.push(n[0]);
			nrm.push(n[1]);
			nrm.push(n[2]);
			

			let cU = repeatU*(acumLength/(totalLength))
			let cV = repeatV*(i/curva.matricesPuntos.length)
			
			if(j>0)
				acumLength += vec3.dist(figuras[i].puntos[j], figuras[i].puntos[j-1])

			uv.push(cU);
			uv.push(cV);
			
			let t = curva.tangentes[i];

			tan.push(t[0]);
			tan.push(t[1]);
			tan.push(t[2]);

			let b = vec3.create();
			vec3.cross(b, vec3.fromValues(t[0], t[1], t[2]), n);

			bin.push(b[0]);
			bin.push(b[1]);
			bin.push(b[2]);
		}

		acumLength = 0;	

	}
			
	for (let i = 0; i < segLongitud - 1; i++) {
        	for (let j = 0; j < segRadiales - 1; j++) {
          		indices.push(i * segRadiales + j);
          		indices.push((i + 1) * segRadiales + j);
          		indices.push(i * segRadiales + j + 1);

			indices.push(i * segRadiales + j + 1);
			indices.push((i + 1) * segRadiales + j);
			indices.push((i + 1) * segRadiales + j + 1);
        	}
   	 }


  // Creación e Inicialización de los buffers

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nrm), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    indexBuffer.number_vertex_point = indices.length;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

var tanBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tanBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tan), gl.STATIC_DRAW);
	
    var binBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, binBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bin), gl.STATIC_DRAW);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    

    return {
        vertexBuffer,
        normalBuffer,
        indexBuffer,
	tanBuffer,
	binBuffer,
	uvBuffer
    }
}


function getShapeLenght(shape){
	let l = 0;
	for (let i = 1; i < shape.puntos.length; i++) {
		l += vec3.dist(shape.puntos[i], shape.puntos[i-1]);
	}

	return l;
}

function getBoundaries(shape){
	let xmin = 0, xmax = 0, ymin = 0, ymax = 0;
	
	for (let i = 0; i < shape.puntos.length; i++) {
		xmin = Math.min(shape.puntos[i][0], xmin);
		xmax = Math.max(shape.puntos[i][0], xmax); 

		ymin = Math.min(shape.puntos[i][1], ymin);
		ymax = Math.max(shape.puntos[i][1], ymax);
	}

	return {xmin, xmax, ymin, ymax}
}

function getCenter(shape){
	let x = 0, y = 0;

	for (let i = 0; i < shape.puntos.length; i++) {
		x += shape.puntos[i][0];
		y += shape.puntos[i][1];
	}

	return [x/shape.puntos.length, y/shape.puntos.length, 0];
}