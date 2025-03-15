import { createCircle, debugLine } from '../utils/utils.js';
import { Vector2D } from '../utils/Vector2D.js';

export class BallState {
  constructor(ball) {
    this.ball = ball;
  }

  init() {
  }

  exit() {
  }

  update(deltaTime) {
  }

  render() {
    const {x, y} = this.ball.position;

    createCircle(this.ball.ctx, x, y, this.ball.radius);
    if (!this.ball.isMoving()) {
      const {x: dx, y: dy} = this.ball.direction;

      debugLine(this.ball.ctx, x, y, dx + x, dy + y);
    }
  }
}

export class BallInitialState extends BallState {
  constructor(ball, player) {
    super(ball);
    this.player = player;
  }

  init() {
    super.init();
    this.ball.velocity = new Vector2D(0, 0);
    this.updateOnPaddlePosition();
  }

  exit() {
    super.exit();
  }

  update(deltaTime) {
    this.updateOnPaddlePosition();
    this.ball.targetDirection();
  }

  updateOnPaddlePosition() {
    const {x, y} = this.player.position;
    const {w, h} = this.player.dimensions;

    this.ball.position.x = x + w + this.ball._radius;
    this.ball.position.y = y + h / 2;
  }
}

export class BallMovingState extends BallState {
  constructor(ball) {
    super(ball);
  }

  init() {
    super.init();

    if (!this.ball.velocity ||
        (this.ball.velocity.x === 0 && this.ball.velocity.y === 0)) {
      const unitVector = this.ball.direction.normalized;

      this.ball.velocity = new Vector2D(
          unitVector.x * this.ball.speed,
          unitVector.y * this.ball.speed,
      );
    }

  }

  exit() {
    super.exit();
  }

  update(deltaTime) {

    this.ball.position = new Vector2D(
        this.ball.position.x + this.ball.velocity.x * deltaTime * 60,
        this.ball.position.y + this.ball.velocity.y * deltaTime * 60);

  }

}

export class BallPausedState extends BallState {
  constructor(ball) {
    super(ball);
    this.savedVelocity = null;
  }

  init() {
    super.init();
    if (this.ball.velocity) {
      this.savedVelocity = new Vector2D(this.ball.velocity.x,
          this.ball.velocity.y);
    } else {
      this.savedVelocity = new Vector2D(0, 0);
    }

    this.ball.velocity = new Vector2D(0, 0);
  }

  exit() {
    super.exit();
    if (this.ball.velocity) {
      this.ball.velocity = this.savedVelocity;
    }
    this.savedVelocity = null;

  }
}