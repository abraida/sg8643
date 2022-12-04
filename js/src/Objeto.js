
class Objeto {
	constructor() {
		this.Program = null;
		
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.normalBuffer = null;

		this.textureBuffer = null;

		this.matriz_modelado = mat4.create();
		this.matriz_normales = mat4.create();
		
		this.posicion = vec3.fromValues(0, 0, 0);
		this.rotacion = mat4.create();
		this.escala = vec3.fromValues(1, 1, 1);
		this.alpha = 0;


		this.texture = null;
		this.texName = null;
		this.color = [100, 100, 100];
		
		this.hijos = [];

		this.wpos = vec3.fromValues(0, 0, 0);
	}

	setColor(r, g, b){
		this.color = [r, g, b];
	}

	setTextureBuffer(buffer) {
		this.textureBuffer = buffer;
	}

	crearTextura(src, name) {
		let t = gl.createTexture();
		t.image = new Image();
		t.image.src = src;

		t.image.onload = function () {
			gl.bindTexture(gl.TEXTURE_2D, t);
			gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.MIRRORED_REPEAT); 
			gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.MIRRORED_REPEAT);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);

		}

		this.texture = t;
		this.texName = name;
	}

	actualizarMatrizModelado() { 
		this.matriz_modelado = mat4.create();

		if(this.posicion)
			mat4.translate(this.matriz_modelado, this.matriz_modelado, this.posicion);    
		if (this.rotacion)
			mat4.multiply(
			this.matriz_modelado,
			this.matriz_modelado,
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
		this.wpos = m;
		var modelMatrixUniform = gl.getUniformLocation(this.Program, "modelMatrix");
		gl.uniformMatrix4fv(modelMatrixUniform, false, m);

		var normalMatrixUniform  = gl.getUniformLocation(this.Program, "normalMatrix");

		mat4.invert(this.matriz_normales, this.matriz_modelado);
		mat4.transpose(this.matriz_normales, this.matriz_normales); 
	
		gl.uniformMatrix4fv(normalMatrixUniform, false, this.matriz_normales);

		if(!this.texture) {
			this.texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
 
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE,
			new Uint8Array([
				this.color[0], 
				this.color[1], 
				this.color[2]]));	
		}

		if (this.textureBuffer) {
			var uTextBool = gl.getUniformLocation(this.Program, "usarTextura");
            		gl.uniform1i(uTextBool, true);

			vertexTextureAttribute = gl.getAttribLocation(this.Program, "aTextureCoord");
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
			
			gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);
			
			gl.enableVertexAttribArray(vertexTextureAttribute);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);

			var uSampler = gl.getUniformLocation(this.Program, this.texName);

			gl.uniform1i(uSampler, 0);
		} else {
			var uTextBool = gl.getUniformLocation(this.Program, "usarTextura");
            		gl.uniform1i(uTextBool, false);
		}

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
		let i = this.hijos.indexOf(h);
		if(i > 0)
			this.hijos.splice(i, 1);
	};

	setPosicion(x, y, z) { 
		this.posicion[0] = x;
		this.posicion[1] = y;
		this.posicion[2] = z;

	};
	setRotacion(x, y, z, a) {
		mat4.fromRotation(this.rotacion, a, vec3.fromValues(x, y, z))
	};

	rotate(x,y,z,a) {
		mat4.rotate(this.rotacion, this.rotacion, a, vec3.fromValues(x, y, z))

	}
	setEscala(x, y, z) { 
		this.escala[0] = x;
		this.escala[1] = y;
		this.escala[2] = z;
	};

} 

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}
