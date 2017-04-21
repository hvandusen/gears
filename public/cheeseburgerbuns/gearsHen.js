var rowSize = 150;
var columnSize = 150;
var spacing = 20;
var circleSize = 7;
var gradientRatio=.23;
var range = 80;
var colorAmt = 3;

var point = new Object({
	x: 0,
	y:0,
	on: false

});

var colors = [];
function setColors(){
for(var i =0;i< colorAmt;i++)
{
	colors[i] = prettyRaCo();
}
}
setColors();


//GRID STRUCCHA
var rows = new Array(rowSize);

//init 2d array
for(var i = 0;i<rows.length;i++){
	rows[i] = new Array(columnSize);
}
console.dir(rows[4]);
//rows[4][8].on = true;
//console.log(rows[4][2]);
	for(var i = 0;i<rows.length;i++){
		for(var j = 0;j<columnSize;j++){
			rows[i][j] = {x:i*spacing,y:j*spacing};
		}
	}
var left = function lef(pt){
	if(pt)
	pt.x = pt.x++;
}
function onFrame(){
	draw(left);
	draw(init);

}



function draw(ptFunc){
	for(var i = 0;i<rows.length;i++){
		for(var j = 0;j<columnSize;j++){
			rows[i][j] = ptFunc(rows[i][j]);
		}
	}
}

var init = function initPt(pt){
	//console.log(pt);
	//pt.x = num(100);
	//pt.y = num(100);
	return {
		x: num(1000),
		y:num(1000),
		on: false


	};
}
var bloip = function initPt(pt){
	return {
		x: num(range)*num(range*gradientRatio),
		y:num(70)*num(23),
		on: false
	};
}



rows[4][8].on = true;
var circle = function circ(pt){
	var circ = new Path.Circle(new Point(pt.x,pt.y),[circleSize,circleSize]);
	circ.fillColor = colors[num(10)];//prettyRaCo();

}

draw(bloip);
draw(circle);


$('body').click(function(){

project.activeLayer.removeChildren();
	setColors();
	draw(bloip);
	draw(circle);
});
