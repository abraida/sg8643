function getPos(alfa, beta) {
  var r = 2;
  var nx = Math.sin(beta) * Math.sin(alfa);
  var ny = Math.sin(beta) * Math.cos(alfa);
  var nz = Math.cos(beta);

  var g = beta % 0.5;
  var h = alfa % 1;
  var f = 1;

  if (g < 0.25) f = 0.95;
  if (h < 0.5) f = f * 0.95;

  var x = nx * r * f;
  var y = ny * r * f;
  var z = nz * r * f;

  return [x, y, z];
}

function getNrm(alfa, beta) {
  var n = vec3.create();

  return n;
}

function setupBuffers() {
  var pos = [];
  var normal = [];
  var r = 2;
  var rows = 128;
  var cols = 256;

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var u = u / rows;
      var v = u / cols;

      var p = getPos(u, v);

      pos.push(p[0]);
      pos.push(p[1]);
      pos.push(p[2]);

      var n = getNrm(u, v);

      normal.push(n[0]);
      normal.push(n[1]);
      normal.push(n[2]);
    }
  }

  trianglesVerticeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

  trianglesNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

  var index = [];

  for (var i = 0; i < rows - 1; i++) {
    index.push(i * cols);
    for (var j = 0; j < cols - 1; j++) {
      index.push(i * cols + j);
      index.push((i + 1) * cols + j);
      index.push(i * cols + j + 1);
      index.push((i + 1) * cols + j + 1);
    }
    index.push((i + 1) * cols + cols - 1);
  }

  trianglesIndexBuffer = gl.createBuffer();
  trianglesIndexBuffer.number_vertex_point = index.length;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(index),
    gl.STATIC_DRAW
  );
}
