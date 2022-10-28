
class Camara{
	constructor(){
        this.previousClientX = 0;
        this.previousClientY = 0;
        this.radio = 5;
        this.alfa = 0;
        this.beta = Math.PI/2;
        this.factorVelocidad = 0.01;
        this.isMouseDown = false;
        this.mouse = {x: 0, y: 0};
        this.zoom = 1.0;

		this.pos = [this.radio * this.zoom * Math.sin(this.alfa) * Math.sin(this.beta), this.radio * this.zoom * Math.cos(this.beta) ,this.radio * this.zoom * Math.cos(this.alfa) * Math.sin(this.beta)];
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

			if (this.beta<0) this.beta=0;
			if (this.beta>Math.PI) this.beta=Math.PI;

			this.pos = [this.radio * this.zoom * Math.sin(this.alfa) * Math.sin(this.beta), this.radio * this.zoom * Math.cos(this.beta) ,this.radio * this.zoom * Math.cos(this.alfa) * Math.sin(this.beta)];

		}
	}

    disminuirZoom(zoom){
        if (this.zoom - zoom >= .5){
            this.zoom -= zoom;
            var mouse = this.isMouseDown;
            this.isMouseDown = true;
            this.rotar();
            this.isMouseDown = mouse;
        }
    }
    aumentarZoom(zoom){
        if (this.zoom + zoom <= 2){
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
    mouseDown(){
        this.isMouseDown = true;
    }
    mouseUp(){
        this.isMouseDown = false;

	}    
}