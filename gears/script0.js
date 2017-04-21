var path;// = new Path();

var gears = [];

$(document).bind('mousemove', function(e){
	$('#message').css('color','black');
    $('#message').css({
        left: e.pageX + 5,
        top: e.pageY - 20
    });
});


function onMouseDown(event){
	$('#message').css('visibility','hidden');
	path = new Path();
	path.strokeColor = prettyRaCo();
	path.strokeWidth = 6;
		
}

function onMouseDrag(event){
	path.add(event.point);
//points.push(event.point);
}

function onMouseUp(event){
	//path.add(points);
	//path.closed = true;
	//console.log(JSON.stringify(path.segments));
	if(path.segments.length>0)
	gear(path.segments);
	path.smooth();
}

function gear(gearPath){
	
	var circle = new Path.Circle(new Point(0,0), new Size(20,20));
	circle.fillColor = prettyRaCo();
	gears.push({
		loc: circle,
		points: gearPath,
		len: gearPath.length
	});
	//console.dir(gears.);
	
}

function onFrame(event){
if(event.count<5000)
	for(var i = 0;i<gears.length;i++){		
		gears[i].loc.position = gears[i].points[ event.count%gears[i].len].point;
	}
}

//default message to put in the thing

	//var circle = new Path.Circle(point,new Size(60,60));
	
	
	
	
	
