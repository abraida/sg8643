class Terreno extends Objeto {
	constructor () {
		super();
		let rIsla = 40;
		let lFosa = 20;
		let rAMundo = lFosa + rIsla;
		let rMundo = 120;
	
		let isla = new Objeto();
		let shape = new Object();
		
		shape.puntos = [[0,0,0], [rIsla, 0, 0], [rIsla, -5, 0]]
		shape.normales = [[0, 1, 0], [0, 1, 0], [1, 0, 0]];
		let path = path_circle(0.01, 10);
		
		let geom = generar_superficie_barrido(path, shape, false, 1, 3);


		isla.setGeometria(geom);
		isla.crearTextura("res/ground.png", "uDiffTex");
		isla.crearTextura("res/ground-nml.png", "uNormalTex");
		isla.usarNormalMap = true;

		isla.setTextureBuffer(geom.uvBuffer);
		this.agregarHijo(isla);
		
		
		
		shape.puntos = [[-rAMundo,-5,0], [-rAMundo, 0,0], [-rMundo, 0, 0], [0, -100, 0]];
		shape.normales = [[1, 0, 0], [0, 1, 0], [0, 1, 0], [-1, 0, 0]];
		path = path_circle(0.01, 10);
		geom = generar_superficie_barrido(path, shape, false, 6, 15);
		

		let tierra = new Objeto();

		
		tierra.setGeometria(geom);
		tierra.setTextureBuffer(geom.uvBuffer);

		tierra.crearTextura("res/lava.png", "uDiffTex");
		tierra.crearTextura("res/lava-nml.png", "uNormalTex");
		tierra.crearTextura("res/lava-emissive.png", "uEmissiveTex");
		tierra.usarNormalMap = true;
		tierra.usarEmissiveMap = true;

		this.agregarHijo(tierra);

		
		let plano = new Objeto();
		geom = generar_plano(rMundo+20, rMundo+20, 5, 5);

		plano.crearTextura("res/lava2.png", "uDiffTex");
		plano.crearTextura("res/lava2-nml.png", "uNormalTex");
		plano.crearTextura("res/lava2-emissive.png", "uEmissiveTex");
		plano.usarNormalMap = true;
		plano.usarEmissiveMap = true;


		plano.setGeometria(geom);
		plano.setTextureBuffer(geom.uvBuffer);
		plano.setRotacion(1, 0, 0, Math.PI/2);
		plano.setPosicion(-(rMundo+20)/2, -1.5, -(rMundo+20)/2);

		this.agregarHijo(plano);	
		
		this.tierra = tierra;
		this.plano = plano;
	}

	apagarLava() {
		this.tierra.usarEmissiveMap = false;
		this.plano.usarEmissiveMap = false;
	}
}

