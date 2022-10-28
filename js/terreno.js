function crear_terreno() {	
	let shape = dibujarRecta([-15, 0, 0], [-50, 0, 0], 2);
	let path = dibujarCircunferencia(0.001, 8);

	let geomTer = generarSuperficieParametrica(path, shape);

	let terreno = new Objeto();
	terreno.setGeometria(geomTer.webgl_position_buffer, geomTer.webgl_index_buffer, geomTer.webgl_normal_buffer);
	
	return terreno;
}