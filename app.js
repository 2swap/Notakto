var production = false;

var http = require('http');
var express = require('express');
var app = express();

var port = 10003;

console.log('Server started');
console.log('Enabling express...');
if(production)
	app.use('/',express.static(__dirname + '/client'));
else
	app.use('/Notakto/',express.static(__dirname + '/client'));
var httpServer = http.createServer(app);
httpServer.listen(port);
console.log("Server started on port " + port);
var io;
if(production)
	io = require('socket.io')(httpServer, {"path": "/Notakto/io"});
else
	io = require('socket.io')(httpServer);


var numberOfBoards = 6;
var boardList = makeBoard();

var sockets = {};

function send(socket, msg, data){
	if(typeof socket !== "undefined")
		socket.emit(msg, data);
}

function checkDead(i){
	for(var y = 0; y < 3; y++){
		allFilled = true;
		for(var x = 0; x < 3; x++){
			if(boardList[i].grid[y][x] == ''){
				allFilled = false;
			}
		}
		if(allFilled)
			return true;
	}

	for(var x = 0; x < 3; x++){
		allFilled = true;
		for(var y = 0; y < 3; y++){
			if(boardList[i].grid[y][x] == ''){
				allFilled = false;
			}
		}
		if(allFilled)
			return true;
	}

	if(boardList[i].grid[0][0]!='' && boardList[i].grid[1][1]!='' && boardList[i].grid[2][2]!='')
		return true;
	if(boardList[i].grid[2][0]!='' && boardList[i].grid[1][1]!='' && boardList[i].grid[0][2]!='')
		return true;

	return false;
}

function broadcast(msg, data){
	for (s in sockets)
		send(sockets[s], msg, data);
}

function broadcastBoard(){
	broadcast('boardList', {boardList:boardList});
}

function makeGame(i, p1, p2){
	g = Game(i, p1, p2);
	games[i] = g;
	return g;
}

function makeBoard(msg, data){
	var boardList = []
	for(var i = 0; i < numberOfBoards; i++){
		boardList[i] = {isDead:false, grid: [ ['', '', ''], ['', '', ''], ['', '', ''] ]};
	}
	return boardList;
}

var Game = function(i, p1){
	var self = {
		id:i,
		p1:p1,
		p2:0,
		board:newBoard(),
		whoseTurn:0
	}
	self.addPlayer = function(socketID){
		if(p2 == 0)	p2=socketID;
		else console.log("This shouldnt happen :o");
	}
	self.removePlayer = function(){
		console.log("TODO game.removePlayer");
	}
	return self;
}


io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	socket.gameID = 0;
	var id = socket.id;
	sockets[socket.id]=socket;
	
	socket.on('joingame',function(data){
		if(activeGameID == 0){
			i = Math.random();
			g = makeGame(i, id, 0);
			activeGameID = i;
			socket.gameID = i;
		}else{
			games[activeGameID].addPlayer(id);
			socket.gameID = activeGameID;
			activeGameID = 0;
		}
	});
	
	socket.on('requestBoard',function(data){
		boardList = makeBoard();
		broadcastBoard();
	});
	
	socket.on('click',function(data){

		// don't permit data with absent coordinates
		if(typeof data === "undefined")
			return;

		// don't permit data with absent coordinates
		if(!("x" in data) || !("y" in data) || !("i" in data))
			return;

		var x = data.x;
		var y = data.y;
		var i = data.i;

		// don't permit data with non-integer coordinates
		if(!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(i))
			return;

		// don't permit out-of-bounds coordinates
		if(x >= 3 || x < 0 || y >= 3 || y < 0 || i < 0 || i >= numberOfBoards)
			return;

		// don't permit play on non-empty square
		if(boardList[i].grid[y][x] != '')
			return;

		// don't permit play on dead board
		if(boardList[i].isDead)
			return;

		console.log("Player clicked on board " + i + " at (" + y + ", " + x + ")")
		boardList[i].grid[y][x] = 'x';

		if(checkDead(i))
			boardList[i].isDead = true;

		broadcastBoard();

	});
	
	socket.on('joinfriendgame',function(data){
		if(activeGameID == 0){
			i = Math.random();
			g = makeGame(i, id, 0);
			activeGameID = i;
			socket.gameID = i;
		}else{
			games[activeGameID].addPlayer(id);
			socket.gameID = activeGameID;
			activeGameID = 0;
		}
	});

	socket.on('disconnect',function(data){
		if(socket.gameID != 0) games[socket.gameID].removePlayer();
	});
	socket.on('leavegame',function(data){
		if(socket.gameID != 0) games[socket.gameID].removePlayer();
	});
});


