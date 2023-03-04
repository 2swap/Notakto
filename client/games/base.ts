import { CanvasElement } from "../canvas/canvas";
import io, {
  Socket,
} from 'socket.io-client';

export class BaseGame extends CanvasElement {
  protected socket: Socket;

  /**
   * Configures the client socket connection.
   */
  constructor() {
    super();
    this.socket = io('localhost:' + 10003);
    // TODO: Figure out production setting.
    // ? io('alexhontz.com', {path:'/Notakto/io'})

    // Issue board request to all clients.
    this.socket.emit('requestBoard');
  }

  /**
   * Emits socket message to restart the game.
   */
  public requestGame() {
    this.socket.emit('restart');
  }
}