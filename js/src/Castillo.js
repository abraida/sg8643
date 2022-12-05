let altoPiso = 4;

class Castillo extends Objeto{
	constructor(ancho, largo, pisos, lados, altoMuro) {
		super();

		let altoPiso = 4;
		let rTorre = 1.5;
		let altoTorre = (pisos - 1) * altoPiso;

		let deltaVentanas = 3;
		let anchoVentanas = 1;
		let nVentanasH = (largo-2*rTorre-deltaVentanas) / (deltaVentanas + anchoVentanas);
		let nVentanasV = (ancho-2*rTorre-deltaVentanas) / (deltaVentanas + anchoVentanas);

		let rTorreM = 4;
		let altoBalcon = 1;
		let altoTorreM = altoMuro*1.5 - altoBalcon;
		
		let largoPuerta = 5;

		this.config = {
			ancho: ancho,
			largo: largo,
			pisos: pisos, 
			lados: lados,
			altoMuro: altoMuro,
			altoPiso: altoPiso,
			rTorre: rTorre,
			altoTorre: altoTorre,
			deltaVentanas: deltaVentanas,
			anchoVentanas: anchoVentanas,
			nVentanasH: nVentanasH,
			nVentanasV: nVentanasV,
			rTorreM: rTorreM,
			altoBalcon: altoBalcon,
			altoTorreM: altoTorreM,
			largoPuerta: largoPuerta
		}

		this.dir = vec3.create();
		this.posTorreA = vec3.create();
		this.posTorreB = vec3.create();


		this.edificio = new Objeto();
		this.edificio.setPosicion(-ancho/2, 0, largo/2);

		this.agregarHijo(this.edificio);
		this.muralla = new Objeto();
		this.agregarHijo(this.muralla);

		// Torres

		let torre1 = this.#crear_torre();
		torre1.setPosicion(0, 0, 0);
		this.edificio.agregarHijo(torre1);

		let torre2 = this.#crear_torre();
		torre2.setPosicion(ancho, 0, 0);
		this.edificio.agregarHijo(torre2);

		let torre3 = this.#crear_torre();
		torre3.setPosicion(ancho, 0, -largo);
		this.edificio.agregarHijo(torre3);

		let torre4 = this.#crear_torre();
		torre4.setPosicion(0, 0, -largo);
		this.edificio.agregarHijo(torre4);

		// Puntas

		let punta1 = this.#crear_punta();
		punta1.setPosicion(0, (pisos-1) * altoPiso +  3 + altoPiso/2, 0);
		torre1.agregarHijo(punta1);

		let punta2 = this.#crear_punta();
		punta2.setPosicion(0, (pisos-1) * altoPiso + 3 + altoPiso/2, 0);
		torre2.agregarHijo(punta2);

		let punta3 = this.#crear_punta();
		punta3.setPosicion(0, (pisos-1) * altoPiso + 3 + altoPiso/2, 0);
		torre3.agregarHijo(punta3);

		let punta4 = this.#crear_punta();
		punta4.setPosicion(0, (pisos-1) * altoPiso + 3 + altoPiso/2, 0);
		torre4.agregarHijo(punta4);
	
		// Paredes

		let paredSur = this.#crear_pared(largo);
		paredSur.setPosicion(ancho, 0, -largo);
		paredSur.setRotacion(0, 1, 0, -Math.PI/2);
		this.edificio.agregarHijo(paredSur);

		let paredEste = this.#crear_pared(ancho);
		paredEste.setRotacion(0, 1, 0, Math.PI);
		paredEste.setPosicion(ancho, 0, 0);
		this.edificio.agregarHijo(paredEste);

		let paredNorte = this.#crear_pared(largo);
		paredNorte.setRotacion(0, 1, 0, Math.PI/2);

		paredNorte.setPosicion(0, 0, 0);
		this.edificio.agregarHijo(paredNorte);
		
		let paredOeste = this.#crear_pared(ancho);
		paredOeste.setPosicion(0, 0, -largo);
		this.edificio.agregarHijo(paredOeste);

		// Ventanas

		for (let j = 0; j < pisos; j++) {
			let p0 = rTorre + deltaVentanas;
			let px = deltaVentanas + anchoVentanas;

			for (let i = 0; i < nVentanasH; i++) {
				let v = this.#crear_ventana();
				v.setPosicion(-1.5 + p0+i*px, altoPiso * (j+.4), .4);
				paredSur.agregarHijo(v);
			}

			for (let i = 0; i < nVentanasH; i++) {
				let v = this.#crear_ventana();

				v.setPosicion(-1.5 + p0+i*px, altoPiso * (j+.4), .4);
				paredNorte.agregarHijo(v);
			}

			for (let i = 0; i < nVentanasV; i++) {
				let v = this.#crear_ventana();

				v.setPosicion(-1.5 + p0+i*px, altoPiso * (j+.4), .4);
				paredEste.agregarHijo(v);
			}

			for (let i = 0; i < nVentanasV; i++) {
				let v = this.#crear_ventana();

				v.setPosicion(-1.5 + p0+i*px, altoPiso * (j+.4), .4);
				paredOeste.agregarHijo(v);
			}
		}

		// Pisos

		for (let i = 1; i < pisos; i++) {
			let p = this.#crear_piso();
			p.setPosicion(-.25, altoPiso*i, -largo-.25);
			p.setRotacion(1, 0, 0, Math.PI/2);			
			
			this.edificio.agregarHijo(p);
		}

		let p = this.#crear_piso();
		p.setPosicion(-.25, altoPiso*pisos, -largo-.25);
		p.setRotacion(1, 0, 0, Math.PI/2);			
		p.crearTextura("res/wall.png", "uDiffTex");
		p.crearTextura("res/wall-nml.png", "uNormalTex");
		p.usarNormalMap = true;
			
		this.edificio.agregarHijo(p);

		// Muro

		let muro = this.#crear_muro();
		this.muralla.agregarHijo(muro);

		this.len = vec3.dist(this.posTorreA, this.posTorreB);
		vec3.sub(this.dir, this.posTorreB, this.posTorreA);
		vec3.normalize(this.dir, this.dir);

		// Torres muralla

		let puntosTorres = path_circle(27, lados).matricesPuntos;

		for (let i = 0; i < lados; i++) {
			let t = this.#crear_torre_muralla();
			
			let p = vec3.create();
			mat4.getTranslation(p, puntosTorres[i])
			
			t.setPosicion(p[0], 0, p[2]);
			this.muralla.agregarHijo(t);
		}

		// Muralla restante

		let m = this.#crear_muro2();
		this.muralla.agregarHijo(m.m1);
		this.muralla.agregarHijo(m.m2);
		this.muralla.agregarHijo(m.m3);


		// Marco de la puerta

		let ma = this.#crear_marco();
		this.muralla.agregarHijo(ma.m1);
		this.muralla.agregarHijo(ma.m2);

		// Puerta

		let pu = this.#crear_puerta();
		this.muralla.agregarHijo(pu);

		// Antorcha

		this.ant = this.#crear_antorchas();
		this.muralla.agregarHijo(this.ant.e);
		this.muralla.agregarHijo(this.ant.e1);

	}
	
