function crear_isla() {
	let shape = new Object();

	shape.puntos = [[0,0,0], [40, 0, 0], [40, -5, 0]]
	shape.normales = [[0, 0, 1], [0, 0, 1], [0, 0, 1]];

	path = dibujarCircunferencia(0.01, 10);
	
	return  generarSuperficieParametrica(path, shape);
	

}
function crear_terreno() {
	let contenedor = new Objeto();
		
	shape.puntos = [[-60,-5,0], [-60, 0,0], [-120, 0, 0]];
	shape.normales = [[0, 0, 1], [0, 0, 1], [0, 0, 1]];

	path = dibujarCircunferencia(0.01, 10);

	
	let geomTer = generarSuperficieParametrica(path, shape);
	
	let terreno = new Objeto();
	terreno.setGeometria(geomTer.webgl_position_buffer, geomTer.webgl_index_buffer, geomTer.webgl_normal_buffer);
	contenedor.agregarHijo(terreno);

	let isla = new Objeto();
	let geomIsla = crear_isla();

	isla.setGeometria(geomIsla.webgl_position_buffer, geomIsla.webgl_index_buffer, geomIsla.webgl_normal_buffer);
	contenedor.agregarHijo(isla);
	
	let plano = new Objeto();
	let geomPlano = generarPlano(160, 160);
	plano.setGeometria(geomPlano.webgl_position_buffer, geomPlano.webgl_index_buffer, geomPlano.webgl_normal_buffer);
	plano.setRotacion(1, 0, 0, Math.PI/2);
	plano.setPosicion(-80, -5, -80);
	contenedor.agregarHijo(plano);	

	return contenedor;
}