const game = require("./gameservers/connect4_server.js");

const fs = require('fs');
const config_file_path='config.json';
const client_config_file_path='client/config.js';
const config = JSON.parse(fs.readFileSync(config_file_path));

const config_defaults = {
	port: 10003,
	prod_mode: false,
}

for(key in config_defaults)
	if(!(key in config))
		config[key] = config_defaults[key];

write_config_to_file(config)

function write_config_to_file(data) {
	try {
		fs.writeFileSync(config_file_path, JSON.stringify(data));
		fs.writeFileSync(client_config_file_path, "var config = " + JSON.stringify(data));
	} catch (err) {
		console.error(err)
	}
}

var http = require('http');
var express = require('express');
var app = express();

console.log('Server started');
console.log('Enabling express...');
if(config.prod_mode)
	app.use('/Notakto/',express.static(__dirname + '/client'));
else
	app.use('/',express.static(__dirname + '/client'));
var httpServer = http.createServer(app);
httpServer.listen(config.port);
console.log("Server started on port " + config.port);
var args = {
    cors: {
        origin: "http://localhost:8100",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
}
if(config.prod_mode)
    args[path] = "/Notakto/io";
var io = require('socket.io')(httpServer, args);


var boardList = game.makeBoard();

var sockets = {};


function send(socket, msg, data){
	if(typeof socket !== "undefined")
		socket.emit(msg, data);
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
		broadcastBoard();
	});

	socket.on('restart',function(data){
		boardList = game.makeBoard();
		broadcastBoard()
	});
	
	socket.on('click',function(data){
		if(game.onClientClick(boardList, data))
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


