class Catapulta extends Objeto {
	constructor() {
		super();
		
		let eje1 = new Objeto();
		eje1.setPosicion(0, .1, 0);
		eje1.setRotacion(1, 0, 0, Math.PI/2);
		this.agregarHijo(eje1)
		
		let cil1 = this.#crear_cilindro(.2, 3.5);
		cil1.setPosicion(0,-2.75,0);
		eje1.agregarHijo(cil1);
		
		let rueda1 = this.#crear_cilindro(1, .1);
		rueda1.setPosicion(0,.6,0);

		let rueda2 = this.#crear_cilindro(1, .1);
		rueda2.setPosicion(0,-2.7,-0);

		eje1.agregarHijo(rueda1);
		eje1.agregarHijo(rueda2);

		let eje2 = new Objeto();
		eje2.setPosicion(-4, .1, 0);
		eje2.setRotacion(1, 0, 0, Math.PI/2);
		this.agregarHijo(eje2)

		let cil2 = this.#crear_cilindro(.2, 3.5);
		cil2.setPosicion(0,-2.75,0);
		eje2.agregarHijo(cil2);
		
		let rueda3 = this.#crear_cilindro(1, .1);
		rueda3.setPosicion(0,.6,0);
		let rueda4 = this.#crear_cilindro(1, .1);
		rueda4.setPosicion(0,-2.7,-0);

		eje2.agregarHijo(rueda3);
		eje2.agregarHijo(rueda4);

		let base = this.#crear_cuadrado(6, 3, .25);

		base.setPosicion(-5, 0, -2.5);
		this.agregarHijo(base);
		
		let sop1 = this.#crear_soporte(1.3, .1, 2);

		sop1.setPosicion(-1.5, 2.3,0);
		sop1.setRotacion(1, 0, 0, Math.PI);
		this.agregarHijo(sop1);

		let sop2 = this.#crear_soporte(1.3, .1, 2);

		sop2.setPosicion(-1.5, 2.3, -2);
		sop2.setRotacion(1, 0, 0, Math.PI);
		this.agregarHijo(sop2);

		let cil3 = this.#crear_cilindro(.3, 3);
		cil3.setPosicion(-.9, 1.70, -2.5);
		cil3.setRotacion(1, 0, 0, Math.PI/2);
		this.agregarHijo(cil3);

		let brazo = new Objeto();
		brazo.setPosicion(-.9, 1.70, -2.5);
		
		brazo.setRotacion(0, 0, 1, .60*Math.PI);

		this.agregarHijo(brazo);
		
		let pala1 = this.#crear_cuadrado(.2, .5, 4);
		pala1.setPosicion(0, -.5, 1.25);
		
		brazo.agregarHijo(pala1);

		let pala2 = this.#crear_cuadrado(.25, .9, 1);
		pala2.setPosicion(0, 3.5, 1.05);
		brazo.agregarHijo(pala2);
		

		let municion = this.#crear_esfera(.4);
		municion.setPosicion(.6, 4, 1.5);
		brazo.agregarHijo(municion);

		let contrapeso = new Objeto();
		contrapeso.setPosicion(.10, -.25, 1);
		brazo.agregarHijo(contrapeso);

		let cil4 = this.#crear_cilindro(.05, 1);
		cil4.setPosicion(0, 0, 0);
		cil4.setRotacion(1, 0, 0, Math.PI/2);
		contrapeso.agregarHijo(cil4);

		let sop3 = this.#crear_soporte(.25, .05, .4);
		sop3.setPosicion(.1, -.125, .1);
		sop3.setRotacion(0, 0, 1, Math.PI/2);
		contrapeso.agregarHijo(sop3);

		let sop4 = this.#crear_soporte(.25, .05, .4);
		sop4.setPosicion(.1, -.125, .85);
		sop4.setRotacion(0, 0, 1, Math.PI/2);
		contrapeso.agregarHijo(sop4);
		
		let cubo = this.#crear_cuadrado(.7, 1, .5);
		cubo.setPosicion(-.8, .35, .0);
		cubo.setRotacion(0, 0, 1, -Math.PI/2);
		contrapeso.agregarHijo(cubo);		

		this.brazo = brazo;
		this.municion = municion;

		this.posPrevia = [0, 0 ,0];

	}


	#crear_cilindro(radio, largo) {
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

	#crear_cuadrado(ancho, largo, alto){
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

	#crear_esfera(radio){
		let geom = generar_esfera();
		let e = new Objeto();
		e.setGeometria(geom.webgl_position_buffer, geom.webgl_index_buffer, geom.webgl_normal_buffer);
		e.setEscala(radio, radio, radio);
		return e;
	}

	#crear_soporte(ancho, largo, alto){
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

	disparar(u) {
		this.brazo.setRotacion(0, 0, 1, (-u)*Math.PI);

	}
	
	lanzar_municion(){
		this.brazo.quitarHijo(this.municion);
		this.municion.matriz_modelado = this.municion.wpos;
		return this.municion;
	}

	restaurar_municion(){
		let municion = this.#crear_esfera(.4);
		municion.setPosicion(.6, 4, 1.5);
		this.brazo.agregarHijo(municion);
		this.municion = municion;
	}

	get_municion_pos(){		
		let pos = vec3.create();
		vec3.transformMat4(pos, pos, this.municion.wpos);
		return pos;
	}
}