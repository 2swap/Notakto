import {
	Socket,
	Server as SocketIOServer,
	ServerOptions as SocketIOServerOptions,
} from 'socket.io';
import {
	IBoardType,
	makeBoard,
	onClientClick,
} from './gameservers/notakto_server';
import fs from 'fs';
import http from 'http';
import express from 'express';
import { IMouseCoordinates } from './interfaces/socket_events';


// Defined structure for app config.
interface IAppConfiguration {
	port?: 				number,
	prod_mode?: 	boolean,
}

// Setup application config.
const config_file_path = 'config.json';
const client_config_file_path = 'client/config.js';
let config: IAppConfiguration = JSON.parse(fs.readFileSync(config_file_path).toString());
const config_defaults: IAppConfiguration = {
	port: 10003,
	prod_mode: false,
}

// Apply configuration defaults.
config = {
	...config_defaults,
	...config,
}
write_config_to_file(config)


function write_config_to_file(data: IAppConfiguration) {
	try {
		fs.writeFileSync(config_file_path, JSON.stringify(data));
		fs.writeFileSync(client_config_file_path, "var config = " + JSON.stringify(data));
	} catch (err) {
		console.error(err)
	}
}

// Express.js setup.
console.log('Server started');
console.log('Enabling express...');
const app = express();

if(config.prod_mode)
	app.use('/Notakto/',express.static(__dirname + '/client'));
else
	app.use('/',express.static(__dirname + '/../client'));
const httpServer = http.createServer(app);
httpServer.listen(config.port);
console.log("Server started on port " + config.port);

// Configure SocketIO.
const args: Partial<SocketIOServerOptions> = {
	cors: {
		origin: "http://localhost:8100",
		methods: ["GET", "POST"],
		credentials: true,
	},
	transports: ['websocket', 'polling'],
	allowEIO3: true,
};
if(config.prod_mode)
	args.path = "/Notakto/io";


interface ISocketMap {
	[key: string]: {
		socket: Socket, // Active socket instance.
		gameId: number, // Associated game id.
	},
}

const io = new SocketIOServer(httpServer, args);
const sockets: ISocketMap = {};
let boardList = makeBoard();


function send(socket: Socket, msg: string, data: ISocketBoardList){
	if(typeof socket !== "undefined")
		socket.emit(msg, data);
}

interface ISocketBoardList {
	boardList: IBoardType,
}

function broadcast(msg: string, data: ISocketBoardList){
	for (const sockId in sockets)
		send(sockets[sockId].socket, msg, data);
}

function broadcastBoard(){
	broadcast('boardList', {
		boardList,
	});
}


interface IGameList {
	[gameId: number]: Game,
}

class Game {
	static games: IGameList = {};
	id: number;
	socketIdPlayer1: string;
	socketIdPlayer2: string;

	constructor(id: number, socketIdP1: string, socketIdP2: string) {
		Game.games[id] = this;

		this.id = id;
		this.socketIdPlayer1 = socketIdP1;
		this.socketIdPlayer2 = socketIdP2;

	}

	public addPlayer(socketId: string) {
		if (this.socketIdPlayer2 === '') this.socketIdPlayer2 = socketId;
		else console.log("This shouldnt happen :o");
	}

	public removePlayer() {
		console.log("TODO game.removePlayer");
	}
};



io.sockets.on('connection', (socket: Socket) => {
	// Keep track of open socket connections and their corresponding game.
	sockets[socket.id] = {
		socket,
		gameId: 0,
	}
	let activeGameId = 0;

	socket.on('joingame', () => {
		if(activeGameId == 0){
			const gameId = Math.random();
			new Game(gameId, socket.id, '');
			activeGameId = gameId;
			sockets[socket.id].gameId = gameId;
		}else{
			Game.games[activeGameId].addPlayer(socket.id);
			sockets[socket.id].gameId = activeGameId;
			activeGameId = 0;
		}
	});

	socket.on('requestBoard', () => {
		broadcastBoard();
	});

	socket.on('restart', () => {
		boardList = makeBoard();
		broadcastBoard()
	});

	socket.on('click', (mouseCoordinates: IMouseCoordinates) => {
		if(onClientClick(boardList, mouseCoordinates))
			broadcastBoard();
	});


	socket.on('joinfriendgame', () => {
		if(activeGameId === 0){
			const gameId = Math.random();
			const g = new Game(gameId, socket.id, '');
			activeGameId = gameId;
			sockets[socket.id].gameId = gameId
		}else{
			Game.games[activeGameId].addPlayer(socket.id);
			sockets[socket.id].gameId = activeGameId;
			activeGameId = 0;
		}
	});

	socket.on('disconnect', () => {
		const socketGameId = sockets[socket.id].gameId;
		if(socketGameId !== 0) Game.games[socketGameId].removePlayer();
	});
	socket.on('leavegame', () => {
		const socketGameId = sockets[socket.id].gameId;
		if(socketGameId != 0) Game.games[socketGameId].removePlayer();
	});
});


