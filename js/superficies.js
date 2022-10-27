function crearGeometria() {
  shape = [
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(-2, 0, 0),
    vec3.fromValues(-2, 4, 0),
    vec3.fromValues(0, 4, 0),
    vec3.fromValues(0, 0, 0),
  ];

  var puntosDeControlCubica = [
    [0, 0, 0],
    [1, 1, 0],
    [2, 2, 0],
    [3, 3, 0],
  ];

  curva = dibujarCurvaCubica(puntosDeControlCubica);

  mallaDeTriangulos = generarSuperficieParametrica(curva, shape);
}

function dibujarGeometria() {
  dibujarMalla(mallaDeTriangulos);
}

function generarSuperficieParametrica(curva, figura) {
  indexBuffer = [];
  positionBuffer = [];
  normalBuffer = [];
  uvBuffer = [];

  var segLongitud = curva.puntos.length;
  var segRadiales = figura.length;

  let cuenta_indices = 0;

  for (let i = 0; i < curva.puntos.length; i++) {
    let punto = curva.puntos[i];
    let derivada = curva.derivadas[i];

    let aux = vec3.create();

    let T = vec3.fromValues(derivada[0], derivada[1], derivada[2]);
    vec3.normalize(T, T);

    let B = vec3.create();
    let N = vec3.create();

    vec3.normalize(N, vec3.cross(aux, T, vec3.fromValues(0, 1, 0)));
    vec3.normalize(B, vec3.cross(aux, T, N));

    let M = mat4.fromValues(
      N[0], N[1], N[2], 0,
      B[0], B[1], B[2], 0,
      T[0], T[1], T[2], 0,
      punto[0], punto[1], punto[2], 1
    );

    for (let j = 0; j < figura.length; j++) {
      let vertice = figura[j];
      let vprima = vec4.fromValues(vertice[0], vertice[1], vertice[2], 1);
      mat4.multiply(vprima, M, vprima);

      positionBuffer.push(vprima[0]);
      positionBuffer.push(vprima[1]);
      positionBuffer.push(vprima[2]);

      normalBuffer.push(0);
      normalBuffer.push(1);
      normalBuffer.push(0);

      uvBuffer.push(0);
      uvBuffer.push(1);

      if (i < segLongitud - 1 && j < figura.length - 1) {
        var vA = i * segRadiales + j;
        var vB = i * segRadiales + j + 1;

        var vC = (i + 1) * segRadiales + j;
        var vD = (i + 1) * segRadiales + j + 1;

        indexBuffer.push(vA);
        indexBuffer.push(vC);
        indexBuffer.push(vB);

        indexBuffer.push(vB);
        indexBuffer.push(vC);
        indexBuffer.push(vD);
      }
    }
  }

  // Creación e Inicialización de los buffers

  webgl_position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionBuffer),
    gl.STATIC_DRAW
  );
  webgl_position_buffer.itemSize = 3;
  webgl_position_buffer.numItems = positionBuffer.length / 3;

  webgl_normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(normalBuffer),
    gl.STATIC_DRAW
  );
  webgl_normal_buffer.itemSize = 3;
  webgl_normal_buffer.numItems = normalBuffer.length / 3;

  webgl_uvs_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
  webgl_uvs_buffer.itemSize = 2;
  webgl_uvs_buffer.numItems = uvBuffer.length / 2;

  webgl_index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexBuffer),
    gl.STATIC_DRAW
  );
  webgl_index_buffer.itemSize = 1;
  webgl_index_buffer.numItems = indexBuffer.length;

  return {
    webgl_position_buffer,
    webgl_normal_buffer,
    webgl_uvs_buffer,
    webgl_index_buffer,
  };
}

function dibujarMalla(mallaDeTriangulos) {
  // Se configuran los buffers que alimentaron el pipeline
  gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    mallaDeTriangulos.webgl_position_buffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
  gl.vertexAttribPointer(
    shaderProgram.textureCoordAttribute,
    mallaDeTriangulos.webgl_uvs_buffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute,
    mallaDeTriangulos.webgl_normal_buffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);

  if (modo != "wireframe") {
    gl.uniform1i(shaderProgram.useLightingUniform, lighting == "true");
    gl.drawElements(
      gl.TRIANGLES,
      mallaDeTriangulos.webgl_index_buffer.numItems,
      gl.UNSIGNED_SHORT,
      0
    );
  }

  if (modo != "smooth") {
    gl.uniform1i(shaderProgram.useLightingUniform, false);
    gl.drawElements(
      gl.LINE_STRIP,
      mallaDeTriangulos.webgl_index_buffer.numItems,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
