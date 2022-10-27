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


  return vec3.fromValues(x, y, z);
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

  return vec3.fromValues(x, y, z);
};

function dibujarCurvaCubica(puntosDeControl, segmentos) {
    let curva = new Object();
    curva.puntos = [];
    curva.derivadas = [];

    let deltaU = 1/segmentos;
    let n = puntosDeControl.length/4;

    for (let i = 0; i < n; i++) {
        let puntos = puntosDeControl.slice(4*i);
        
        for (let u = 0; u <= 1.001; u = u + deltaU) {      
            curva.puntos.push(curvaCubica(u, puntos));
            curva.derivadas.push(curvaCubicaDerivadaPrimera(u, puntos));
        } 
    }

    return curva;
}

function dibujarCircunferencia(radio, segmentos) {
	let curva = new Object();
	curva.puntos = [];
	curva.derivadas = [];

	let deltaU = 1/segmentos;

	for (let u = 0; u <= 1.001; u = u + deltaU) {
	let x = radio * Math.cos(u * 2 * Math.PI);
	let y = 0;
	let z = radio * Math.sin(u * 2 * Math.PI);

	curva.puntos.push(vec3.fromValues(x, y, z));

	x = -radio * Math.sin(u * 2 * Math.PI);
	y = 0;
	z = radio * Math.cos(u * 2 * Math.PI);

	curva.derivadas.push(vec3.fromValues(x, y, z));
	}

	return curva;
}