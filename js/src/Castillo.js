let altoPiso = 4;

class Castillo extends Objeto{
	constructor(ancho, largo, pisos, lados, altoMuro) {
		super();

		let altoPiso = 4;
		let rTorre = 1.5;
		let altoTorre = (pisos - 1) * altoPiso;

		let deltaVentanas = 3;
		let anchoVentanas = 1;
		let nVentanasH = (ancho-2*rTorre-deltaVentanas) / (deltaVentanas + anchoVentanas);
		let nVentanasV = (largo-2*rTorre-deltaVentanas) / (deltaVentanas + anchoVentanas);

		let rTorreM = 4;
		let altoBalcon = 1;
		let altoTorreM = altoMuro*1.5 - altoBalcon;
		
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
			altoTorreM: altoTorreM
		}

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

		let paredSur = this.#crear_pared(ancho);

		this.edificio.agregarHijo(paredSur);

		let paredEste = this.#crear_pared(largo);
		paredEste.setPosicion(ancho, 0, 0);
		paredEste.setRotacion(0, 1, 0, Math.PI/2);
		this.edificio.agregarHijo(paredEste);

		let paredNorte = this.#crear_pared(ancho);
		paredNorte.setPosicion(ancho, 0, -largo);
		paredNorte.setRotacion(0, 1, 0, Math.PI);
		this.edificio.agregarHijo(paredNorte);
		
		let paredOeste = this.#crear_pared(largo);
		paredOeste.setPosicion(0, 0, -largo);
		paredOeste.setRotacion(0, 1, 0, -Math.PI/2);
		this.edificio.agregarHijo(paredOeste);

		// Ventanas

		for (let j = 0; j < pisos; j++) {
			let p0 = rTorre + deltaVentanas;
			let px = deltaVentanas + anchoVentanas;
			for (let i = 0; i < nVentanasH; i++) {
				let v = this.#crear_ventana();
				v.setPosicion(p0+i*px, altoPiso * (j+.4), -.5);
				paredSur.agregarHijo(v);
			}

			for (let i = 0; i < nVentanasH; i++) {
				let v = this.#crear_ventana();

				v.setPosicion(p0+i*px, altoPiso * (j+.4), -.5);
				paredNorte.agregarHijo(v);
			}

			for (let i = 0; i < nVentanasV; i++) {
				let v = this.#crear_ventana();

				v.setPosicion(p0+i*px, altoPiso * (j+.4), -.5);
				paredEste.agregarHijo(v);
			}

			for (let i = 0; i < nVentanasV; i++) {
				let v = this.#crear_ventana();

				v.setPosicion(p0+i*px, altoPiso * (j+.4), -.5);
				paredOeste.agregarHijo(v);
			}
		}

		// Pisos

		for (let i = 1; i <= pisos; i++) {
			let p = this.#crear_piso();
			p.setPosicion(-.25, altoPiso*i, -largo-.25);
			p.setRotacion(1, 0, 0, Math.PI/2);			
			
			this.edificio.agregarHijo(p);
		}
		
		// Muro

		let muro = this.#crear_muro();
		this.muralla.agregarHijo(muro);

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

		// Marco de la puerta

		let ma = this.#crear_marco();
		this.muralla.agregarHijo(ma.m1);
		this.muralla.agregarHijo(ma.m2);

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
		let geom = generar_superficie_barrido(path, shape);
		
		let t = new Objeto();
		t.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		t.crearTextura("../res/castle.png", "uZincTex");
		t.setTextureBuffer(geom.uvBuffer);

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
		p.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		

		return p;
	}
	
	#crear_pared(w) {
		let p = new Objeto();
		let geom = generar_plano(w, this.config.altoPiso * this.config.pisos); 
		p.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		p.crearTextura("../res/castle.png", "uZincTex");
		p.setTextureBuffer(geom.uvBuffer);
		return p;
	}
	#crear_ventana() {
		let w = this.config.anchoVentanas;

		let puntos = [[0, 0, 0], [0, 1.5, 0], [w, 1.5, 0], [w, 0, 0], 
		[w, 0, 0], [w, 0, 0], [0, 0, 0], [0, 0, 0]];
		
		let shape = shape_cubica(puntos, 6);
		let path = path_line(2, 1.2);
	
		let geom = generar_superficie_barrido(path, shape, true);
		let v = new Objeto();
		v.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);

		return v;
	}

	#crear_piso() {
		let p = new Objeto();

		let geom = generar_plano(this.config.ancho+.5, this.config.largo+.5);	
		p.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
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
		path.matricesNormales.pop();
		path.matricesPuntos.pop();

		let m = new Objeto()
		let geom = generar_superficie_barrido(path, shape, false, 30, 60);
		m.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		m.crearTextura("../res/wall.png", "uZincTex");
		m.setTextureBuffer(geom.uvBuffer);

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
	
		let geom = generar_superficie_barrido(path, shape);
		let t = new Objeto();
		t.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		
		return t;
	}
	#crear_muro2() {
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
	
		let circulo = path_circle(30, lados);
		let p0 = vec3.create();
		let p3 = vec3.create();
	
		mat4.getTranslation(p0, circulo.matricesPuntos[circulo.matricesPuntos.length-2]);
		mat4.getTranslation(p3, circulo.matricesPuntos[circulo.matricesPuntos.length-1]);
	
		let path = path_3Dline(p0, p3, 10);
	
		let path1 = {
			matricesPuntos: path.matricesPuntos.slice(0,4),
			matricesNormales: path.matricesNormales.slice(0,4)
		}
	
		let path2 = {
			matricesPuntos: path.matricesPuntos.slice(7,10),
			matricesNormales: path.matricesNormales.slice(7,10)
		}	
	
		let m1 = new Objeto()
		let geom = generar_superficie_barrido(path1, shape);
		m1.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
	
		let m2 = new Objeto()
		geom = generar_superficie_barrido(path2, shape);
		m2.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		
		return {m1, m2};			
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

		let circulo = path_circle(30, lados);
		let p0 = vec3.create();
		let p1 = vec3.create();
	
		mat4.getTranslation(p0, circulo.matricesPuntos[circulo.matricesPuntos.length-2]);
		mat4.getTranslation(p1, circulo.matricesPuntos[circulo.matricesPuntos.length-1]);
	
		let path = path_3Dline(p0, p1, 19);

		let path1 = {
			matricesPuntos: path.matricesPuntos.slice(5,7),
			matricesNormales: path.matricesNormales.slice(5,7)
		}
	
		let path2 = {
			matricesPuntos: path.matricesPuntos.slice(13,15).reverse(),
			matricesNormales: path.matricesNormales.slice(13,15).reverse()
		}	
	
		let m1 = new Objeto()
		let geom = generar_superficie_barrido(path1, shape, true);
		m1.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
	
		let m2 = new Objeto()
		geom = generar_superficie_barrido(path2, shape, true);
		m2.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		
		return {m1, m2};	
	}
}