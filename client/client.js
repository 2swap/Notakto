var socket = io('127.0.0.1:10001');

var canvas = document.getElementById('ctx');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");





var mx = my = mb = 0; // Mouse coordinates and button
var mouseHoverColumn;
var mouseHoverRow;

var w = window.innerWidth;
var h = window.innerHeight; // Canvas width and height

var ops = 0;
var board = 0;

var squareWidth = w/15;
var boardMarg = squareWidth/2;
var boardWidth = squareWidth*3;
var boardHeight = boardWidth;
var rbx = w/2-boardWidth/2, rby = h/2-boardHeight/2; 




socket.emit('requestBoard');



function render(){
	if(ops != 0)
		return;
	ops++;

	//render background
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
	
	ctx.save();
	if(board == 0) renderMenu();
	else renderBoard();
	ctx.restore();

	ops = 0;
}
function renderMenu(){
	ctx.fillStyle = "black";
	write("Make Friend Game", 10, 10);
	write("Join Friend Game", 10, 40);
	write("Play With Random", 10, 70);
}
function renderBoard(){
	//render board outline
	ctx.fillStyle = board.isDead?"#444444":"#cccccc";
	roundRect(rbx-boardMarg/2,rby-boardMarg/2,boardWidth+boardMarg,boardHeight+boardMarg, boardMarg);

	if(!board.isDead){
		//render highlighted column
		ctx.fillStyle = "#999999";
		if(mouseHoverColumn >= 0 && mouseHoverColumn < 3 && mouseHoverRow >= 0 && mouseHoverRow < 3){
			ctx.beginPath();
			ctx.arc(rbx+(mouseHoverColumn+.5)*squareWidth, rby+(mouseHoverRow+.5)*squareWidth, squareWidth*.4, 0, 2*Math.PI);
			ctx.fill();
		}
	}

	telegrama(40);
	for(var y = 0; y < 3; y++)
		for(var x = 0; x < 3; x++){
			//render stone
			
			var letter = board.grid[y][x];

			//render number
			ctx.textAlign = "center";
			ctx.fillStyle = "#000000";
			ctx.fillText(letter, rbx+(x+.5)*squareWidth, rby+(y+.65)*squareWidth);
			
		}
}


//packet handling
socket.on('board', function (data) {
	board = data.board;
	console.log("Got board update");
});
setInterval(function(){
	w = window.innerWidth;
	h = window.innerHeight;
	if(canvas.width != w || canvas.height != h){
		canvas.width = w;
		canvas.height = h;
	}
	render();
},100);



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
	socket.emit('click', {x:mouseHoverColumn, y:mouseHoverRow});
}

function mouse(e){
	mx = e.clientX;
	my = e.clientY;
	mb = e.button;
	mouseHoverColumn = Math.floor((mx-rbx)/squareWidth);
	mouseHoverRow = Math.floor((my-rby)/squareWidth);
}