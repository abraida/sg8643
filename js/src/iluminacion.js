var ambColor = hexToRgb(lights.amb);
var diffColor = hexToRgb(lights.diff);
var antColor1 = hexToRgb(lights.ant1);
var antColor2 = hexToRgb(lights.ant2);
var catColor = hexToRgb(lights.cat);

var colors = [];
var pos = [];
var coeff = [];
var isDirectional = [];

function setupLights () {
	var dir = vec3.fromValues(.2, .8, 1);
	vec3.rotateY(dir, dir, vec3.create(), angle)
	colors = []
	colors = colors.concat(diffColor, antColor1, antColor2, catColor);
	
	pos = []
	pos = pos.concat(dir[0], dir[1], dir[2], antPos1[0], antPos1[1], antPos1[2], antPos2[0], antPos2[1], antPos2[2], munPos[0], munPos[1], munPos[2]);
	
	coeff = []
	coeff = coeff.concat([0.0, 0.0, 0.0], [1, 0.2, 0.35], [1, 0.2, 0.35],  [.8, 0.2, 0.3])

	isDirectional = [1, 0, 0, 0];
}