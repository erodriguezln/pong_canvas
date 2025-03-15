import { Paddle } from './Paddle.js';
import { PlayerInitialState } from '../states/PlayerState.js';

export class Player extends Paddle {
  constructor(canvas) {
    super(canvas);
  }

  update(deltaTime) {
    this.state.update(deltaTime);
  }

  reset() {
    this.changeState(new PlayerInitialState(this, this.canvas));
  }
}