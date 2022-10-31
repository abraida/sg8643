let alto_piso = 4;


function crear_torre(pisos) {
	let r = 1.5;
	let alto1 = (pisos - 1) * alto_piso;
	let c1 = dibujarRecta([-r, 0, 0], [-r, alto1, 0], 2);
	let puntos = [
		[-r, alto1, 0], [-r - 0.17, alto1 + 2.5, 0], [-r -0.7, alto1 + 2.25, 0], [-r-0.5, alto1 + 3.1, 0]
	]

	let c2 = dibujarRecta([-r-0.5, alto1+3.1, 0], [-r-0.5, alto1 + 3.1 + alto_piso/2, 0], 3);
	
	let shape = dibujarCurvaCubica(puntos, 20); 
	
	shape = concatenar(c1, shape);
	shape = concatenar(shape, c2);


	let path = dibujarCircunferencia(0.001, 20);

	return generar_superficie_barrido(path, shape);
}

function crear_punta() {
	let r = 2;
	let puntos = [
		[-r, 0, 0], [-0.5*r, 2, 0], 
		[-0.25*r, 3, 0], [0, 5, 0],
	]
	
	let shape = dibujarCurvaCubica(puntos, 5);
	let path = dibujarCircunferencia(0.001, 20);

	return generar_superficie_barrido(path, shape);	
}

function crear_pared(largo, alto) {
	return generar_plano(largo, alto);
}

function crear_ventana() {
	let path =  new Object();

	let puntos = [[0, 0, 0], [0, 1.5, 0], [.99, 1.5, 0], [.99, 0, 0], 
	[.99, 0, 0], [.99, 0, 0], [0, 0, 0], [0, 0, 0]];

	shape = dibujarCurvaCubica(puntos, 50);
	
	path.puntos = [[0, 0, -.6], [0, 0, .6]];
	path.tangentes = [[0, 0, 1], [0, 0, 1]];
	path.normales = [[1, 0, 0], [1, 0, 0]];

	return generar_superficie_barrido(path, shape, true);
}

function crear_piso(largo, ancho) {
	return generar_plano(largo+.5, ancho+.5);	
}
function crear_muro(a, lados) {
	let h = .5;
	let puntos = [
	[0, 0, 0], [.06*6, .3*a, 0], [.2*6, .6*a, 0], [.2*6, a, 0], 
	[.2*6, a, 0], [.2*6, a, 0], [.2*6, a+.3, 0], [.2*6, a+.3, 0],
	[.2*6, a+h, 0], [.2*6, a+h, 0], [.2*6+.2, a+h, 0], [.2*6+.2, a+h, 0],
	[.2*6+.2, a+h, 0], [.2*6+.2, a+h, 0], [.2*6+.2, a, 0], [.2*6+.2, a, 0],
	[.2*6+.2, a, 0], [.2*6+.2, a, 0], [.7*6+.2, a, 0], [.7*6+.2, a, 0],
	[.7*6+.2, a, 0], [.7*6+.2, a, 0], [.7*6+.2, a+h, 0], [.7*6+.2, a+h, 0],
	[.7*6+.2, a+h, 0], [.7*6+.2, a+h, 0], [.7*6+.4, a+h, 0], [.7*6+.4, a+h, 0],
	[.7*6+.4, a+h, 0], [.7*6+.4, a+h, 0], [.7*6+.4, a, 0], [.7*6+.4, a, 0],
	[.7*6+.4, a, 0], [.7*6+.4, .6*a, 0], [.56*6+.4, .3*a, 0], [.5*6+.4, 0, 0],	
	];
	
	let path = dibujarCircunferencia(30, lados);

	let shape = dibujarCurvaCubica(puntos, 50);
	return generar_superficie_barrido(path, shape);
}

