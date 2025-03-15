import { Vector2D } from '../utils/Vector2D.js';
import { BallInitialState, BallMovingState } from '../states/BallState.js';

export class Ball {
  constructor(canvas, player) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.player = player;

    this._radius = 10;
    this._speed = 20;
    this._position = new Vector2D(0, 0);
    this._velocity = new Vector2D(0, 0);
    this._direction = new Vector2D(0, 0);

    this.state = null;

  }

  get speed() {
    return this._speed;
  }

  get velocity() {
    return this._velocity;
  }

  set velocity(value) {
    this._velocity = value;
  }

  get radius() {
    return this._radius;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
  }

  get direction() {
    return this._direction;
  }

  targetDirection() {
    const targetPosition = new Vector2D(this.canvas.width - this._position.x,
        this.canvas.height - this._position.y);

    this._direction = this._position.direction(targetPosition);

  }

  render() {
    this.state.render();
  }

  reset() {
    this.changeState(new BallInitialState(this, this.player));
  }

  update(deltaTime) {
    this.state.update(deltaTime);
  }

  isMoving() {
    return this.state instanceof BallMovingState;
  }

  changeState(newState) {
    if (this.state) {
      this.state.exit();
    }

    this.state = newState;
    this.state.init();
  }
}