function crear_isla() {
	let shape = new Object();

	shape.puntos = [[0,0,0], [40, 0, 0], [40, -5, 0]]
	shape.normales = [[0, 1, 0], [0, 1, 0], [1, 0, 0]];

	path = path_circle(0.01, 10);
	
	return  generar_superficie_barrido(path, shape);
	

}
function crear_terreno() {
	let contenedor = new Objeto();
		
	shape.puntos = [[-60,-5,0], [-60, 0,0], [-120, 0, 0], [0, -100, 0]];
	shape.normales = [[1, 0, 0], [0, 1, 0], [0, 1, 0], [-1, 0, 0]];

	let path = path_circle(0.01, 10);

	
	let geomTer = generar_superficie_barrido(path, shape);
	
	let terreno = new Objeto();
	terreno.setGeometria(geomTer.vertexBuffer, geomTer.indexBuffer, geomTer.normalBuffer);
	contenedor.agregarHijo(terreno);

	let isla = new Objeto();
	let geomIsla = crear_isla();

	isla.setGeometria(geomIsla.vertexBuffer, geomIsla.indexBuffer, geomIsla.normalBuffer);
	contenedor.agregarHijo(isla);
	
	let plano = new Objeto();
	let geomPlano = generar_plano(140, 140);
	plano.setGeometria(geomPlano.vertexBuffer, geomPlano.indexBuffer, geomPlano.normalBuffer);
	plano.setRotacion(1, 0, 0, Math.PI/2);
	plano.setPosicion(-70, -3, -70);
	contenedor.agregarHijo(plano);	

	return contenedor;
}