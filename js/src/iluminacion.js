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
	colors = []
	colors = colors.concat(diffColor, antColor1, antColor2, catColor);
	
	pos = []
	pos = pos.concat([.2, .8, 1.0], antPos1[0], antPos1[1], antPos1[2], antPos2[0], antPos2[1], antPos2[2], munPos[0], munPos[1], munPos[2]);
	
	coeff = []
	coeff = coeff.concat([0.0, 0.0, 0.0], [1, 0.2, 0.35], [1, 0.2, 0.35],  [.8, 0.2, 0.3])

	isDirectional = [1, 0, 0, 0];
}