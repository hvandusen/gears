var path;
//var socket = io('/'+$('#roomname')[0].classList[0]);
var socket = io.connect();
var gears = [];


$(document).bind('mousemove', function(e){
	$('#message').css('color','black');
    $('#message').css({
        left: e.pageX + 5,
        top: e.pageY - 20
    });
});


var room = $('#roomname').attr('data-room')
$('#giveup').click(function(){
	socket.emit('giveup')
});

function onMouseDown(event){
	$('#message').css('visibility','hidden');
	path = new Path();
	path.strokeColor = prettyRaCo();
	path.strokeWidth = 6;
	//socket.emit('mousedown',[event.point.x,event.point.y]);
}

function onMouseDrag(event){
	path.add(event.point);
	//socket.emit('mouseup',event.point)
//points.push(event.point);
}

function onMouseUp(event){
	if(path.segments.length>0)
		{
		gear(path);
		pathPoints = [];
		$.each(path.segments,function(i,j){
			pathPoints[i] = [j.point.x,j.point.y]
		});
	//	socket.emit('mouseup')
		path.smooth();
		c = document.getElementById("myCanvas");
		socket.emit('newPath',{
			newPath: pathPoints,
			room:room,
			img:c.toDataURL()})
	}
}

// Every dot moves at the same steady speed along its line, then jumps back
// to the start. Time-based, so it doesn't depend on how fast the line was
// drawn or on the screen's refresh rate.
var DOT_SPEED = 250; // pixels per second

function gear(gearPath){
	var circle = new Path.Circle(new Point(-100,-100), new Size(20,20));
	circle.fillColor = prettyRaCo();
	gears.push({
		loc: circle,
		path: gearPath
	});
}

function onFrame(event){
	for(var i = 0;i<gears.length;i++){
		var g = gears[i];
		var len = g.path.length;
		if (!len) {
			if (g.path.firstSegment) g.loc.position = g.path.firstSegment.point;
			continue;
		}
		g.loc.position = g.path.getPointAt((event.time * DOT_SPEED) % len);
	}
}

//default message to put in the thing

	//var circle = new Path.Circle(point,new Size(60,60));


// (re)join the room every time the socket connects, including reconnects
socket.on('connect', function(){ socket.emit('roomname',room) });



socket.on('update', function (data) {
	console.log('update!!')
	paths = data.paths
	project.clear();
	gears = [];
	$.each(paths,function(i,j){
		p = new Path()
		$.each(j,function(m,n){
			p.add(new Point(n))
		});
		p.strokeColor = prettyRaCo();
		p.strokeWidth = 6;
		p.smooth()
		gear(p)
	});

});

// TIP: .connect with no args does auto-discovery
socket.on('project', function (data) {
	if(data.paths.length == 0)
	{
		console.log('nothing here yet');//'sending this as project');
	}
	else
	{
		paths = data.paths//.importJSON(data.project);
		console.log('incoming gears list')
		console.dir(paths)
		project.clear();
		gears = [];

		$.each(paths,function(i,j){
			p = new Path()
			$.each(j,function(m,n){
				p.add(new Point(n))
			});
			console.dir(p)
			p.strokeColor = prettyRaCo();
			p.strokeWidth = 6;
			p.smooth()
			gear(p)
		});
	}


	});

	socket.on('newPath', function (data) {
		livepath = new Path();
		livepath.strokeColor = prettyRaCo();
		livepath.strokeWidth = 6;
	});

	socket.on('move', function (data) {
		console.dir(data.point)
		livepath.add(new Point(data.point))
	});

	socket.on('endPath', function (data) {
		gear(livepath)
		livepath.smooth()
	});


	socket.on('erase', function (data) {
		project.clear();
		gears = [];
	});
