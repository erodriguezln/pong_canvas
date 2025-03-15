import { Player } from './entities/Player.js';
import { Ball } from './entities/Ball.js';
import { EventManager } from './managers/EventManager.js';
import { ScoreManager } from './managers/ScoreManager.js';
import { Enemy } from './entities/Enemy.js';
import { SoundManager } from './managers/SoundManager.js';
import { CollisionManager } from './managers/CollisionManager.js';
import {
  GameMenuState,
  GameInitialState,
  GameOverState,
} from './states/GameState.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 1200;
    this.canvas.height = 600;
    this.canvas.style.border = '2px solid grey';
    this.canvas.style.background = 'black';
    this.ctx = this.canvas.getContext('2d');

    this.eventManager = new EventManager();
    this.scoreManager = new ScoreManager(this.eventManager);
    this.soundManager = new SoundManager(this.eventManager);

    // TODO Probably could change this for a state design.
    this.eventManager.subscribe('Point', () => this.handlePointScored());

    this.player = new Player(this.canvas);
    this.ball = new Ball(this.canvas, this.player);
    this.enemy = new Enemy(this.canvas, this.canvas.width - 20, null);

    this.collisionManager = new CollisionManager(
        this.canvas, this.eventManager,
        this.player, this.enemy, this.ball,
    );

    this.state = null;
    this.changeState(new GameMenuState(this));
  }

  handlePointScored() {
    const scores = this.scoreManager.scores;

    if (scores.playerOne >= 2) {
      this.changeState(new GameOverState(this, "Player One Wins!"));
    } else if (scores.playerTwo >= 2) {
      this.changeState(new GameOverState(this, "Player Two Wins!"));
    } else {
      this.changeState(new GameInitialState(this));
    }
  }

  render() {
    this.state.render();
  }

  update(deltaTime) {
    this.state.update(deltaTime);
  }

  changeState(newState) {
    if (this.state) {
      this.state.exit();
    }

    this.state = newState;
    this.state.init();
  }
}