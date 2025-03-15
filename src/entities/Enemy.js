import { Paddle } from './Paddle.js';
import { Vector2D } from '../utils/Vector2D.js';
import { EnemyInitialState } from '../states/EnemyState.js';

export class Enemy extends Paddle {

  constructor(canvas, xPosition, yPosition) {
    super(canvas);

    if (xPosition === null) {
      xPosition = this.canvas.width - this._dimensions.w;
    }
    if (yPosition === null) {
      yPosition = this.canvas.height / 2 - this._dimensions.h / 2;
    }
    this.initPosition = new Vector2D(xPosition, yPosition);

    this._predictedBallPosition = null;
  }

  get predictedBallPosition(){
    return this._predictedBallPosition
  }

  set predictedBallPosition(value) {
    this._predictedBallPosition = value;
  }

  update(deltaTime) {
    this.state.update(deltaTime);
  }

  reset(){
    this.changeState(new EnemyInitialState(this, this.initPosition));
  }
}