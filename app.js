var http = require('http');
var express = require('express');
var app = express();

var port = 10001;

console.log('Server started');
console.log('Enabling express...');
app.use('/',express.static(__dirname + '/client'));
var httpServer = http.createServer(app);
httpServer.listen(port);
console.log("Server started on port " + port);
var io = require('socket.io')(httpServer)//, "path": "/kalaharena/io"});

var games = {};
var activeGameID = 0;
var sockets = {};

var m=6;						// holes per side
var n=1;						// counters per hole
var h=m*2+2;					// total number of pits in board
var northsKalahah = m*2+1;		// Array index of North's large pit
var southsKalahah = m;			// Array index of South's large pit
var totalStones = n*m*2;		// Amount of stones on board in total


function send(id, msg, data){
	var s = sockets[id];
	if(typeof s !== "undefined")
		s.emit(msg, data);
}

function makeGame(i, p1, p2){
	g = Game(i, p1, p2);
	games[i] = g;
	return g;
}

function newBoard(){
	b = new Array(h);
	for(var i in b)
		b[i] = n;
	return b;
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


