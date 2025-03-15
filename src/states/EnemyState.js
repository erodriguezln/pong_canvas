import { Vector2D } from '../utils/Vector2D.js';
import { createBox } from '../utils/utils.js';

export class EnemyState {
  constructor(enemy) {
    this.enemy = enemy;
    this.targetPosition = null;
    this.timeSinceLasUpdate = 0;
    this.targetUpdateInterval = 0.5;
    this.targetOffset = 0;
    this.smoothingFactor = 0.1;
  }

  init() {
  }

  exit() {
  }

  update(deltaTime) {
  }

  handleKeyDown(event) {
  }

  render() {
    const {x, y} = this.enemy.position;
    const {w, h} = this.enemy.dimensions;

    createBox(this.enemy.ctx, x, y, w, h);
  }
}

export class EnemyInitialState extends EnemyState {
  constructor(enemy, position) {
    super(enemy);
    this.position = position;
  }

  init() {
    this.enemy.position = new Vector2D(this.position.x, this.position.y);
    this.enemy.changeState(new EnemyMovingState(this.enemy));
  }
}

export class EnemyMovingState extends EnemyState {
  constructor(enemy) {
    super(enemy);
  }

  init() {
    this.targetPosition = this.enemy.position;

  }

  update(deltaTime) {
    this.updateAIPaddleTargetPosition(deltaTime);
    this.moveAIPaddleToTarget(deltaTime);
  }

  updateAIPaddleTargetPosition(deltaTime) {
    if (!this.enemy.predictedBallPosition) {
      return;
    }

    this.timeSinceLasUpdate += deltaTime;

    if (this.timeSinceLasUpdate > this.targetUpdateInterval) {
      // mul by 2 shifts range to [0, 2)
      // sub 1 shifts range to [-1, 1]
      // random values between -1 to 1
      // Calculate random offset within 40% of paddle height
      const maxRandomOffset = this.enemy.dimensions.h * 0.4;
      this.targetOffset = (Math.random() * 2 - 1) * maxRandomOffset;
      this.timeSinceLasUpdate = 0;
    }

    const predictedBallPosition = this.enemy.predictedBallPosition;

    const idealPosition = new Vector2D(
        predictedBallPosition.x,
        predictedBallPosition.y -
        (this.enemy.dimensions.h / 2 + this.targetOffset),
    );

    // Center paddle on ball's y-position with some randomness
    if (!this.targetPosition) {
      this.targetPosition = idealPosition;
    } else {

      const smoothingAmount = this.smoothingFactor * (deltaTime / 0.016);

      this.targetPosition = new Vector2D(
          this.targetPosition.x + (idealPosition.x - this.targetPosition.x) *
          smoothingAmount,
          this.targetPosition.y + (idealPosition.y - this.targetPosition.y) *
          smoothingAmount,
      );
    }

  }

  moveAIPaddleToTarget(deltaTime) {
    const currentPosition = this.enemy.position;
    const moveDistance = this.enemy.speed * deltaTime * 60;

    const displacement = new Vector2D(
        this.targetPosition.x - currentPosition.x,
        this.targetPosition.y - currentPosition.y,
    );

    const distanceToTarget = displacement.magnitude;

    // only move if not already at the target (within 1 pixel)
    if (distanceToTarget > 1) {
      // unit vector
      const moveDirection = displacement.normalized;

      const newYPosition = Math.max(
          Math.min(currentPosition.y + moveDirection.y * moveDistance,
              this.enemy.canvas.height - this.enemy.dimensions.h), 0);

      this.enemy.position = new Vector2D(this.enemy.position.x, newYPosition);

    }

  }

}

export class EnemyPausedState extends EnemyState {
  init() {
    super.init();
  }
}