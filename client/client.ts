import { Connect4Canvas } from './games/connect4';

// Create game.
const game = new Connect4Canvas();

// Add restart button callback.
const restartBtn = document.getElementById('restart-btn');
if (restartBtn) {
  restartBtn.onclick = () => game.requestGame();
}

// Start game!
game.startDrawLoop();
