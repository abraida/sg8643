
let vec4 = glMatrix.vec4;

function generarPlano(ancho, alto) {
	let indexBuffer = [0, 2, 1, 1, 2, 3];
  	let positionBuffer = [
		0, alto, 0,
		ancho, alto, 0,
		0, 0, 0,
		ancho, 0, 0,
	];
  	let normalBuffer = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
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

function generarSuperficieParametrica(curva, figura) {
  let indexBuffer = [];
  let positionBuffer = [];
  let normalBuffer = [];

  var segLongitud = curva.puntos.length;
  var segRadiales = figura.puntos.length;

  for (let i = 0; i < curva.puntos.length; i++) {
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

    let M = mat4.fromValues(
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

      let n = vec3.fromValues(figura.normales[j][0], figura.normales[j][1], figura.normales[j][2]);
      vec3.normalize(n, n);

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