function crear_torre_muralla(alto) {
	let r = 4;
	let h = 1;
	let a = alto - h;
	let puntos = [
		[-r, 0, 0], [-r, a/2, 0], [-.65*r, a/3, 0], [-.65*r, a, 0],
		[-.65*r, a, 0], [-.65*r, a, 0], [-.8*r, a, 0], [-.8*r, a+h*2, 0]
	];

	let c1 = dibujarRecta([-.8*r, a+h*2, 0], [-.8*r, a+h*2+h, 0], 2);
	
	let c2 = dibujarRecta([-.8*r, a+h*2+h, 0], [-.7*r, a+h*2+h, 0], 2);
	let c3 = dibujarRecta([-.7*r, a+h*2+h, 0], [-.7*r, a+h*2, 0], 2);
	let c4 = dibujarRecta([-.7*r, a+h*2, 0], [0, a+h*2, 0], 2);

	let shape = dibujarCurvaCubica(puntos, 10);
	shape = concatenar(shape, c1);
	shape = concatenar(shape, c2);
	shape = concatenar(shape, c3);
	shape = concatenar(shape, c4);


	let path = dibujarCircunferencia(0.001, 10);

	return generar_superficie_barrido(path, shape);

}

function crear_castillo(ancho, largo, pisos, altoMuralla, ladosMuralla) {
	let contenedor = new Objeto();
	
	let edificio = new Objeto();
	edificio.setPosicion(-ancho/2, 0, largo/2);
	let muralla = new Objeto();

	contenedor.agregarHijo(edificio);
	contenedor.agregarHijo(muralla);

	// Torres

	let geomTorre = crear_torre(pisos);
	
	let torre1 = new Objeto();
	torre1.setGeometria(geomTorre.webgl_position_buffer, geomTorre.webgl_index_buffer, geomTorre.webgl_normal_buffer);
	torre1.setPosicion(0, 0, 0);

	let torre2 = new Objeto();
	torre2.setGeometria(geomTorre.webgl_position_buffer, geomTorre.webgl_index_buffer, geomTorre.webgl_normal_buffer);
	torre2.setPosicion(ancho, 0, 0);

	let torre3 = new Objeto();
	torre3.setGeometria(geomTorre.webgl_position_buffer, geomTorre.webgl_index_buffer, geomTorre.webgl_normal_buffer);
	torre3.setPosicion(ancho, 0, -largo);

	let torre4 = new Objeto();
	torre4.setGeometria(geomTorre.webgl_position_buffer, geomTorre.webgl_index_buffer, geomTorre.webgl_normal_buffer);
	torre4.setPosicion(0, 0, -largo);

	edificio.agregarHijo(torre1);
	edificio.agregarHijo(torre2);
	edificio.agregarHijo(torre3);
	edificio.agregarHijo(torre4);

	// Puntas

	let geomPunta = crear_punta();
	let punta1 = new Objeto();
	punta1.setGeometria(geomPunta.webgl_position_buffer, geomPunta.webgl_index_buffer, geomPunta.webgl_normal_buffer);
	punta1.setPosicion(0, (pisos - 1) * alto_piso + 2.9 + alto_piso/2, 0);

	let punta2 = new Objeto();
	punta2.setGeometria(geomPunta.webgl_position_buffer, geomPunta.webgl_index_buffer, geomPunta.webgl_normal_buffer);
	punta2.setPosicion(0, +(pisos - 1) * alto_piso +2.9 + alto_piso/2, 0);

	let punta3 = new Objeto();
	punta3.setGeometria(geomPunta.webgl_position_buffer, geomPunta.webgl_index_buffer, geomPunta.webgl_normal_buffer);
	punta3.setPosicion(0, +(pisos - 1) * alto_piso +2.9 + alto_piso/2, 0);

	let punta4 = new Objeto();
	punta4.setGeometria(geomPunta.webgl_position_buffer, geomPunta.webgl_index_buffer, geomPunta.webgl_normal_buffer);
	punta4.setPosicion(0, +(pisos - 1) * alto_piso +2.9 + alto_piso/2, 0);
	
	torre1.agregarHijo(punta1);
	torre2.agregarHijo(punta2);
	torre3.agregarHijo(punta3);
	torre4.agregarHijo(punta4);


	// Paredes

	let geomPared = crear_pared(ancho, pisos * alto_piso);
	let geomPared2 = crear_pared(largo, pisos * alto_piso);

	let paredSur = new Objeto();
	paredSur.setGeometria(geomPared.webgl_position_buffer, geomPared.webgl_index_buffer, geomPared.webgl_normal_buffer);

	let paredEste = new Objeto();
	paredEste.setGeometria(geomPared2.webgl_position_buffer, geomPared2.webgl_index_buffer, geomPared2.webgl_normal_buffer);
	paredEste.setPosicion(ancho, 0, 0);
	paredEste.setRotacion(0, 1, 0, Math.PI/2);

	let paredNorte = new Objeto();
	paredNorte.setGeometria(geomPared.webgl_position_buffer, geomPared.webgl_index_buffer, geomPared.webgl_normal_buffer);
	paredNorte.setPosicion(ancho, 0, -largo);
	paredNorte.setRotacion(0, 1, 0, Math.PI);

	let paredOeste = new Objeto();
	paredOeste.setGeometria(geomPared2.webgl_position_buffer, geomPared2.webgl_index_buffer, geomPared2.webgl_normal_buffer);
	paredOeste.setPosicion(0, 0, -largo);
	paredOeste.setRotacion(0, 1, 0, -Math.PI/2);

	edificio.agregarHijo(paredSur);
	edificio.agregarHijo(paredEste);
	edificio.agregarHijo(paredOeste);
	edificio.agregarHijo(paredNorte);

	// Ventanas
	let geomVentana = crear_ventana();

	let deltaVentanas = 3;
	let n_ventanas = (ancho - 4) / deltaVentanas;

	for (let j = 0; j < pisos; j++) {
		for (let i = 0; i < n_ventanas; i++) {
			let v = new Objeto();
			v.setGeometria(geomVentana.webgl_position_buffer, geomVentana.webgl_index_buffer, geomVentana.webgl_normal_buffer);
			v.setPosicion(i * deltaVentanas + 2, alto_piso * (j+.4), -.5);
			paredSur.agregarHijo(v);
		}

		for (let i = 0; i < ancho / deltaVentanas; i++) {
			let v = new Objeto();
			v.setGeometria(geomVentana.webgl_position_buffer, geomVentana.webgl_index_buffer, geomVentana.webgl_normal_buffer);
			v.setPosicion(i * deltaVentanas + 2, alto_piso * (j+.4), -.5);
			paredNorte.agregarHijo(v);
		}

		for (let i = 0; i < largo / deltaVentanas; i++) {
			let v = new Objeto();
			v.setGeometria(geomVentana.webgl_position_buffer, geomVentana.webgl_index_buffer, geomVentana.webgl_normal_buffer);
			v.setPosicion(i * deltaVentanas + 2, alto_piso * (j+.4), -.5);
			paredEste.agregarHijo(v);
		}

		for (let i = 0; i < largo / deltaVentanas; i++) {
			let v = new Objeto();
			v.setGeometria(geomVentana.webgl_position_buffer, geomVentana.webgl_index_buffer, geomVentana.webgl_normal_buffer);
			v.setPosicion(i * deltaVentanas + 2, alto_piso * (j+.4), -.5);
			paredOeste.agregarHijo(v);
		}
	}

	// Piso
		let geomPiso = crear_piso(ancho, largo);

		for (let i = 1; i <= pisos; i++) {
			let p = new Objeto();
			p.setGeometria(geomPiso.webgl_position_buffer, geomPiso.webgl_index_buffer, geomPiso.webgl_normal_buffer);
			p.setPosicion(-.25, alto_piso*i, -largo-.25);
			p.setRotacion(1, 0, 0, Math.PI/2);			
			
			edificio.agregarHijo(p);
		}

	// Muro
	let muro =  new Objeto();
	let geomMuro = crear_muro(altoMuralla, ladosMuralla);
	muro.setGeometria(geomMuro.webgl_position_buffer, geomMuro.webgl_index_buffer, geomMuro.webgl_normal_buffer);
	muralla.agregarHijo(muro);

	// Torres muro
	let geomTorreM = crear_torre_muralla(altoMuralla*1.5);
	let puntosTorres = dibujarCircunferencia(27, ladosMuralla).puntos;

	for (let i = 0; i < ladosMuralla; i++) {
		let t = new Objeto();
		t.setGeometria(geomTorreM.webgl_position_buffer, geomTorreM.webgl_index_buffer, geomTorreM.webgl_normal_buffer);
		t.setPosicion(puntosTorres[i][0], 0, puntosTorres[i][2]);
		muro.agregarHijo(t);
	}

	return contenedor
}