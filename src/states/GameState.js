import { dottedLine, drawScore, drawText } from '../utils/utils.js';
import {
  PlayerInitialState,
  PlayerMovingState,
  PlayerPauseState,
} from './PlayerState.js';
import {
  EnemyInitialState,
  EnemyMovingState,
  EnemyPausedState,
} from './EnemyState.js';
import {
  BallInitialState,
  BallMovingState,
  BallPausedState,
} from './BallState.js';

export class GameState {
  constructor(game) {
    this.game = game;
    this.boundKeyDownHandler = this.handleKeyDown.bind(this);

  }

  init() {
    this.bindKeyEvents();
  }

  update(deltaTime) {

  }

  handleKeyDown() {

  }

  bindKeyEvents() {
    window.addEventListener('keydown', this.boundKeyDownHandler);
  }

  render() {

  }

  exit() {
    window.removeEventListener('keydown', this.boundKeyDownHandler);
  }
}

export class GameMenuState extends GameState {
  init() {
    super.init();

    //this.game.soundManager.playMenu();
    this.game.scoreManager.reset();
  }

  exit() {
    super.exit();
  }

  update(deltaTime) {
    this.render();
  }

  render() {
    this.game.ctx.clearRect(0, 0, this.game.canvas.width,
        this.game.canvas.height);
    drawText(this.game.ctx, this.game.canvas.width / 2,
        this.game.canvas.height / 3.5, 'PONG', '100');
    drawText(this.game.ctx, this.game.canvas.width / 2,
        this.game.canvas.height - 150, 'Press ENTER to start', '30');
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.game.changeState(new GameInitialState(this.game));
    }
  }
}

export class GameInitialState extends GameState {
  exit() {
    super.exit();
  }

  init() {
    super.init();

    this.game.player.changeState(
        new PlayerInitialState(this.game.player, this.game.canvas));

    this.game.enemy.changeState(
        new EnemyInitialState(this.game.enemy, this.game.enemy.initPosition));

    this.game.ball.changeState(
        new BallInitialState(this.game.ball, this.game.player));
  }

  update(deltaTime) {
    this.render();

    this.game.player.update(deltaTime);
    this.game.enemy.update(deltaTime);
    this.game.ball.update(deltaTime);

  }

  render() {
    this.game.ctx.clearRect(0, 0, this.game.canvas.width,
        this.game.canvas.height);
    dottedLine(this.game.ctx, this.game.canvas.width / 2,
        this.game.canvas.height);

    drawScore(this.game.ctx, (this.game.canvas.width / 2) - 50, 50,
        this.game.scoreManager.scores.playerOne);
    drawScore(this.game.ctx, (this.game.canvas.width / 2) + 50, 50,
        this.game.scoreManager.scores.playerTwo);

    this.game.player.render();
    this.game.enemy.render();
    this.game.ball.render();
  }

  handleKeyDown(event) {
    if (event.key === ' ') {
      this.game.changeState(new GameMovingState(this.game));
    }
  }
}

export class GameMovingState extends GameState {
  exit() {
    super.exit();
  }

  init() {
    super.init();

    this.game.player.changeState(
        new PlayerMovingState(this.game.player, this.game.canvas));

    this.game.enemy.changeState(
        new EnemyMovingState(this.game.enemy));

    this.game.ball.changeState(
        new BallMovingState(this.game.ball));
  }

  update(deltaTime) {
    this.render();

    this.game.collisionManager.update(deltaTime);
    const predictedPosition = this.game.collisionManager.predictBallPath();
    this.game.player.predictedBallPosition = predictedPosition;
    this.game.enemy.predictedBallPosition = predictedPosition;

    this.game.player.update(deltaTime);
    this.game.enemy.update(deltaTime);
    this.game.ball.update(deltaTime);

  }

  render() {
    this.game.ctx.clearRect(0, 0, this.game.canvas.width,
        this.game.canvas.height);
    dottedLine(this.game.ctx, this.game.canvas.width / 2,
        this.game.canvas.height);

    drawScore(this.game.ctx, (this.game.canvas.width / 2) - 50, 50,
        this.game.scoreManager.scores.playerOne);
    drawScore(this.game.ctx, (this.game.canvas.width / 2) + 50, 50,
        this.game.scoreManager.scores.playerTwo);

    this.game.player.render();
    this.game.enemy.render();
    this.game.ball.render();
  }

  handleKeyDown(event) {
    if (event.key === 'Escape' &&
        !(this.game.state instanceof GamePausedState)) {
      this.game.changeState(new GamePausedState(this.game, this));
    }
  }
}

export class GamePausedState extends GameState {
  constructor(game, previousState) {
    super(game);
    // only necessary for game states that can be paused
    this.previousStateClass = previousState.constructor;
  }

  render() {
    drawText(this.game.ctx, this.game.canvas.width / 2,
        this.game.canvas.height / 2, 'PAUSED', '40');
  }

  update() {
    this.render();
  }

  init() {
    super.init();

    this.game.ball.changeState(new BallPausedState(this.game.ball));
    this.game.player.changeState(new PlayerPauseState(this.game.player));
    this.game.enemy.changeState(new EnemyPausedState(this.game.enemy));
  }

  exit() {
    super.exit();
  }

  handleKeyDown(event) {
    if (event.key === 'Escape' &&
        (this.game.state instanceof GamePausedState)) {

      if (this.previousStateClass === GameMovingState) {
        this.game.changeState(new GameMovingState(this.game));

      }

    }
  }

}

export class GameOverState extends GameState {
  constructor(game, winner) {
    super(game);
    this.winner = winner;

    setTimeout(() => {
      this.game.changeState(new GameMenuState(this.game));
    }, 2000);
  }

  init() {
    super.init();
  }

  exit() {
    super.exit();
  }

  render() {
    drawText(this.game.ctx, this.game.canvas.width / 2,
        this.game.canvas.height / 2, this.winner, '40');
  }

  update() {
    this.render();
  }

}