function crear_cilindro(radio, largo) {
	let shape = new Object();

	shape.puntos = [[0,0,0], [-radio/2, 0, 0], [-radio/2, 1, 0], [0, 1, 0]]
	shape.normales = [[0, -1, 0], [-1, 0, 0], [-1, 0, 0], [0,1,0]];

	path = dibujarCircunferencia(0.01, 10);
	
	let geom =  generar_superficie_barrido(path, shape);	
	
	let cilindro = new Objeto();
	cilindro.setGeometria(geom.webgl_position_buffer, geom.webgl_index_buffer, geom.webgl_normal_buffer);

	cilindro.setEscala(1, largo, 1);

	return cilindro;	
}

function crear_cuadrado(ancho, largo, alto){
	let path =  new Object();
	let shape = new Object();

	shape.puntos = [[0,0,0], [0, 1, 0], [1, 1, 0], [1, 0, 0], [0, 0, 0]];
	shape.normales = [[1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0], [1, 0, 0]];

	
	path.puntos = [[0, 0, 0], [0, 1, 0]];
	path.tangentes = [[0, 1, 0], [0, 1, 0]];
	path.normales = [[0, 0, 1], [0, 0, 1]];

	let geom = generar_superficie_barrido(path, shape, true);	
	
	let cuad = new Objeto();
	cuad.setGeometria(geom.webgl_position_buffer, geom.webgl_index_buffer, geom.webgl_normal_buffer);

	cuad.setEscala(ancho, alto, largo);

	return cuad;	
}

function crear_esfera(radio){
	let geom = generar_esfera();
	let e = new Objeto();
	e.setGeometria(geom.webgl_position_buffer, geom.webgl_index_buffer, geom.webgl_normal_buffer);
	e.setEscala(radio, radio, radio);
	return e;
}

function crear_soporte(ancho, largo, alto){
	let path =  new Object();
	let shapes = [];
	
	let paso = 1/10;
	for (let i = 0; i < 4; i++) {
		let shape = new Object();
		shape.puntos = [[i*paso,0,0], [i*paso, 1, 0], [1-i*paso, 1, 0], [1-i*paso, 0, 0], [i*paso, 0, 0]];
		shape.normales = [[1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0], [1, 0, 0]];
		shapes.push(shape);
	}	
	path = dibujarRecta([0, 1, 0], [0, 0, 0], 3);
	let geom = generar_superficie_barrido_variable(path, shapes, false);	
	
	let cuad = new Objeto();
	cuad.setGeometria(geom.webgl_position_buffer, geom.webgl_index_buffer, geom.webgl_normal_buffer);

	cuad.setEscala(ancho, alto, largo);

	return cuad;	
}

function crear_catapulta() {
	let contenedor = new Objeto();

	let eje1 = new Objeto();
	eje1.setPosicion(0, .1, 0);
	eje1.setRotacion(1, 0, 0, Math.PI/2);
	contenedor.agregarHijo(eje1)
	
	let cil1 = crear_cilindro(.2, 3.5);
	cil1.setPosicion(0,-2.75,0);
	eje1.agregarHijo(cil1);
	
	let rueda1 = crear_cilindro(1, .1);
	rueda1.setPosicion(0,.6,0);

	let rueda2 = crear_cilindro(1, .1);
	rueda2.setPosicion(0,-2.7,-0);

	eje1.agregarHijo(rueda1);
	eje1.agregarHijo(rueda2);

	let eje2 = new Objeto();
	eje2.setPosicion(-4, .1, 0);
	eje2.setRotacion(1, 0, 0, Math.PI/2);
	contenedor.agregarHijo(eje2)

	let cil2 = crear_cilindro(.2, 3.5);
	cil2.setPosicion(0,-2.75,0);
	eje2.agregarHijo(cil2);
	
	let rueda3 = crear_cilindro(1, .1);
	rueda3.setPosicion(0,.6,0);
	let rueda4 = crear_cilindro(1, .1);
	rueda4.setPosicion(0,-2.7,-0);

	eje2.agregarHijo(rueda3);
	eje2.agregarHijo(rueda4);

	let base = crear_cuadrado(6, 3, .25);

	base.setPosicion(-5, 0, -2.5);
	contenedor.agregarHijo(base);
	
	let sop1 = crear_soporte(1.3, .1, 2);

	sop1.setPosicion(-1.5, 2.3,0);
	sop1.setRotacion(1, 0, 0, Math.PI);
	contenedor.agregarHijo(sop1);

	let sop2 = crear_soporte(1.3, .1, 2);

	sop2.setPosicion(-1.5, 2.3, -2);
	sop2.setRotacion(1, 0, 0, Math.PI);
	contenedor.agregarHijo(sop2);

	let brazo = new Objeto();
	brazo.setRotacion(0, 0, 1, Math.PI/2);
	brazo.setPosicion(.65, 1.7, -1.25);
	contenedor.agregarHijo(brazo);

	let pala1 = crear_cuadrado(.2, .5, 4);
	brazo.agregarHijo(pala1);

	let pala2 = crear_cuadrado(.25, .9, 1);
	pala2.setPosicion(0, 4, -.2);
	brazo.agregarHijo(pala2);
	
	let cil3 = crear_cilindro(.3, 3);
	cil3.setPosicion(.15, 1.5, -1.25);
	cil3.setRotacion(1, 0, 0, Math.PI/2);
	brazo.agregarHijo(cil3);

	let municion = crear_esfera(.4);
	municion.setPosicion(.6, 4.5, .25);
	brazo.agregarHijo(municion);

	let contrapeso = new Objeto();
	contrapeso.setPosicion(.10, .25, -.25);
	brazo.agregarHijo(contrapeso);

	let cil4 = crear_cilindro(.05, 1);
	cil4.setPosicion(0, 0, 0);
	cil4.setRotacion(1, 0, 0, Math.PI/2);
	contrapeso.agregarHijo(cil4);

	let sop3 = crear_soporte(.25, .05, .4);
	sop3.setPosicion(.1, -.125, .1);
	sop3.setRotacion(0, 0, 1, Math.PI/2);
	contrapeso.agregarHijo(sop3);

	let sop4 = crear_soporte(.25, .05, .4);
	sop4.setPosicion(.1, -.125, .85);
	sop4.setRotacion(0, 0, 1, Math.PI/2);
	contrapeso.agregarHijo(sop4);
	
	let cubo = crear_cuadrado(.7, 1, .5);
	cubo.setPosicion(-.8, .35, .0);
	cubo.setRotacion(0, 0, 1, -Math.PI/2);
	contrapeso.agregarHijo(cubo);

	return contenedor;
}