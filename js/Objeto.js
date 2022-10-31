class Objeto {
	constructor() {
		this.Program = null;
		
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.normalBuffer = null;


		this.matriz_modelado = mat4.create();
		this.matriz_normales = mat4.create();
		
		this.posicion = vec3.fromValues(0, 0, 0);
		this.rotacion = vec3.fromValues(0, 0, 0);
		this.escala = vec3.fromValues(1, 1, 1);
		this.alpha = 0;
		
		this.hijos = [];
	}

	actualizarMatrizModelado() { 
		if(this.posicion)
			mat4.translate(this.matriz_modelado, this.matriz_modelado, this.posicion);    
		if (this.rotacion)
			mat4.rotate(
			this.matriz_modelado,
			this.matriz_modelado,
			this.alpha,
			this.rotacion
		);
		if(this.escala)
			mat4.scale(this.matriz_modelado, this.matriz_modelado, this.escala);
	};


	setProgram(program) {
		this.Program=program;
		for (let i = 0; i < this.hijos.length;i++)
			this.hijos[i].setProgram(program);
		
	}

	dibujar(matPadre) {
		gl.useProgram(this.Program);

		let m = mat4.create();
		this.actualizarMatrizModelado();
		
		mat4.multiply(m, matPadre, this.matriz_modelado);

		var modelMatrixUniform = gl.getUniformLocation(this.Program, "modelMatrix");
		gl.uniformMatrix4fv(modelMatrixUniform, false, m);

		var normalMatrixUniform  = gl.getUniformLocation(this.Program, "normalMatrix");

		mat4.invert(this.matriz_normales, this.matriz_modelado);
		mat4.transpose(this.matriz_normales, this.matriz_normales); 
	
		gl.uniformMatrix4fv(normalMatrixUniform, false, this.matriz_normales);

		if (this.vertexBuffer && this.indexBuffer && this.normalBuffer){

			vertexPositionAttribute = gl.getAttribLocation(this.Program, "aVertexPosition");
			gl.enableVertexAttribArray(vertexPositionAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);


			vertexNormalAttribute = gl.getAttribLocation(this.Program, "aVertexNormal");
			gl.enableVertexAttribArray(vertexNormalAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
			gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);


			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			gl.drawElements( gl.TRIANGLES, this.indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
		}
		
		this.posicion = vec3.fromValues(0, 0, 0);
		this.rotacion = vec3.fromValues(0, 0, 0);
		this.escala = vec3.fromValues(1, 1, 1);

		for (let i = 0; i < this.hijos.length; i++) 
			this.hijos[i].dibujar(m);
	};

	setGeometria(vertexBuffer, indexBuffer, normalBuffer) {
		this.vertexBuffer = vertexBuffer;
		this.indexBuffer = indexBuffer;
		this.normalBuffer = normalBuffer;

	}

	agregarHijo(h) { 
		this.hijos.push(h);
	};

	quitarHijo(h) {
		this.hijos.splice(hijos.indexOf(h));
	};

	setPosicion(x, y, z) { 
		this.posicion[0] = x;
		this.posicion[1] = y;
		this.posicion[2] = z;

	};
	setRotacion(x, y, z, a) {
		this.alpha = a;
		this.rotacion[0] = x;
		this.rotacion[1] = y;
		this.rotacion[2] = z;
	};
	setEscala(x, y, z) { 
		this.escala[0] = x;
		this.escala[1] = y;
		this.escala[2] = z;
	};
} 