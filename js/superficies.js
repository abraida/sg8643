
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

	webgl_position_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);    


	webgl_normal_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
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


	webgl_index_buffer = gl.createBuffer();

	webgl_index_buffer.number_vertex_point = index.length;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);    
 
    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_index_buffer
    }	
}

function generar_plano(ancho, alto) {
	let indexBuffer = [0, 2, 1, 1, 2, 3];
  	let positionBuffer = [
		0, alto, 0,
		ancho, alto, 0,
		0, 0, 0,
		ancho, 0, 0,
	];
  	let normalBuffer = [
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
	];

    var webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);

    var webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);

    var webgl_index_buffer = gl.createBuffer();
    webgl_index_buffer.number_vertex_point = indexBuffer.length;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);


    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_index_buffer
    }

}

function generar_superficie_barrido(curva, figura, dibujarTapa = false) {
  let indexBuffer = [];
  let positionBuffer = [];
  let normalBuffer = [];

  var segLongitud = curva.puntos.length;
  var segRadiales = figura.puntos.length;

  let M = null;
  for (let i = 0; i < segLongitud; i++) {
    let punto = curva.puntos[i];
    let tangente = curva.tangentes[i];
    let normal = curva.normales[i];

    let aux = vec3.create();

    let T = vec3.fromValues(tangente[0], tangente[1], tangente[2]);
    vec3.normalize(T, T);
    let N = vec3.fromValues(normal[0], normal[1], normal[2]);
    vec3.normalize(N, N);

    let B = vec3.create();

    vec3.normalize(B, vec3.cross(aux, T, N));

    M = mat4.fromValues(
      N[0], N[1], N[2], 0,
      B[0], B[1], B[2], 0,
      T[0], T[1], T[2], 0,
      punto[0], punto[1], punto[2], 1
    );

    for (let j = 0; j < figura.puntos.length; j++) {
      let vertice = figura.puntos[j];
		
      let vprima = vec4.fromValues(vertice[0], vertice[1], vertice[2], 1);
      mat4.multiply(vprima, M, vprima);

      positionBuffer.push(vprima[0]);
      positionBuffer.push(vprima[1]);
      positionBuffer.push(vprima[2]);

      let n = vec4.fromValues(figura.normales[j][0], figura.normales[j][1], figura.normales[j][2], 1);

      mat4.multiply(n, M, n);
      vec3.sub(n, n, vec3.fromValues(punto[0], punto[1], punto[2]));

      vec4.normalize(n, n);

      normalBuffer.push(n[0]);
      normalBuffer.push(n[1]);
	  normalBuffer.push(n[2]);
	}
  }

			
	for (let i = 0; i < segLongitud - 1; i++) {
        for (let j = 0; j < segRadiales - 1; j++) {
          	indexBuffer.push(i * segRadiales + j);
          	indexBuffer.push((i + 1) * segRadiales + j);
          	indexBuffer.push(i * segRadiales + j + 1);

			indexBuffer.push(i * segRadiales + j + 1);
			indexBuffer.push((i + 1) * segRadiales + j);
			indexBuffer.push((i + 1) * segRadiales + j + 1);
        }
    }
	
	if(dibujarTapa){
		var m1=curva.puntos[segLongitud-1];

		for (var j=0;j<segRadiales;j++){
			var x1=figura.puntos[j][0];
			var y1=figura.puntos[j][1];	

			var x2=figura.puntos[j][0]*.0;
			var y2=figura.puntos[j][1]*.0;		
			
			let ext = vec4.fromValues(x1, y1, 0, 1);
			mat4.multiply(ext, M, ext);

			let int = vec4.fromValues(x2, y2, 0, 1)
			mat4.multiply(int, M, int);

			var nExt = vec4.fromValues(0, 0, 1, 1);
			mat4.multiply(nExt, M, nExt);
			vec3.sub(nExt, nExt, vec3.fromValues(m1[0], m1[1], m1[2]));

			var nInt = vec4.fromValues(0, 0, 1, 1);
			mat4.multiply(nInt, M, nInt);
			vec3.sub(nInt, nInt, vec3.fromValues(m1[0], m1[1], m1[2]));
		
				
			positionBuffer.push(ext[0]);
			positionBuffer.push(ext[1]);
			positionBuffer.push(ext[2]);

			positionBuffer.push(int[0]);
			positionBuffer.push(int[1]);
			positionBuffer.push(int[2]);
			
			normalBuffer.push(nExt[0]);
			normalBuffer.push(nExt[1]);
			normalBuffer.push(nExt[2]);
			
			normalBuffer.push(nInt[0]);
			normalBuffer.push(nInt[1]);
			normalBuffer.push(nInt[2]);					
		}
		let n=segLongitud*(segRadiales+1);

		for (let j = 0; j < segRadiales - 1; j++) {
          	indexBuffer.push((segLongitud-1)* segRadiales + j);
          	indexBuffer.push((segLongitud-1+ 1) * segRadiales + j);
          	indexBuffer.push((segLongitud-1)* segRadiales + j + 1);

			indexBuffer.push((segLongitud-1)* segRadiales + j + 1);
			indexBuffer.push((segLongitud-1+ 1) * segRadiales + j);
			indexBuffer.push((segLongitud-1+ 1) * segRadiales + j + 1);
		}
	}


  // Creación e Inicialización de los buffers

    var webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);

    var webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);

    var webgl_index_buffer = gl.createBuffer();
    webgl_index_buffer.number_vertex_point = indexBuffer.length;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);


    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_index_buffer
    }
}

