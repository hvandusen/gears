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


	room = $('#roomname')[0].classList[0]
$('#giveup').click(function(){

	socket.emit('giveup')

});

function onMouseDown(event){
	$('#message').css('visibility','hidden');
	path = new Path();
	path.strokeColor = prettyRaCo();
	path.strokeWidth = 6;
	//socket.emit('mousedown',[event.point.x,event.point.y])
}

function onMouseDrag(event){
	path.add(event.point);
	//socket.emit('mouseup',event.point)
//points.push(event.point);
}

function onMouseUp(event){
	if(path.segments.length>0)
		{
		gear(path.segments);
		pathPoints = [];
		$.each(path.segments,function(i,j){
			pathPoints[i] = [j.point.x,j.point.y]
		})
		//console.dir(pathPoints)
	//	socket.emit('mouseup')
		path.smooth();
		c = document.getElementById("myCanvas");
		console.dir(c.toDataUrl())
		socket.emit('newPath',{newPath: pathPoints,img:c.toDataUrl()})
	}
}

function gear(gearPath){
	var circle = new Path.Circle(new Point(-100,-100), new Size(20,20));
	circle.fillColor = prettyRaCo();
	gears.push({
		loc: circle,
		points: gearPath,
		len: gearPath.length
	});
	socket.emit('newgear',{points:gearPath});
	//console.dir(gears.);

}

function onFrame(event){
if(event.count<15000)
	for(var i = 0;i<gears.length;i++){
		gears[i].loc.position = gears[i].points[ event.count%gears[i].len].point;
	}
}

//default message to put in the thing

	//var circle = new Path.Circle(point,new Size(60,60));


socket.emit('roomname',$('#roomname')[0].classList[0])
socket.on('update', function (data) {
	console.log('update!!')
	paths = data.paths
	project.clear();
	$.each(paths,function(i,j){
		p = new Path()
		$.each(j,function(m,n){
			p.add(new Point(n))
		});
		p.strokeColor = prettyRaCo();
		p.strokeWidth = 6;
		p.smooth()
		gear(p.segments)
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
		//project.clear();

		$.each(paths,function(i,j){
			p = new Path()
			$.each(j,function(m,n){
				p.add(new Point(n))
			});
			console.dir(p)
			p.strokeColor = prettyRaCo();
			p.strokeWidth = 6;
			p.smooth()
			gear(p.segments)
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
		gear(livepath.segments)
		livepath.smooth()
	});


	socket.on('erase', function (data) {
		//pathList = []
		project.clear();
	});