	#crear_torre() {
		let r = this.config.rTorre;
		let a = this.config.altoTorre;
	

		let c1 = shape_line([-r, 0, 0], [-r, a, 0], 1);
	
		let puntos = [
			[-r, a, 0], [-r - 0.17, a + 2.5, 0], [-r -0.7, a + 2.25, 0], [-r-0.5, a + 3.1, 0]
		]
		
		let shape = shape_cubica(puntos, 10); 
	
		let c2 = shape_line([-r-0.5, a+3.1, 0], [-r-0.5, a + 3.1 + 4/2, 0], 2);
			
		shape = concatenar(c1, shape);
		shape = concatenar(shape, c2);
	
		let path = path_circle(0.001, 10);
		let geom = generar_superficie_barrido(path, shape, false, 1.5*this.config.pisos, 1);
		

		let t = new Objeto();
		
		t.setGeometria(geom);
		t.setTextureBuffer(geom.uvBuffer);
		
		t.crearTextura("res/castle.png", "uDiffTex");
		t.crearTextura("res/castle-nml.png", "uNormalTex");
		t.usarNormalMap = true;


		return t;
	}

	
	#crear_punta() {
		let r = this.config.rTorre + .5;


		let puntos = [
			[-r, 0, 0], [-0.5*r, 2, 0], 
			[-0.25*r, 3, 0], [0, 5, 0],
		]
		
		let shape = shape_cubica(puntos, 10);
		let path = path_circle(0.001, 10);
		let geom = generar_superficie_barrido(path, shape);


		let p = new Objeto();

		p.setGeometria(geom);
		p.setTextureBuffer(geom.uvBuffer);
		
		p.crearTextura("res/castle.png", "uDiffTex");
		p.crearTextura("res/castle-nml.png", "uNormalTex");
		p.usarNormalMap = true;

		return p;
	}
	
	#crear_pared(w) {
		let geom = generar_plano(w, this.config.altoPiso * this.config.pisos, false, this.config.pisos, 2); 
		
		let p = new Objeto();
		
		p.setGeometria(geom);
		p.setTextureBuffer(geom.uvBuffer);
		
		p.crearTextura("res/castle.png", "uDiffTex");
		p.crearTextura("res/castle-nml.png", "uNormalTex");
		p.usarNormalMap = true;
		
		return p;
	}
	#crear_ventana() {
		let w = this.config.anchoVentanas;


		let puntos = [[0, 0, 0], [0, 1.5, 0], [w, 1.5, 0], [w, 0, 0], 
		[w, 0, 0], [w, 0, 0], [0, 0, 0], [0, 0, 0]];
		
		let shape = shape_cubica(puntos, 6);
		let path = path_line(2, .65);
		let geom = generar_superficie_barrido(path, shape, true);
		
		
		let v = new Objeto();
		
		v.setGeometria(geom);
		v.setTextureBuffer(geom.uvBuffer);
		
		v.setRotacion(0, 1, 0, Math.PI);
		
		v.setColor(40, 3, 3);

		return v;
	}

	#crear_piso() {
		let geom = generar_plano(this.config.ancho+.5, this.config.largo+.5, 2, 2);	
		
		
		let p = new Objeto();
		p.setGeometria(geom);
		p.setTextureBuffer(geom.uvBuffer);

		p.setColor(56, 7, 7);

		return p		
	}
	
	#crear_muro() {
		let h = this.config.altoBalcon;
		let a = this.config.altoMuro;
		let lados = this.config.lados;

		let puntos = [
		[0, 0, 0], [.06*6, .3*a, 0], [.2*6, .6*a, 0], [.2*6, a, 0], 
		[.2*6, a, 0], [.2*6, a, 0], [.2*6, a+h, 0], [.2*6, a+h, 0],
		[.2*6, a+h, 0], [.2*6, a+h, 0], [.2*6+.2, a+h, 0], [.2*6+.2, a+h, 0],
		[.2*6+.2, a+h, 0], [.2*6+.2, a+h, 0], [.2*6+.2, a, 0], [.2*6+.2, a, 0],
		[.2*6+.2, a, 0], [.2*6+.2, a, 0], [.7*6+.2, a, 0], [.7*6+.2, a, 0],
		[.7*6+.2, a, 0], [.7*6+.2, a, 0], [.7*6+.2, a+h, 0], [.7*6+.2, a+h, 0],
		[.7*6+.2, a+h, 0], [.7*6+.2, a+h, 0], [.7*6+.4, a+h, 0], [.7*6+.4, a+h, 0],
		[.7*6+.4, a+h, 0], [.7*6+.4, a+h, 0], [.7*6+.4, a, 0], [.7*6+.4, a, 0],
		[.7*6+.4, a, 0], [.7*6+.4, .6*a, 0], [.56*6+.4, .3*a, 0], [.5*6+.4, 0, 0],	
		];
		
		let shape = shape_cubica(puntos, 20);
		let path = path_circle(30, lados);

		mat4.getTranslation(this.posTorreA, path.matricesPuntos[path.matricesPuntos.length-1]);
		mat4.getTranslation(this.posTorreB, path.matricesPuntos[path.matricesPuntos.length-2]);

		path.matricesNormales.pop();
		path.matricesPuntos.pop();
		let geom = generar_superficie_barrido(path, shape, false, 4, lados*2);


		let m = new Objeto()
		
		m.setGeometria(geom);
		m.setTextureBuffer(geom.uvBuffer);

		m.crearTextura("res/wall.png", "uDiffTex");
		m.crearTextura("res/wall-nml.png", "uNormalTex");
		m.usarNormalMap = true;

		return m;			
	}
	
	#crear_torre_muralla() {
		let r = this.config.rTorreM;
		let h = this.config.altoBalcon;
		let a = this.config.altoTorreM;

		let puntos = [
			[-r, 0, 0], [-r, a/2, 0], [-.65*r, a/3, 0], [-.65*r, a, 0],
			[-.65*r, a, 0], [-.65*r, a, 0], [-.8*r, a, 0], [-.8*r, a+h*2, 0]
		];
	
		let c1 = shape_line([-.8*r, a+h*2, 0], [-.8*r, a+h*2+h, 0], 2);
		
		let c2 = shape_line([-.8*r, a+h*2+h, 0], [-.7*r, a+h*2+h, 0], 2);
		let c3 = shape_line([-.7*r, a+h*2+h, 0], [-.7*r, a+h*2, 0], 2);
		let c4 = shape_line([-.7*r, a+h*2, 0], [0, a+h*2, 0], 2);
	
		let shape = shape_cubica(puntos, 50);
		shape = concatenar(shape, c1);
		shape = concatenar(shape, c2);
		shape = concatenar(shape, c3);
		shape = concatenar(shape, c4);
	
		let path = path_circle(0.001, 15);
		let geom = generar_superficie_barrido(path, shape, false, 3, 2);
		

		let t = new Objeto();
		t.setGeometria(geom);
		t.setTextureBuffer(geom.uvBuffer);		
		
		t.crearTextura("res/wall.png", "uDiffTex");
		t.crearTextura("res/wall-nml.png", "uNormalTex");
		t.usarNormalMap = true;

		return t;
	}
	#crear_muro2() {
		let h = this.config.altoBalcon;
		let a = this.config.altoMuro;

		let puntos = [
		[0, 0, 0], [.06*6, .3*a, 0], [.2*6, .6*a, 0], [.2*6, a, 0], 
		[.2*6, a, 0], [.2*6, a, 0], [.2*6, a+h, 0], [.2*6, a+h, 0],
		[.2*6, a+h, 0], [.2*6, a+h, 0], [.2*6+.2, a+h, 0], [.2*6+.2, a+h, 0],
		[.2*6+.2, a+h, 0], [.2*6+.2, a+h, 0], [.2*6+.2, a, 0], [.2*6+.2, a, 0],
		[.2*6+.2, a, 0], [.2*6+.2, a, 0], [.7*6+.2, a, 0], [.7*6+.2, a, 0],
		[.7*6+.2, a, 0], [.7*6+.2, a, 0], [.7*6+.2, a+h, 0], [.7*6+.2, a+h, 0],
		[.7*6+.2, a+h, 0], [.7*6+.2, a+h, 0], [.7*6+.4, a+h, 0], [.7*6+.4, a+h, 0],
		[.7*6+.4, a+h, 0], [.7*6+.4, a+h, 0], [.7*6+.4, a, 0], [.7*6+.4, a, 0],
		[.7*6+.4, a, 0], [.7*6+.4, .6*a, 0], [.56*6+.4, .3*a, 0], [.5*6+.4, 0, 0],	
		];

		let puntos2 = [
		[.2*6, a, 0], [.2*6, a, 0], [.2*6, a+h, 0], [.2*6, a+h, 0],
		[.2*6, a+h, 0], [.2*6, a+h, 0], [.2*6+.2, a+h, 0], [.2*6+.2, a+h, 0],
		[.2*6+.2, a+h, 0], [.2*6+.2, a+h, 0], [.2*6+.2, a, 0], [.2*6+.2, a, 0],
		[.2*6+.2, a, 0], [.2*6+.2, a, 0], [.7*6+.2, a, 0], [.7*6+.2, a, 0],
		[.7*6+.2, a, 0], [.7*6+.2, a, 0], [.7*6+.2, a+h, 0], [.7*6+.2, a+h, 0],
		[.7*6+.2, a+h, 0], [.7*6+.2, a+h, 0], [.7*6+.4, a+h, 0], [.7*6+.4, a+h, 0],
		[.7*6+.4, a+h, 0], [.7*6+.4, a+h, 0], [.7*6+.4, a, 0], [.7*6+.4, a, 0],
		];

		let shape = shape_cubica(puntos, 10);
		let shape2 = shape_cubica(puntos2, 10);
	
		let p0 = this.posTorreA;
		
		let p1 = vec3.create();
		vec3.scaleAndAdd(p1, this.posTorreA, this.dir, (this.len - this.config.largoPuerta) / 2);

		let p2 = vec3.create();
		vec3.scaleAndAdd(p2, this.posTorreB, this.dir, -(this.len - this.config.largoPuerta) / 2);		

		let p3 = this.posTorreB;

		let path1 = path_3Dline(p1, p0, 1);
		let path2 = path_3Dline(p2, p1, 1);
		let path3 = path_3Dline(p3, p2, 1);
		let geom = generar_superficie_barrido(path1, shape);
		
		
		let m1 = new Objeto()
		
		m1.setGeometria(geom, this.tanBuffer, this.binBuffer);
		m1.setTextureBuffer(geom.uvBuffer);

		m1.crearTextura("res/wall.png", "uDiffTex");
		m1.crearTextura("res/wall-nml.png", "uNormalTex");
		m1.usarNormalMap = true;


		geom = generar_superficie_barrido(path2, shape2);
		let m2 = new Objeto()
		
		m2.setGeometria(geom, this.tanBuffer, this.binBuffer);
		m2.setTextureBuffer(geom.uvBuffer);

		m2.crearTextura("res/wall.png", "uDiffTex");
		m2.crearTextura("res/wall-nml.png", "uNormalTex");
		m2.usarNormalMap = true;


		geom = generar_superficie_barrido(path3, shape);
		let m3 = new Objeto()
		
		m3.setGeometria(geom, this.tanBuffer, this.binBuffer);
		m3.setTextureBuffer(geom.uvBuffer);

		m3.crearTextura("res/wall.png", "uDiffTex");
		m3.crearTextura("res/wall-nml.png", "uNormalTex");
		m3.usarNormalMap = true;

		return {m1, m2, m3};			
	}

	#crear_marco() {
		let w = 5;
		let a = this.config.altoMuro*1.2;
		let lados = this.config.lados;

		let r1 = shape_line([0 , 0, 0], [0, a, 0], 2);
		let r2 = shape_line([0, a, 0], [w, a, 0], 2);
		let r3 = shape_line([w, a, 0], [w, 0, 0], 2);


		let shape = concatenar(r1, r2);
		shape = concatenar(shape, r3);

	
		let p1 = vec3.create();
		vec3.scaleAndAdd(p1, this.posTorreA, this.dir, (this.len - this.config.largoPuerta) / 2);

		let p0 = vec3.create();
		vec3.scaleAndAdd(p0, p1, this.dir, -this.config.largoPuerta/2);	
		
		let p2 = vec3.create();
		vec3.scaleAndAdd(p2, this.posTorreB, this.dir, -(this.len - this.config.largoPuerta) / 2);		

		let p3 = vec3.create();
		vec3.scaleAndAdd(p3, p2, this.dir, this.config.largoPuerta / 2);	

		let path1 = path_3Dline(p1, p0, 1);
		let path2 = path_3Dline(p3, p2, 1);
		let geom = generar_superficie_barrido(path1, shape, true, 2, .5);


		let m1 = new Objeto()
		
		m1.setGeometria(geom, this.tanBuffer, this.binBuffer);
		m1.setTextureBuffer(geom.uvBuffer);

		m1.crearTextura("res/wall.png", "uDiffTex");
		m1.crearTextura("res/wall-nml.png", "uNormalTex");
		m1.usarNormalMap = true;


		geom = generar_superficie_barrido(path2, shape, true, 2, .5);
		let m2 = new Objeto()
		
		m2.setGeometria(geom, this.tanBuffer, this.binBuffer);
		m2.setTextureBuffer(geom.uvBuffer);

		m2.crearTextura("res/wall.png", "uDiffTex");
		m2.crearTextura("res/wall-nml.png", "uNormalTex");
		m2.usarNormalMap = true;

		return {m1, m2};	
	}

	#crear_puerta() {
		let w = .1;
		let a = this.config.altoMuro*1;

		let r1 = shape_line([0 , 0, 0], [0, a, 0], 2);
		let r2 = shape_line([0, a, 0], [w, a, 0], 2);
		let r3 = shape_line([w, a, 0], [w, 0, 0], 2);

		let shape = concatenar(r1, r2);
		shape = concatenar(shape, r3);
	
		let p1 = vec3.create();
		vec3.scaleAndAdd(p1, this.posTorreA, this.dir, (this.len - this.config.largoPuerta) / 2- 1);
	
		let p2 = vec3.create();
		vec3.scaleAndAdd(p2, this.posTorreB, this.dir, -(this.len - this.config.largoPuerta) / 2 + 1);		
	

		let path1 = path_3Dline(p2, p1, 1);

		let p = new Objeto()
		p.setPosicion(-1.5, 0, 1);

		let geom = generar_superficie_barrido(path1, shape, false, 2, 2);
		p.setGeometria(geom);
		p.crearTextura("res/gate.png", "uDiffTex");
		p.crearTextura("res/gate-nml.png", "uNormalTex");
		p.usarNormalMap = true;

		p.setTextureBuffer(geom.uvBuffer);

		return p;	
	}

	#crear_antorchas() {
		let p1 = vec3.create();
		vec3.scaleAndAdd(p1, this.posTorreA, this.dir, (this.len - this.config.largoPuerta) / 2- 1);
	
		let p2 = vec3.create();
		vec3.scaleAndAdd(p2, this.posTorreB, this.dir, -(this.len - this.config.largoPuerta) / 2 + 1);	

		let geom = generar_esfera();
		let e = new Objeto();
		e.setGeometria(geom);
		e.setPosicion(p1[0] + .3, p1[1] + 2, p1[2]);
		e.setColor(50, 50, 50);
		e.setTextureBuffer(geom.uvBuffer)
		e.setEscala(.2, .2, .2);

		let e1 = new Objeto();
		e1.setGeometria(geom);
		e1.setPosicion(p2[0] + .3, p2[1] + 2, p2[2]);
		e1.setColor(50, 50, 50);
		e1.setTextureBuffer(geom.uvBuffer)
		e1.setEscala(.2, .2, .2);

		return {e, e1};		
	}


	get_antorcha_pos(){
		let pos1 = vec3.create();
		let pos2 = vec3.create();

		vec3.transformMat4(pos1, pos1, this.ant.e.wpos);
		vec3.transformMat4(pos2, pos2, this.ant.e1.wpos);

		return {pos1, pos2};
	}
}