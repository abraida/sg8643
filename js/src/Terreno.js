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
		
		let geom = generar_superficie_barrido(path, shape);

		isla.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		this.agregarHijo(isla);
		
		
		let tierra = new Objeto();

		shape.puntos = [[-rAMundo,-5,0], [-rAMundo, 0,0], [-rMundo, 0, 0], [0, -100, 0]];
		shape.normales = [[1, 0, 0], [0, 1, 0], [0, 1, 0], [-1, 0, 0]];

		path = path_circle(0.01, 10);

		geom = generar_superficie_barrido(path, shape);
		
		tierra.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		this.agregarHijo(tierra);

		
		let plano = new Objeto();
		geom = generar_plano(rMundo+20, rMundo+20);
		plano.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
		plano.setRotacion(1, 0, 0, Math.PI/2);
		plano.setPosicion(-(rMundo+20)/2, -3, -(rMundo+20)/2);
		this.agregarHijo(plano);	
	}
}

