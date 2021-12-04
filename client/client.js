var socket = io('127.0.0.1:10001');

var canvas = document.getElementById('ctx');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");




var board = 0;
var m=6;						// holes per side
var n=1;						// counters per hole
var h=m*2+2;					// total number of pits in board
var northsKalahah = m*2+1;		// Array index of North's large pit
var southsKalahah = m;			// Array index of South's large pit
var totalStones = n*m*2;		// Amount of stones on board in total

var mx = my = mb = 0; // Mouse coordinates and button


var stoneWidth = 40;
var boardMarg = stoneWidth/2;
var boardWidth = stoneWidth*7;
var boardHeight = stoneWidth*6;
var rbx = w/2-boardWidth/2, rby = h/2-boardHeight/2; 



var ops = 0;
var empty = 0;

var w = window.innerWidth;
var h = window.innerHeight; // Canvas width and height
var players = 0;
var rings = 0;
var globalTimer = 100000;

var lx = 0, ly = 0;//center of screen
var zoom = 1;//proportional to speed
var zoomMult = 1;
var wheelRadius = 20;



socket.emit('requestBody');


function isKalahah(x){
	return x == northsKalahah || x == southsKalahah;
}


function render(){
	if(ops > 0)
		return;
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
	ops++;
	
	ctx.save();
	if(board == 0) rMenu();
	else rBoard();
	ctx.restore();

	ops--;
}


//packet handling
socket.on('board', function (data) {
	inGame = true;
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
},40);



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

function rMenu(){
	ctx.fillStyle = "black";
	write("Make Friend Game", 10, 10);
	write("Join Friend Game", 10, 40);
	write("Play With Random", 10, 70);
}
function rBoard(){
	//render board outline
	ctx.fillStyle = "#0077ff";
	roundRect(rbx-boardMarg/2,rby-boardMarg/2,boardWidth+boardMarg,boardHeight+boardMarg,boardMarg);

	//render highlighted column
	var mouseHoverColumn = Math.floor((mx-rbx)/stoneWidth);
	ctx.fillStyle = "#0099ff";
	if(mouseHoverColumn >= 0 && mouseHoverColumn < 7&& my >= rby && my < rby + boardHeight)
		roundRect(rbx+mouseHoverColumn*stoneWidth,rby,stoneWidth,boardHeight,boardMarg);
	
	//render stones and numbers
	telegrama(20);
	for(var y = 0; y < 6; y++)
		for(var x = 0; x < 7; x++){
			//render stone
			var boardHere = board[5-y][x];
			ctx.fillStyle = cols[Math.sign(boardHere)+1];
			ctx.beginPath();
			ctx.arc(rbx+(x+.5)*stoneWidth, rby+(y+.5)*stoneWidth, stoneWidth*.4, 0, 2*Math.PI);
			ctx.fill();

			//render number
			ctx.textAlign = "center";
			ctx.fillStyle = "#000000";
			if(boardHere != 0)
				ctx.fillText(Math.abs(boardHere), rbx+(x+.5)*stoneWidth, rby+(y+.65)*stoneWidth);
		}
}

document.addEventListener("mousemove",mouse);
document.addEventListener("mouseup",click);

function click(){
	var column = Math.floor((mx-rbx)/stoneWidth);
	var row = 0;
	while(board[row][column] != 0) {
		row++;
		if(row >= 6) {
			console.log("column full");
			return;
		}
	}
	if(column < 0 || column > 6 || my < rby || my > rby+boardHeight) {
		console.log("Clicked outside of board");
		return;
	}
	console.log("Clicked on column " + column);
	board[row][column] = selectedColor * moveNumber;
	selectedColor *= -1;
	moveNumber++;
}
function mouse(e){
	mx = e.clientX;
	my = e.clientY;
	mb = e.button;
}