var production = false;

var socket;
if(production)
	socket = io('alexhontz.com', {path:'/notakto/io'});
else
	socket = io('127.0.0.1:10003');

var canvas = document.getElementById('ctx');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");





var numberOfBoards = 0;
var mx = my = mb = 0; // Mouse coordinates and button
var mouseHoverColumn;
var mouseHoverRow;
var mouseHoverBoard;

var w = window.innerWidth;
var h = window.innerHeight; // Canvas width and height

var ops = 0;
var boardList = 0;

var squareWidth = w/15;
var boardMarg = squareWidth/2;
var boardWidth = squareWidth*3;




socket.emit('requestBoard');



function render(){
	if(ops != 0)
		return;
	ops++;

	//render background
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
	
	ctx.save();
	if(boardList == 0) renderMenu();
	else renderAllBoards();
	ctx.restore();

	ops = 0;
}
function renderMenu(){
	ctx.fillStyle = "black";
	write("Make Friend Game", 10, 10);
	write("Join Friend Game", 10, 40);
	write("Play With Random", 10, 70);
}
function renderAllBoards(){
	for(var i = 0; i < numberOfBoards; i++){
		renderBoard(i, xCenterOfIthBoard(i), yCenterOfIthBoard(i));
	}
}
function xCenterOfIthBoard(i){
	var numberOfBoardsInThisRow = Math.min(numberOfBoards-(i-i%3), 3);
	return w/2 + (i%3-(numberOfBoardsInThisRow-1)*.5)*(boardWidth+2*boardMarg);
}
function yCenterOfIthBoard(i){
	var numberOfRows = Math.ceil(numberOfBoards/3);
	var whichRow = Math.ceil((i+1)/3)-1;
	return h/2 + (whichRow-(numberOfRows-1)*.5)*(boardWidth+2*boardMarg);
}
function renderBoard(i, rx, ry){
	//render board outline
	ctx.fillStyle = boardList[i].isDead?"#444444":"#cccccc";
	roundRect(rx-(boardWidth+boardMarg)/2,ry-(boardWidth+boardMarg)/2,boardWidth+boardMarg,boardWidth+boardMarg, boardMarg);

	if(!boardList[i].isDead && i == mouseHoverBoard){
		//render highlighted column
		ctx.fillStyle = "#999999";
		if(mouseHoverColumn >= 0 && mouseHoverColumn < 3 && mouseHoverRow >= 0 && mouseHoverRow < 3){
			ctx.beginPath();
			ctx.arc(xCenterOfIthBoard(i)-boardWidth/2+(mouseHoverColumn+.5)*squareWidth,
					yCenterOfIthBoard(i)-boardWidth/2+(mouseHoverRow+.5)*squareWidth,
					squareWidth*.4, 0, 2*Math.PI);
			ctx.fill();
		}
	}

	telegrama(40);
	for(var y = 0; y < 3; y++)
		for(var x = 0; x < 3; x++){
			//render stone
			var letter = boardList[i].grid[y][x];

			//render number
			ctx.textAlign = "center";
			ctx.fillStyle = "#000000";
			ctx.fillText(letter, xCenterOfIthBoard(i)-boardWidth/2+(x+.5)*squareWidth, yCenterOfIthBoard(i)-boardWidth/2+(y+.65)*squareWidth);
			
		}
}


//packet handling
socket.on('boardList', function (data) {
	boardList = data.boardList;
	numberOfBoards = boardList.length;
	console.log("Got boardList update with " + numberOfBoards + " boards.");
});
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
	socket.emit('click', {x:mouseHoverColumn, y:mouseHoverRow, i:mouseHoverBoard});
}

function square(x){
	return x*x;
}

function mouse(e){
	mx = e.clientX;
	my = e.clientY;
	mb = e.button;

	var closest = -1;
	var closestDist = 100000;
	for(var i = 0; i < numberOfBoards; i++){
		var dist = Math.abs(square(mx - xCenterOfIthBoard(i)) + square(my - yCenterOfIthBoard(i)));
		if(dist < closestDist){
			closest = i;
			closestDist = dist;
		}
	}

	mouseHoverBoard = closest;
	mouseHoverColumn = Math.floor((mx-xCenterOfIthBoard(mouseHoverBoard)+boardWidth/2)/squareWidth);
	mouseHoverRow =    Math.floor((my-yCenterOfIthBoard(mouseHoverBoard)+boardWidth/2)/squareWidth);
}
