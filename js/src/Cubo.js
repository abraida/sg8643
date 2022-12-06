class Cubo {
	constructor(){
		this.vertexBuffer = null;
		this.Program = null;
		this.m = null;
	}

	generarCubo(){
		var pos = [
		-1, -1, 
		1, -1, 
		-1,  1, 
		-1,  1,
		1, -1,
		1,  1,
		];

		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

	}

	generarTextura(srcs) {
		let t = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, t);
	  
		
		for (let i = 0; i < srcs.length; i++) {
			let image = new Image();
			image.src = srcs[i];
			
			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			image.onload = function () {
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, t);

				gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
				gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

			}
		}
	
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
	
		this.cubeMap = t;
	
	}

	dibujar() {
		gl.useProgram(this.Program);
		gl.depthFunc(gl.LEQUAL);

		var vMatrix = gl.getUniformLocation(this.Program, "viewDirectionProjectionInverseMatrix");
		gl.uniformMatrix4fv(vMatrix, false, this.m);

		var uBool = gl.getUniformLocation(this.Program, "esCubeMap");
		gl.uniform1f(uBool, true);

		gl.activeTexture(gl.TEXTURE0 + 5);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMap);
		
		var textureLocation = gl.getUniformLocation(this.Program, "uCubeTex");
		gl.uniform1i(textureLocation, 5);

		let vertexPositionAttribute = gl.getAttribLocation(this.Program, "aVertexPosition");
		
		gl.enableVertexAttribArray(vertexPositionAttribute);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
		
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	setProgram(p){
		this.Program = p;
	}
}

