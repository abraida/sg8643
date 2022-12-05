
var Base0, Base1, Base2, Base3;
var Base0der, Base1der, Base2der, Base3der;

Base0 = function (u) {
  return (1 - u) * (1 - u) * (1 - u);
}; // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3

Base1 = function (u) {
  return 3 * (1 - u) * (1 - u) * u;
}; // 3*(1-u)*(u-u2) , 3*(u-u2-u2+u3), 3u -6u2+2u3

Base2 = function (u) {
  return 3 * (1 - u) * u * u;
}; //3u2-3u3

Base3 = function (u) {
  return u * u * u;
};

// bases derivadas

Base0der = function (u) {
  return -3 * u * u + 6 * u - 3;
}; //-3u2 +6u -3

Base1der = function (u) {
  return 9 * u * u - 12 * u + 3;
}; // 9u2 -12u +3

Base2der = function (u) {
  return -9 * u * u + 6 * u;
}; // -9u2 +6u

Base3der = function (u) {
  return 3 * u * u;
}; // 3u2

function make_basis(a, b, c){
	let m = mat4.fromValues(
    	a[0], a[1], a[2], 0,
		b[0], b[1], b[2], 0,
     	c[0], c[1], c[2], 0,
		0,    0,    0,    1);
	return m;
}

var curvaCubica = function (u, puntosDeControl) {
  var p0 = puntosDeControl[0];
  var p1 = puntosDeControl[1];
  var p2 = puntosDeControl[2];
  var p3 = puntosDeControl[3];

  let x =
    Base0(u) * p0[0] + Base1(u) * p1[0] + Base2(u) * p2[0] + Base3(u) * p3[0];
  let y =
    Base0(u) * p0[1] + Base1(u) * p1[1] + Base2(u) * p2[1] + Base3(u) * p3[1];
  let z =
    Base0(u) * p0[2] + Base1(u) * p1[2] + Base2(u) * p2[2] + Base3(u) * p3[2];


  return [x, y, z];
};

var curvaCubicaDerivadaPrimera = function (u, puntosDeControl) {
  var p0 = puntosDeControl[0];
  var p1 = puntosDeControl[1];
  var p2 = puntosDeControl[2];
  var p3 = puntosDeControl[3];

  let x =
    Base0der(u) * p0[0] +
    Base1der(u) * p1[0] +
    Base2der(u) * p2[0] +
    Base3der(u) * p3[0];
  let y =
    Base0der(u) * p0[1] +
    Base1der(u) * p1[1] +
    Base2der(u) * p2[1] +
    Base3der(u) * p3[1];
  let z =
    Base0der(u) * p0[2] +
    Base1der(u) * p1[2] +
    Base2der(u) * p2[2] +
    Base3der(u) * p3[2];

  return [x, y, z];
};

function path_circle(radio, segmentos, a = 0, b= 2*Math.PI) {
	let curva = new Object();
  	curva.matricesPuntos = [];
  	curva.matricesNormales = [];
  	curva.tangentes = [];


	let deltaU = 1/segmentos * (b-a);

	for (let u = 0; u <= segmentos; u++) {
		let x = radio * Math.cos(u * deltaU);
		let z = radio * Math.sin(u * deltaU);

		let punto = vec3.fromValues(x, 0, z);

		x = -Math.sin(u * deltaU);
		z = Math.cos(u * deltaU);

		let tan = vec3.fromValues(x, 0, z);
		vec3.normalize(tan, tan);

		x = -Math.cos(u * deltaU);
		z = -Math.sin(u * deltaU);

		let bin = vec3.fromValues(x, 0, z);
		vec3.normalize(bin, bin);

		let nrm = vec3.fromValues(0, 1, 0);
		let m1 = mat4.create();

		m1 = mat4.fromTranslation(m1, punto);
		let m2 = make_basis(bin, nrm, tan);
		mat4.multiply(m1, m1, m2);

		curva.matricesPuntos.push(m1);
		curva.matricesNormales.push(m2);
		curva.tangentes.push(tan);
	}

	return curva;
}

function path_line(segmentos, longitud) {
	let curva = new Object();
  	curva.matricesPuntos = [];
  	curva.matricesNormales = [];
  	curva.tangentes = [];

	let deltaU = 1*longitud/segmentos;

	for (let u = 0; u <= segmentos; u++) {
		let punto = vec3.fromValues(0, 0, u * deltaU);

		let tan = vec3.fromValues(0, 0, -1);

		let bin = vec3.fromValues(-1, 0, 0);

		let nrm = vec3.fromValues(0, 1, 0);

		let m1 = mat4.create();
		mat4.fromTranslation(m1, punto);
		let m2 = make_basis(bin, nrm, tan);
		mat4.multiply(m1, m1, m2);

		curva.matricesPuntos.push(m1);
		curva.matricesNormales.push(m2);
		curva.tangentes.push(tan);
	}

	return curva;	
}

function path_3Dline(p0, p1, segs) {
	let curva = new Object();
  	curva.matricesPuntos = [];
  	curva.matricesNormales = [];
  	curva.tangentes = [];

	let deltaU = 1/segs;

	for (let u = 0; u <= segs; u++) {
		let x = p0[0] + u*deltaU*(p1[0] - p0[0]);
		let y = p0[1] + u*deltaU*(p1[1] - p0[1]);
		let z = p0[2] + u*deltaU*(p1[2] - p0[2]);

		let punto = [x, y, z];

		x = p1[0] - p0[0];
		y = p1[1] - p0[1];
		z = p1[2] - p0[2];

		let tan = vec3.fromValues(x, y, z);
		vec3.normalize(tan, tan);
		let nrm = vec3.fromValues(0, 1, 0);

		let bin = vec3.create();
		vec3.cross(bin, tan, nrm);

		let m1 = mat4.create();
		mat4.fromTranslation(m1, punto);
		let m2 = make_basis(bin, nrm, tan);
		mat4.multiply(m1, m1, m2);

		curva.matricesPuntos.push(m1);
		curva.matricesNormales.push(m2);
  		curva.tangentes.push(tan);
	
	}

	return curva;	
}