var socket;
if(config.prod_mode)
	socket = io('alexhontz.com', {path:'/Notakto/io'});
else
	socket = io('127.0.0.1:'+config.port);

var canvas = document.getElementById('ctx');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");






var w = window.innerWidth;
var h = window.innerHeight; // Canvas width and height

var mx = my = mb = 0; // Mouse coordinates and button

var ops = 0;


var boardList = 0;


socket.emit('requestBoard');



function render(){
	if(ops != 0)
		return;
	ops++;

	//render background
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,w,h);
	
	ctx.save();
	if(boardList == 0) renderMenu();
	else {
		renderTimerBar();
		renderChat();
		renderGame();
	}

	ctx.restore();
	
	ops = 0;
}
setInterval(function(){
	w = window.innerWidth;
	h = window.innerHeight;
	canvas.width = w;
	canvas.height = h;
	squareWidth = w/15;
	boardMarg = squareWidth/2;
	boardWidth = squareWidth*3;
	render();
},100);

function requestGame(){
	socket.emit('restart');
}

//packet handling
socket.on('boardList', function (data) {
	boardList = data.boardList;
	console.log("Got boardList update.");
});


function renderMenu(){
	ctx.fillStyle = "black";
	write("Make Friend Game", 10, 10);
	write("Join Friend Game", 10, 40);
	write("Play With Random", 10, 70);


}

function renderTimerBar(){
	//todo
}
function renderChat(){
	//todo
}



//random
function telegrama(x){
	ctx.font = x+"px Trebuchet MS";
}
function write(str, x, y){
	ctx.fillText(str, x, y);
}
function intToTime(x){
	var minutes=Math.floor(x/50/60), seconds=""+Math.floor(x/50%60), dec=(""+(x%50)*2).substring(0,2);
	if(seconds.length<2)
		seconds = "0"+seconds;
	if(dec.endsWith("."))
		dec = dec.substring(0,1);
	while(dec.length < 2)
		dec = "0"+dec;
	return minutes+":"+seconds+"."+dec;
}
function circle(x,y,r){
	ctx.save();
	ctx.translate(x,y);
	ctx.beginPath();
	ctx.arc(0,0,r,0,2*Math.PI);
	ctx.stroke();
	ctx.restore();
}
function roundRect(x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.arcTo(x+w, y,   x+w, y+h, r);
	ctx.arcTo(x+w, y+h, x,   y+h, r);
	ctx.arcTo(x,   y+h, x,   y,   r);
	ctx.arcTo(x,   y,   x+w, y,   r);
	ctx.closePath();
	ctx.fill();
}


document.addEventListener("mousemove",mouse);
document.addEventListener("mouseup",click);

function click(){
	gameOnClick();
}

function square(x){
	return x*x;
}

function mouse(e){
	mx = e.clientX;
	my = e.clientY;
	mb = e.button;
	gameOnMouseMove();
}
