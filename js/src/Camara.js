class Camara{
	constructor(x, y, z, r){
        this.previousClientX = 0;
        this.previousClientY = 0;
        this.radio = r;
        this.alfa = -Math.PI/2;
        this.beta = Math.PI/4;
        this.factorVelocidad = 0.01;
        this.isMouseDown = false;
        this.mouse = {x: 0, y: 0};
        this.zoom = 1.0;
        this.obj = [x, y, z];

		this.pos = [this.radio * this.zoom * Math.sin(this.alfa) * Math.sin(this.beta), this.radio * this.zoom * Math.cos(this.beta) ,this.radio * this.zoom * Math.cos(this.alfa) * Math.sin(this.beta)];

        this.pos = [this.pos[0] + this.obj[0], this.pos[1] + this.obj[1], this.pos[2] + this.obj[2]];
	}

	rotar(){
		if (this.isMouseDown){
			var deltaX=0;
			var deltaY=0;

			if (this.previousClientX) deltaX = this.mouse.x - this.previousClientX;
			if (this.previousClientY) deltaY = this.mouse.y - this.previousClientY;
            
			this.previousClientX = this.mouse.x;
			this.previousClientY = this.mouse.y;

			this.alfa = this.alfa + deltaX * this.factorVelocidad;
			this.beta = this.beta + deltaY * this.factorVelocidad;

			if (this.beta<0.001) this.beta=0.001;
			if (this.beta>Math.PI/2-.1) this.beta=Math.PI/2-.1;
            console.log(this.beta);

			this.pos = [this.radio * this.zoom * Math.sin(this.alfa) * Math.sin(this.beta), this.radio * this.zoom * Math.cos(this.beta) ,this.radio * this.zoom * Math.cos(this.alfa) * Math.sin(this.beta)];

            this.pos = [this.pos[0] + this.obj[0], this.pos[1] + this.obj[1], this.pos[2] + this.obj[2]];

		}
	}

    disminuirZoom(zoom){
        if (this.zoom - zoom >= .1){
            this.zoom -= zoom;
            var mouse = this.isMouseDown;
            this.isMouseDown = true;
            this.rotar();
            this.isMouseDown = mouse;
        }
    }
    aumentarZoom(zoom){
        if (this.zoom + zoom <= 3){
            this.zoom += zoom;
            var mouse = this.isMouseDown;
            this.isMouseDown = true;
            this.rotar();
            this.isMouseDown = mouse;
        }
    }
    movimientoMouse(x,y){
            this.mouse.x = x;
            this.mouse.y = y;   
    }
    mouseDown(x, y){
        this.isMouseDown = true;
        this.previousClientX = x;
        this.previousClientY = y;

    }
    mouseUp(){
        this.isMouseDown = false;

	}    

    mover(){

    }
    rotarEje(){

    }

    obtenerTarget(){
        return this.obj;
    }
}

class CamaraFP extends Camara {
    constructor(x, y, z, r) {
        super(x, y, z, r);
        
        this.alfa = 0;
        this.beta = Math.PI/2;

        this.obj = this.pos;
        this.pos = [x, y, z];
        this.rotacionEje = .6;

        var m = mat4.create();
        mat4.fromRotation(m, this.rotacionEje, vec3.fromValues(0, 1, 0));

        this.adelante = vec3.fromValues(0,0,.2);
        this.derecha = vec3.fromValues(.2,0,0);
        
        vec3.transformMat4(this.adelante, this.adelante, m);
        vec3.transformMat4(this.derecha, this.derecha, m);
        
        this.entity = null;
        this.crearEje();

        this.mover(0, 0);
        this.rotarEje(0);
        
        this.obj = [this.radio * this.zoom * Math.sin(this.alfa) * Math.sin(this.beta), this.radio * this.zoom * Math.cos(this.beta) ,this.radio * this.zoom * Math.cos(this.alfa) * Math.sin(this.beta)];
        
    }

    mover(d, a){

        this.pos = [this.pos[0] + this.derecha[0] * d + this.adelante[0] * a, this.pos[1], this.pos[2] + this.derecha[2] * d + this.adelante[2] * a];

        this.center.setPosicion(
            this.pos[0], 
            this.pos[1]+.05, 
            this.pos[2]);
        
    

        this.rotar();
    }

    rotarEje(a){
        this.rotacionEje +=a;

        var m = mat4.create();
        mat4.fromRotation(m, this.rotacionEje, vec3.fromValues(0, 1, 0));
        this.center.setRotacion(0, 1, 0, this.rotacionEje - .45*Math.PI);

        this.adelante = vec3.fromValues(0,0,.2);
        this.derecha = vec3.fromValues(.2,0,0);

        vec3.transformMat4(this.adelante, this.adelante, m);
        vec3.transformMat4(this.derecha, this.derecha, m);
    }

    rotar(){
		if (this.isMouseDown){
			var deltaX=0;
			var deltaY=0;

			if (this.previousClientX) deltaX = this.mouse.x - this.previousClientX;
			if (this.previousClientY) deltaY = this.mouse.y - this.previousClientY;

			this.previousClientX = this.mouse.x;
			this.previousClientY = this.mouse.y;

			this.alfa = this.alfa + deltaX * this.factorVelocidad;
			this.beta = this.beta + deltaY * this.factorVelocidad;

			if (this.beta<0.001) this.beta=0.001;
			if (this.beta>Math.PI-0.001) this.beta=Math.PI-0.001;

            this.obj = [this.radio * this.zoom * Math.sin(this.alfa) * Math.sin(this.beta), this.radio * this.zoom * Math.cos(this.beta) ,this.radio * this.zoom * Math.cos(this.alfa) * Math.sin(this.beta)];
            
		}
	}

    obtenerTarget(){
        return [this.obj[0] + this.pos[0], this.obj[1] + this.pos[1], this.obj[2] + this.pos[2]];
    }

    crearEje(){
        let center = new Objeto();
        
        let shape = new Object();
        shape.puntos = [[0,0,0], [1, 0, 0], [1, .001, 0], [0, .001, 0]]
        shape.normales = [[0, -1, 0], [-1, 0, 0], [0, 1, 0], [1, 0, 0]];

        let path = path_circle(.001, 5, 0, .5);

        let geom = generar_superficie_barrido(path, shape);
        
        this.entity = new Objeto()
        this.entity.setGeometria(geom.vertexBuffer, geom.indexBuffer, geom.normalBuffer);
        this.entity.setPosicion(.15, 0, .03);
        this.entity.setEscala(.1, .1, .1);
        
        center.agregarHijo(this.entity);

        this.center = center;
    }

}