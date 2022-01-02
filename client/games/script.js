var ctx;
var canvas;
var w = 5.5, h = 11; // original CMG version is 5.5,11
var tileW = 64, tileH = 48;
var mx = 0, my = 0, minmx = 0, minmy = 0;
var prob = .2;
var totalStones = 9;
var animSpeed = 5;
var margin = 32;
var canvasW = w * tileW + 2*margin, canvasH = h * tileH + (tileW-tileH) + 2*margin;
var pigY, pigX; // real coords
var pigYA, pigXA; // animated coords
var pigspr = "confused";
var plm = -1;
var grid = {};
var humanMoves = 3;

var images = {};

window.onload = function() {
	resetTiles();
	canvas = document.getElementById("myCanvas");
	canvas.addEventListener("mousedown", onClick, false);
	canvas.addEventListener("mousemove", onMouseMove, false);
	canvas.addEventListener("keydown", resetTiles, false);
	
    ctx = canvas.getContext("2d");
    ctx.canvas.width = canvasW;
    ctx.canvas.height = canvasH;
	setInterval(renderGrid,25);
};

function resetTiles(){
	humanMoves = 3;
	pigspr = "surprised";
	pigY = (h-1)/2;
	pigX = Math.ceil(w)/2-.5;
	pigYA = canvasH/2;
	pigXA = canvasW/2;

	var total = 0, stonesLeft = totalStones;
	for (var y = 0; y < h; y++) for (var x = (y%2)/2; x+1 <= w; x++) if(x != pigX || y != pigY) total++;
	for (var y = 0; y < h; y++) for (var x = (y%2)/2; x+1 <= w; x++){
		var prb = Math.random()<stonesLeft/total;
		prb &= !(x == pigX && y == pigY);
		setGrid(grid,y,x,prb);
		total-=(x != pigX || y != pigY)?1:0;
		stonesLeft-=prb?1:0;
	}

	console.log("\n\n\n\n\n");
}

function renderGrid(){
	var inside = "Click to place "+humanMoves+" stone"+(humanMoves>1?"s":"")+"!";
	if(plm == -3) inside = "Solved!";
	if(pigX>w-1||pigX<0||pigY>h-1||pigY<0) inside = "You Lose!";
	document.getElementById("mines").innerHTML = "<h1>"+inside+"</h1>";

	ctx.fillStyle = "#bbffff";
	ctx.fillRect(0,0,canvasW,canvasH);

	ctx.save();
	ctx.translate(margin,margin);

	var min = 10000000;
	for (var s in grid) {
		var gx = strtox(s), gy = strtoy(s);
		var tx = gx*tileW; ty = gy*tileH;
		d = square(mx-(tx+tileW/2)) + square(my-(ty+tileH/2+(tileW-tileH)/2));
		if(d < min){
			min = d;
			minmx = gx;
			minmy = gy;
		}
		drawTile(tx, ty, grid[s]?"block":"hex");
	}

	//draw pig
	pigXA = (animSpeed*pigXA+pigX*tileW)/(animSpeed+1);
	pigYA = (animSpeed*pigYA+pigY*tileH)/(animSpeed+1);
	drawTile(pigXA,pigYA,pigspr);

	//draw mouse
	if(!(minmx == pigX && minmy == pigY) && getGrid(grid,minmy,minmx) == false && humanMoves > 0) drawTile(tileW*minmx,tileH*minmy,"mouse");

	ctx.restore();
}

function drawTile(x, y, id) {
	id = "images/"+id+".png";
	if(typeof images[id] === "undefined"){
		var drawing = new Image();
		drawing.src = id;
		images[id] = drawing;
		drawing.onload = function() { ctx.drawImage(drawing, x, y); }
	}else ctx.drawImage(images[id], x, y);
}

function getGrid(g,y,x){ return g[y+" "+x]; } // be sure to use == true (b/c undefined)
function setGrid(g,y,x,v){ g[y+" "+x] = v; }

function onMouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    mx = event.clientX - rect.left - margin;
    my = event.clientY - rect.top - margin;
}
function onClick(event) {
	if(humanMoves == 0) {bestPigDir(); return;}
	if(minmx == pigX && minmy == pigY) return;
	if(getGrid(grid,minmy,minmx) == true) return;
	setGrid(grid,minmy,minmx,true);
	humanMoves--;
	if(isPigSurrounded()) return;
	if(humanMoves == 0) pigMove();
}

