class Catapulta extends Objeto {
	constructor() {
		super();
		
		let eje1 = new Objeto();
		eje1.setPosicion(2, .1, .18);
		eje1.setRotacion(1, 0, 0, Math.PI/2);
		this.agregarHijo(eje1)
		
		let cil1 = this.#crear_cilindro(.2, 3.5);
		cil1.setPosicion(0,-1.75,0);
		eje1.agregarHijo(cil1);
		
		let rueda1 = this.#crear_cilindro(1, .1);
		rueda1.setPosicion(0,-1.7,0);

		let rueda2 = this.#crear_cilindro(1, .1);
		rueda2.setPosicion(0,1.6,-0);

		eje1.agregarHijo(rueda1);
		eje1.agregarHijo(rueda2);

		let eje2 = new Objeto();
		eje2.setPosicion(-2, .1, .18);
		eje2.setRotacion(1, 0, 0, Math.PI/2);
		this.agregarHijo(eje2)

		let cil2 = this.#crear_cilindro(.2, 3.5);
		cil2.setPosicion(0,-1.75,0);
		eje2.agregarHijo(cil2);
		
		let rueda3 = this.#crear_cilindro(1, .1);
		rueda3.setPosicion(0,-1.7,0);
		let rueda4 = this.#crear_cilindro(1, .1);
		rueda4.setPosicion(0,1.6,-0);

		eje2.agregarHijo(rueda3);
		eje2.agregarHijo(rueda4);

		let base = this.#crear_cuadrado(7, 5.5, .3);

		base.setPosicion(3.5, 0, -1.20);
		this.agregarHijo(base);
		
		let sop1 = this.#crear_soporte(1.3, .1, 2.5);

		sop1.setPosicion(2.25,.25,1.25);
		sop1.setRotacion(1, 0, 0, -Math.PI/2);
		this.agregarHijo(sop1);

		let sop2 = this.#crear_soporte(1.3, .1, 2.5);

		sop2.setPosicion(2.25, .25, -.8);
		sop2.setRotacion(1, 0, 0, -Math.PI/2);
		this.agregarHijo(sop2);

		let cil3 = this.#crear_cilindro(.3, 3);
		cil3.setPosicion(1.6, 1.50, -1.35);
		cil3.setRotacion(1, 0, 0, Math.PI/2);
		this.agregarHijo(cil3);

		let brazo = new Objeto();
		brazo.setPosicion(1.6, 1.6, -1.15);

		
		brazo.setRotacion(0, 0, 1, .58*Math.PI);

		this.agregarHijo(brazo);
		
		let pala1 = this.#crear_cuadrado(.15, .7, 4);
		pala1.setPosicion(0, -.5, 1.25);
		
		brazo.agregarHijo(pala1);

		let pala2 = this.#crear_cuadrado(.2, 1.8, 1);
		pala2.setPosicion(0, 3.5, 1);
		brazo.agregarHijo(pala2);
		
		let municion = this.#crear_esfera(.3);
		municion.setPosicion(.3, 4, 1.5);
		brazo.agregarHijo(municion);

		let contrapeso = new Objeto();
		contrapeso.setPosicion(-.05, -.45, .9);
		brazo.agregarHijo(contrapeso);

		let cil4 = this.#crear_cilindro(.05, 1);
		cil4.setPosicion(0, 0, 0);
		cil4.setRotacion(1, 0, 0, Math.PI/2);
		contrapeso.agregarHijo(cil4);

		let sop3 = this.#crear_soporte(.25, .05, .4);
		sop3.setPosicion(.1, -.125, .1);
		//sop3.setRotacion(0, 1, 0, Math.PI/2);
		contrapeso.agregarHijo(sop3);

		let sop4 = this.#crear_soporte(.25, .05, .4);
		sop4.setPosicion(.1, -.125, .85);
		sop4.setRotacion(0, 1, .5, Math.PI/2);
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

		let path = path_circle(0.01, 10);
		
		let geom =  generar_superficie_barrido(path, shape);	
		
		let cilindro = new Objeto();
		cilindro.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);

		cilindro.setEscala(1, largo, 1);

		return cilindro;	
	}

	#crear_cuadrado(ancho, largo, alto){
		let shape = new Object();
		
		shape.puntos = [[0,0,0], [0, 1, 0], [1, 1, 0], [1, 0, 0], [0, 0, 0]];
		shape.normales = [[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]];
		
		let path = path_line(2, 1);

		let geom = generar_superficie_barrido(path, shape, true);	
		
		let cuad = new Objeto();
		cuad.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);

		cuad.setEscala(ancho, alto, largo);

		return cuad;	
	}

	#crear_esfera(radio){
		let geom = generar_esfera();
		let e = new Objeto();
		e.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		e.setEscala(radio, radio, radio);
		return e;
	}

	#crear_soporte(ancho, alto, largo){
		let path =  new Object();
		let shapes = [];
		
		let paso = 1/10;
		for (let i = 0; i < 4; i++) {
			let shape = new Object();
			shape.puntos = [[i*paso,0,0], [i*paso, 1, 0], [1-i*paso, 1, 0], [1-i*paso, 0, 0], [i*paso, 0, 0]];
			shape.normales = [[1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0], [1, 0, 0]];
			shapes.push(shape);
		}	

		path = path_line(3, 1);
		let geom = generar_superficie_barrido_variable(path, shapes, false);	
		
		let cuad = new Objeto();
		cuad.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);

		cuad.setEscala(ancho, alto, largo);

		return cuad;	
	}

	disparar(u) {
		this.brazo.setRotacion(0, 0, 1, (-u+.55)*Math.PI);

	}
	
	lanzar_municion(){
		this.municion.setGeometria(null, null, null);
		
		let d = new Objeto();
		let geom = generar_esfera();
		d.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		return d;
	}

	restaurar_municion(){
		let geom = generar_esfera();
		this.municion.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		this.municion.setEscala(.3, .3, .3);
	}

	get_municion_pos(){		
		let pos = vec3.create();
		vec3.transformMat4(pos, pos, this.municion.wpos);
		return pos;
	}
}