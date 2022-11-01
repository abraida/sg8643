
let vec4 = glMatrix.vec4;

function generar_esfera() {
	var pos=[];
	var normal=[];
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
        }
    }

	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);    


	normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

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
 
    return {
        vertexBuffer,
        normalBuffer,
        indexBuffer
    }	
}

function generar_plano(ancho, alto) {
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


    return {
        vertexBuffer,
        normalBuffer,
        indexBuffer
    }

}

function generar_superficie_barrido(curva, figura, dibujarTapa = false) {
	let indices = [];
	let pos = [];
	let nrm = [];

	var segLongitud = curva.matricesPuntos.length;
	var segRadiales = figura.puntos.length;

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
		}
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
	
	if(dibujarTapa){
		for (var j=0;j<segRadiales;j++){
			var x1=figura.puntos[j][0];
			var y1=figura.puntos[j][1];	

			var x2=0;
			var y2=0;		
			
			let ext = vec4.fromValues(x1, y1, 0, 1);
			mat4.multiply(ext, curva.matricesPuntos[segLongitud-1], ext);

			let int = vec4.fromValues(x2, y2, 0, 1)
			mat4.multiply(int, curva.matricesPuntos[segLongitud-1], int);

			var nExt = vec4.fromValues(0, 0, 1, 1);
			mat4.multiply(nExt, curva.matricesNormales[segLongitud-1], nExt);

			var nInt = vec4.fromValues(0, 0, 1, 1);
			mat4.multiply(nInt, curva.matricesNormales[segLongitud-1], nInt);		
				
			pos.push(ext[0]);
			pos.push(ext[1]);
			pos.push(ext[2]);

			pos.push(int[0]);
			pos.push(int[1]);
			pos.push(int[2]);
			
			nrm.push(nExt[0]);
			nrm.push(nExt[1]);
			nrm.push(nExt[2]);
			
			nrm.push(nInt[0]);
			nrm.push(nInt[1]);
			nrm.push(nInt[2]);					
		}

		for (let j = 0; j < segRadiales - 1; j++) {
          	indices.push((segLongitud-1)* segRadiales + j);
          	indices.push((segLongitud-1+ 1) * segRadiales + j);
          	indices.push((segLongitud-1)* segRadiales + j + 1);

			indices.push((segLongitud-1)* segRadiales + j + 1);
			indices.push((segLongitud-1+ 1) * segRadiales + j);
			indices.push((segLongitud-1+ 1) * segRadiales + j + 1);
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

    return {
        vertexBuffer,
        normalBuffer,
        indexBuffer
    }
}

function generar_superficie_barrido_variable(curva, figuras, dibujarTapa = false) {
  	let indices = [];
 	let pos = [];
  	let nrm = [];

	var segLongitud = curva.matricesPuntos.length;
  	var segRadiales = figuras[0].puntos.length;

	for (let i = 0; i < segLongitud; i++) {
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
		}
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
	
	if(dibujarTapa){
		for (var j=0;j<segRadiales;j++){
			var x1=figuras[segLongitud - 1].puntos[j][0];
			var y1=figuras[segLongitud - 1].puntos[j][1];	

			var x2=0;
			var y2=0;		
			
			let ext = vec4.fromValues(x1, y1, 0, 1);
			mat4.multiply(ext, curva.matricesPuntos[segLongitud-1], ext);

			let int = vec4.fromValues(x2, y2, 0, 1)
			mat4.multiply(int, curva.matricesPuntos[segLongitud-1], int);

			var nExt = vec4.fromValues(0, 0, 1, 1);
			mat4.multiply(nExt, curva.matricesNormales[segLongitud-1], nExt);

			var nInt = vec4.fromValues(0, 0, 1, 1);
			mat4.multiply(nInt, curva.matricesNormales[segLongitud-1], nInt);		
				
			pos.push(ext[0]);
			pos.push(ext[1]);
			pos.push(ext[2]);

			pos.push(int[0]);
			pos.push(int[1]);
			pos.push(int[2]);
			
			nrm.push(nExt[0]);
			nrm.push(nExt[1]);
			nrm.push(nExt[2]);
			
			nrm.push(nInt[0]);
			nrm.push(nInt[1]);
			nrm.push(nInt[2]);					
		}

		for (let j = 0; j < segRadiales - 1; j++) {
          	indices.push((segLongitud-1)* segRadiales + j);
          	indices.push((segLongitud-1+ 1) * segRadiales + j);
          	indices.push((segLongitud-1)* segRadiales + j + 1);

			indices.push((segLongitud-1)* segRadiales + j + 1);
			indices.push((segLongitud-1+ 1) * segRadiales + j);
			indices.push((segLongitud-1+ 1) * segRadiales + j + 1);
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

    return {
        vertexBuffer,
        normalBuffer,
        indexBuffer
    }
}