function isPigSurrounded() {
	var child = {};
	Object.keys(grid).forEach(function(key) { child[ key ] = grid[ key ]; });
	child[pigY+" "+pigX]=5;
	var edits = 1;
	while(edits>0){
		edits = 0;
		for(var s in child) if(child[s] == 5) for(var dir = 0; dir < 6; dir++){
			var nY = strtoy(s)+dirY(dir), nX = strtox(s)+dirX(dir);
			if(getGrid(child,nY,nX) == true) continue;
			if(typeof getGrid(child,nY,nX) === "undefined") if(isOutside(nY,nX)) return false;
			if(getGrid(child,nY,nX) != 5){
				setGrid(child,nY,nX,5);
				edits++;
			}
		}
	}
	plm = -3;
	return true;
}

function square(x){ return x*x; }












//Recursive solver
function pigMove(){
	document.getElementById("mines").innerHTML = "<h1>Pig is thinking...</h1>";
	pigspr = "happy";

	plm = bestPigDirNow();

	if(plm < 0)return;
	pigY += dirY(plm);
	pigX += dirX(plm);
	humanMoves++;
}

function bestPigDirNow(){
	plm = -2;

	//initial pruning flood
	var child = {};
	Object.keys(grid).forEach(function(key) { child[ key ] = grid[ key ]; });
	child[pigY+" "+pigX]=5;
	var edits = 1;
	while(edits>0){
		edits = 0;
		for(var s in child) if(child[s] == false) for(var dir = 0; dir < 6; dir++){
			var nY = strtoy(s)+dirY(dir), nX = strtox(s)+dirX(dir);
			if(getGrid(child,nY,nX) == 5){
				child[s]=5;
				edits++;
			}
		}
	}
	for(var s in child) child[s] = child[s] != 5;

	for(var dir = 0; dir < 6; dir++){
		var nX = pigX + dirX(dir), nY = pigY + dirY(dir);
		if(getGrid(grid,nY,nX) == true) continue;
		if(isOutside(nY,nX)){
			console.log(dir+" is a way out");
			return dir;
		}
	}
	for(var dir = 0; dir < 6; dir++){
		var nX = pigX + dirX(dir), nY = pigY + dirY(dir);
		if(getGrid(grid,nY,nX) == true) continue;
		if(isEdge(nY,nX)){
			console.log(dir+" is an edge");
			return dir;
		}
	}
	for(var d = 0; d < 9; d+=2){
		for(var dir = 0; dir < 6; dir++){
			var nX = pigX + dirX(dir), nY = pigY + dirY(dir);
			if(getGrid(grid,nY,nX) == true) continue;
			if(!humanCanBlock(child,nY,nX,d)){
				console.log(dir+" is a searched route");
				return dir;
			}
		}
	}

	pigspr = "confused";
	for(var dir = 0; dir < 6; dir++) if(!getGrid(grid,pigY+dirY(dir),pigX+dirX(dir)) == true) return dir;

	return -2;
}

function pigCanEscape(parent,pY,pX,depth){ //returns true if the pig can make it out. Context: pig's turn.
	var borders = 0;
	for(var dir = 0; dir < 6; dir++) if((isEdge(pY+dirY(dir), pX+dirX(dir)) || isOutside(pY+dirY(dir), pX+dirX(dir))) && getGrid(parent,pY+dirY(dir),pX+dirX(dir)) != true)return true;
	
	if(depth == 0) return false;

	for(var dir = 0; dir < 6; dir++){
		var nY = pY+dirY(dir), nX = pX+dirX(dir);
		if(getGrid(parent,nY,nX) != false)continue;
		var child = {};
		Object.keys(parent).forEach(function(key) { child[ key ] = parent[ key ]; });
		setGrid(child,pY,pX,true);
		if(!humanCanBlock(child,nY,nX,depth-1))return true;
	}
	return false;
}
function humanCanBlock(parent,pY,pX,depth){ //returns true if the pig can be blocked. Context: human's turn.
	if(depth == 0) return true;
	for(var s in parent){
		if(parent[s] == true)continue;
		var child = {};
		Object.keys(parent).forEach(function(key) { child[ key ] = parent[ key ]; });
		child[s] = true;
		if(!pigCanEscape(child,pY,pX, depth-1))return true;
	}
	return false;
}

function isOutside(y,x){ return x > w-1 || x < 0 || y >= h || y < 0; }
function isEdge(y,x){ return x > w || x < 1 || y >= h-1 || y < 1; }
function dirX(dir){ return (((Math.floor(dir/2)%3-1)==0)+1)*(dir%2-.5); }
function dirY(dir){ return Math.floor(dir/2)%3-1; }
function strtoy(s){ return parseInt(s.split(" ")[0]); }
function strtox(s){ return parseFloat(s.split(" ")[1]); }
