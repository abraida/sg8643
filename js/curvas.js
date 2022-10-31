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

function dibujarCurvaCubica(puntosDeControl, segmentos) {
    let curva = new Object();
    curva.puntos = [];
    curva.tangentes = [];
    curva.normales = [];


    let deltaU = 1/segmentos;
    let n = puntosDeControl.length/4;

    for (let i = 0; i < n; i++) {
        let puntos = puntosDeControl.slice(4*i);
        
        for (let u = 0; u <= 1.001; u = u + deltaU) {      
            curva.puntos.push(curvaCubica(u, puntos));
            let tangente = curvaCubicaDerivadaPrimera(u, puntos);
            curva.tangentes.push(tangente);
            
            let normal = vec3.create();
            normal = vec3.cross(normal, vec3.fromValues(tangente[0], tangente[1], tangente[2]), vec3.fromValues(0, -1, 0));

            curva.normales.push([tangente[1], -tangente[0], 0]);
        } 
    }

    return curva;
}

function dibujarCircunferencia(radio, segmentos) {
	let curva = new Object();
	curva.puntos = [];
	curva.tangentes = [];
	curva.normales = [];


	let deltaU = 1/segmentos;

	for (let u = 0; u <= 1.001; u = u + deltaU) {
		let x = -radio * Math.cos(u * 2 * Math.PI);
		let y = 0;
		let z = radio * Math.sin(u * 2 * Math.PI);

		curva.puntos.push([x, y, z]);

		x = radio * Math.sin(u * 2 * Math.PI);
		y = 0;
		z = radio * Math.cos(u * 2 * Math.PI);

		curva.tangentes.push([x, y, z]);

		let normal = vec3.create();
		normal = vec3.cross(normal, vec3.fromValues(x, y, z), vec3.fromValues(0, -1, 0));
		curva.normales.push([normal[0], normal[1], normal[2]]);
	}

	return curva;
}

function dibujarRecta(p0, p1, segmentos) {
	let curva = new Object();
	curva.puntos = [];
	curva.tangentes = [];
	curva.normales = [];

	let deltaU = 1/segmentos;

	for (let u = 0; u <= 1.001; u = u + deltaU) {
		let x = p0[0] + u*(p1[0] - p0[0]);
		let y = p0[1] + u*(p1[1] - p0[1]);

		curva.puntos.push([x, y, 0]);

		x = p1[0] - p0[0];
		y = p1[1] - p0[1];

		curva.tangentes.push([x, y, 0]);
		curva.normales.push([-y, x, 0]);

	}

	return curva;
}


function concatenar(c1, c2) {
 	let curva = new Object();

	let lastIndex = c1.puntos.length-1;
		
	let x = c2.puntos[0][0] - c1.puntos[lastIndex][0];
	let y = c2.puntos[0][1] - c1.puntos[lastIndex][1]; 
	let z = c2.puntos[0][2] - c1.puntos[lastIndex][2]; 

	let normal = vec3.create();
	normal = vec3.cross(normal, vec3.fromValues(x, y, z), vec3.fromValues(0, -1, 0));

	c1.normales[lastIndex] = [[normal[0], normal[1], normal[2]]];	

	c1.tangentes[lastIndex] = [x, y, z];
	
	curva.puntos = c1.puntos.concat(c2.puntos);
	curva.tangentes = c1.tangentes.concat(c2.tangentes);
	curva.normales = c1.normales.concat(c2.normales);

	return curva;
}