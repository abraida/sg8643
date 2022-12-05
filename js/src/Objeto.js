
class Objeto {
	constructor() {
		this.Program = null;
		
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.normalBuffer = null;
		this.tanBuffer = null;
		this.binBuffer = null;


		this.textureBuffer = null;

		this.matriz_modelado = mat4.create();
		this.matriz_normales = mat4.create();
		
		this.posicion = vec3.fromValues(0, 0, 0);
		this.rotacion = mat4.create();
		this.escala = vec3.fromValues(1, 1, 1);
		this.alpha = 0;

		this.usarNormalMap = false;
		this.usarEmissiveMap = false;

		this.shininess = 5;

		this.textures = [];
		this.texNames = [];
		this.color = [100, 100, 100];
		
		this.hijos = [];

		this.wpos = vec3.fromValues(0, 0, 0);
	}

	setColor(r, g, b, a){
		if(!a)
			a = 0;
		this.color = [r, g, b, a];
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
			gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT); 
			gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);

		}

		this.textures.push(t);
		this.texNames.push(name);
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

	setUniforms() {
		var uBool = gl.getUniformLocation(this.Program, "usarTextura");
		gl.uniform1i(uBool, Boolean(this.textureBuffer));

		if(usarMapaNormales){
			uBool = gl.getUniformLocation(this.Program, "usarNormalMap");
			gl.uniform1i(uBool, this.usarNormalMap);
		}

		uBool = gl.getUniformLocation(this.Program, "usarEmissiveMap");
		gl.uniform1i(uBool, this.usarEmissiveMap);

		uBool = gl.getUniformLocation(this.Program, "difuminarTerreno");
		gl.uniform1i(uBool, this.difuminarTerreno);

		var uS = gl.getUniformLocation(this.Program, "shininess");
		gl.uniform1f(uS, this.shininess);
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

		mat4.invert(this.matriz_normales, m);
		mat4.transpose(this.matriz_normales, this.matriz_normales); 
	
		gl.uniformMatrix4fv(normalMatrixUniform, false, this.matriz_normales);


		this.setUniforms();

		if(this.textures.length == 0) {
			let t = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, t);
 
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
			new Uint8Array([
				this.color[0], 
				this.color[1], 
				this.color[2],
				this.color[3]
			]));	
			this.textures.push(t);
			this.texNames.push("uDiffTex");

		}

		if (this.textureBuffer) {
			vertexTextureAttribute = gl.getAttribLocation(this.Program, "aTextureCoord");
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
			
			gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);
			
			gl.enableVertexAttribArray(vertexTextureAttribute);
			
			for (let i = 0; i < this.textures.length; i++){

				gl.activeTexture(gl.TEXTURE0 + i);
				gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
	
				var uSampler = gl.getUniformLocation(this.Program, this.texNames[i]);
	
				gl.uniform1i(uSampler, i);

			}
		}

		if(this.tanBuffer && this.binBuffer) {
			let vertexTanAttribute = gl.getAttribLocation(this.Program, "aVertexTan");
			gl.enableVertexAttribArray(vertexTanAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.tanBuffer);
			gl.vertexAttribPointer(vertexTanAttribute, 3, gl.FLOAT, false, 0, 0);

			let vertexBinAttribute = gl.getAttribLocation(this.Program, "aVertexBin");
			gl.enableVertexAttribArray(vertexBinAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.binBuffer);
			gl.vertexAttribPointer(vertexBinAttribute, 3, gl.FLOAT, false, 0, 0);
		}

		if (this.vertexBuffer && this.indexBuffer && this.normalBuffer){

			let vertexPositionAttribute = gl.getAttribLocation(this.Program, "aVertexPosition");
			gl.enableVertexAttribArray(vertexPositionAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);


			let vertexNormalAttribute = gl.getAttribLocation(this.Program, "aVertexNormal");
			gl.enableVertexAttribArray(vertexNormalAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
			gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);


			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			gl.drawElements( gl.TRIANGLES, this.indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
		}



		
		for (let i = 0; i < this.hijos.length; i++) 
			this.hijos[i].dibujar(m);

	};

	setShininess(f) {
		this.shininess = f;
	}

	setGeometria(g) {
		if (!g) {
			this.vertexBuffer = null;
			this.indexBuffer = null;
			this.normalBuffer = null;
			this.tanBuffer = null;
			this.binBuffer = null;
			return;
		}
		this.vertexBuffer = g.vertexBuffer;
		this.indexBuffer = g.indexBuffer;
		this.normalBuffer = g.normalBuffer;

		if (g.tanBuffer)
			this.tanBuffer = g.tanBuffer;
		
		if (g.binBuffer)
			this.binBuffer = g.binBuffer;

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
