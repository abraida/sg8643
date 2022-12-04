
function shape_cubica(puntosDeControl, segmentos) {
    let shape = new Object();
    shape.puntos = [];
    shape.normales = [];

    let deltaU = 1/segmentos;
    let n = puntosDeControl.length/4;

    for (let i = 0; i < n; i++) {
        let puntos = puntosDeControl.slice(4*i);
        
        for (let u = 0; u <= segmentos; u++) {      
            	shape.puntos.push(curvaCubica(u*deltaU, puntos));
		let tangente = curvaCubicaDerivadaPrimera(u*deltaU, puntos);
        
		let mod = Math.sqrt(tangente[1]*tangente[1] + tangente[0]*tangente[0]);

            	shape.normales.push([-tangente[1]/mod, tangente[0]/mod, 0]);
        } 
    }

    return shape;
}

function shape_line(p0, p1, segmentos) {
	let shape = new Object();
	shape.puntos = [];
	shape.normales = [];

	let deltaU = 1/segmentos;

	for (let u = 0; u <= segmentos; u++) {
		let x = p0[0] + u*deltaU*(p1[0] - p0[0]);
		let y = p0[1] + u*deltaU*(p1[1] - p0[1]);

		shape.puntos.push([x, y, 0]);

		x = p1[0] - p0[0];
		y = p1[1] - p0[1];
		
		let mod = Math.sqrt(x*x + y*y);
		shape.normales.push([-y/mod, x/mod, 0]);
	}

	return shape;
}


function concatenar(c1, c2) {
 	let shape = new Object();

	shape.puntos = c1.puntos.concat(c2.puntos);
	shape.normales = c1.normales.concat(c2.normales);

	return shape;
}