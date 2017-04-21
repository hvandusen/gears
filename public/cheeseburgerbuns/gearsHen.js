var amt = Math.floor(window.innerWidth / 100)*150;
var symbs = [];
$(document).ready(function(){
	var c = new Path.Circle(100,400,8);
	[prettyRaCo(),prettyRaCo(),prettyRaCo()].map(function(e){
		var pth = new Path.Circle(0,0,8);
		pth.fillColor = e;
		symbs.push(new Symbol(pth))
	});
	for (var i = 0; i < amt; i++) {
		for (var j = 0; j < 3; j++) {
			symbs[j].place(Point.random()*view.bounds.size*[(amt-i)/amt,(amt-j)/amt]);
		}
	}
	$("#chillCanv").addClass("setup")
})