function generar_superficie_barrido_variable(curva, figuras, dibujarTapa = false) {
  let indexBuffer = [];
  let positionBuffer = [];
  let normalBuffer = [];

  var segLongitud = curva.puntos.length;
  var segRadiales = figuras[0].puntos.length;

  let M = null;
  for (let i = 0; i < segLongitud; i++) {
    let punto = curva.puntos[i];
    let tangente = curva.tangentes[i];
    let normal = curva.normales[i];

    let aux = vec3.create();

    let T = vec3.fromValues(tangente[0], tangente[1], tangente[2]);
    vec3.normalize(T, T);
    let N = vec3.fromValues(normal[0], normal[1], normal[2]);
    vec3.normalize(N, N);

    let B = vec3.create();

    vec3.normalize(B, vec3.cross(aux, T, N));

    M = mat4.fromValues(
      N[0], N[1], N[2], 0,
      B[0], B[1], B[2], 0,
      T[0], T[1], T[2], 0,
      punto[0], punto[1], punto[2], 1
    );

    for (let j = 0; j < segRadiales; j++) {
      let vertice = figuras[i].puntos[j];
		
      let vprima = vec4.fromValues(vertice[0], vertice[1], vertice[2], 1);
      mat4.multiply(vprima, M, vprima);

      positionBuffer.push(vprima[0]);
      positionBuffer.push(vprima[1]);
      positionBuffer.push(vprima[2]);

      let n = vec4.fromValues(figuras[i].normales[j][0], figuras[i].normales[j][1], figuras[i].normales[j][2], 1);

      mat4.multiply(n, M, n);
      vec3.sub(n, n, vec3.fromValues(punto[0], punto[1], punto[2]));

      vec4.normalize(n, n);

      normalBuffer.push(n[0]);
      normalBuffer.push(n[1]);
	  normalBuffer.push(n[2]);
	}
  }

			
	for (let i = 0; i < segLongitud - 1; i++) {
        for (let j = 0; j < segRadiales - 1; j++) {
          	indexBuffer.push(i * segRadiales + j);
          	indexBuffer.push((i + 1) * segRadiales + j);
          	indexBuffer.push(i * segRadiales + j + 1);

			indexBuffer.push(i * segRadiales + j + 1);
			indexBuffer.push((i + 1) * segRadiales + j);
			indexBuffer.push((i + 1) * segRadiales + j + 1);
        }
    }
	
	if(dibujarTapa){
		var m1=curva.puntos[segLongitud-1];

		for (var j=0;j<segRadiales;j++){
			var x1=figuras[segLongitud-1].puntos[j][0];
			var y1=figuras[segLongitud-1].puntos[j][1];	

			var x2=0.0;
			var y2=0.0;		
			
			let ext = vec4.fromValues(x1, y1, 0, 1);
			mat4.multiply(ext, M, ext);

			let int = vec4.fromValues(x2, y2, 0, 1)
			mat4.multiply(int, M, int);

			var nExt = vec4.fromValues(0, 0, 1, 1);
			mat4.multiply(nExt, M, nExt);
			vec3.sub(nExt, nExt, vec3.fromValues(m1[0], m1[1], m1[2]));

			var nInt = vec4.fromValues(0, 0, 1, 1);
			mat4.multiply(nInt, M, nInt);
			vec3.sub(nInt, nInt, vec3.fromValues(m1[0], m1[1], m1[2]));
		
				
			positionBuffer.push(ext[0]);
			positionBuffer.push(ext[1]);
			positionBuffer.push(ext[2]);

			positionBuffer.push(int[0]);
			positionBuffer.push(int[1]);
			positionBuffer.push(int[2]);
			
			normalBuffer.push(nExt[0]);
			normalBuffer.push(nExt[1]);
			normalBuffer.push(nExt[2]);
			
			normalBuffer.push(nInt[0]);
			normalBuffer.push(nInt[1]);
			normalBuffer.push(nInt[2]);					
		}
		let n=segLongitud*(segRadiales+1);

		for (let j = 0; j < segRadiales - 1; j++) {
          	indexBuffer.push((segLongitud-1)* segRadiales + j);
          	indexBuffer.push((segLongitud-1+ 1) * segRadiales + j);
          	indexBuffer.push((segLongitud-1)* segRadiales + j + 1);

			indexBuffer.push((segLongitud-1)* segRadiales + j + 1);
			indexBuffer.push((segLongitud-1+ 1) * segRadiales + j);
			indexBuffer.push((segLongitud-1+ 1) * segRadiales + j + 1);
		}
	}


  // Creación e Inicialización de los buffers

    var webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);

    var webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);

    var webgl_index_buffer = gl.createBuffer();
    webgl_index_buffer.number_vertex_point = indexBuffer.length;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);


    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_index_buffer
    }
}