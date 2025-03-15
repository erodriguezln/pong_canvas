import { Vector2D } from '../utils/Vector2D.js';

export class CollisionManager {
  constructor(canvas, eventManager, player, enemy, ball) {
    this.canvas = canvas;
    this.player = player;
    this.enemy = enemy;
    this.ball = ball;

    this.maxBounceAngle = Math.PI / 6; // 30 degrees
    this.speedIncreaseFactor = 1.05;
    this.maxSpeed = this.ball.speed * 2;
    this.eventManager = eventManager;

  }

  checkBallWallCollision() {
    const ball = this.ball;
    const position = ball.position;
    const radius = ball.radius;

    if (position.x - radius <= 0) {
      this.reset();
      this.eventManager.notify('Point', {player: 'playerTwo'});
    } else if (position.x + radius >= this.canvas.width) {
      this.reset();
      this.eventManager.notify('Point', {player: 'playerOne'});
    }

    if (position.y - radius <= 0) {
      ball.position.y = radius; // Prevents sticking
      ball.velocity = new Vector2D(ball.velocity.x, -ball.velocity.y);
      this.eventManager.notify('Hit');
    } else if (position.y + radius >= this.canvas.height) {
      ball.position.y = this.canvas.height - radius;
      ball.velocity = new Vector2D(ball.velocity.x, -ball.velocity.y);
      this.eventManager.notify('Hit');
    }

  }

  checkCollisionBetweenSphereAndBox(paddle) {
    const ball = this.ball;
    const radius = ball.radius;

    const nextBallX = ball.position.x + ball.velocity.x;
    const nextBallY = ball.position.y + ball.velocity.y;

    const paddleMinY = paddle.position.y;
    const paddleMaxY = paddle.position.y + paddle.dimensions.h;

    const paddleMinX = paddle.position.x;
    const paddleMaxX = paddle.position.x + paddle.dimensions.w;

    let closestX = Math.max(paddleMinX, Math.min(nextBallX, paddleMaxX));
    let closestY = Math.max(paddleMinY, Math.min(nextBallY, paddleMaxY));

    let dx = closestX - nextBallX;
    let dy = closestY - nextBallY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < radius;

  }


  setDirectionAfterCollision(paddle) {
    const ball = this.ball;
    const radius = ball.radius;

    const isPaddleOnLeftSide = paddle.position.x < this.canvas.width / 2;
    const horizontalDirection = isPaddleOnLeftSide ? 1 : -1;

    const paddleHeight = paddle.dimensions.h;
    const paddleCenter = paddle.position.y + paddleHeight / 2;

    const currentSpeed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
    const newSpeed = Math.min(currentSpeed * this.speedIncreaseFactor,
        this.maxSpeed);

    const normalizedHitPosition = (ball.position.y - paddleCenter) /
        (paddleHeight / 2);

    const bounceAngle = normalizedHitPosition * this.maxBounceAngle;

    const offset = isPaddleOnLeftSide ? paddle.dimensions.w : 0;

    ball.position = new Vector2D(paddle.position.x + offset, ball.position.y);

    ball.velocity = new Vector2D(
        Math.cos(bounceAngle) * newSpeed * horizontalDirection,
        Math.sin(bounceAngle) * newSpeed,
    );

  }

  checkBallPaddleCollision() {
    const ball = this.ball;
    const player = this.player;
    const enemy = this.enemy;

    if (ball.position.x > this.canvas.width / 2) {
      const isColliding = this.checkCollisionBetweenSphereAndBox(enemy);
      if (isColliding) {
        this.eventManager.notify('Hit');
        this.setDirectionAfterCollision(enemy);
      }
    } else {
      const isColliding = this.checkCollisionBetweenSphereAndBox(player);
      if (isColliding) {
        this.eventManager.notify('Hit');
        this.setDirectionAfterCollision(player);
      }
    }
  }

  predictBallPath() {
    const ball = this.ball;

    const velocity = new Vector2D(ball.velocity.x, ball.velocity.y);
    let predictedPosition = new Vector2D(ball.position.x, ball.position.y);

    let distance;
    const maxDistance = this.canvas.width;

    for (distance = 0; distance < maxDistance; distance++) {
      predictedPosition.x += velocity.x;
      predictedPosition.y += velocity.y;

      if (predictedPosition.x <= 0 || predictedPosition.x >=
          this.canvas.width || predictedPosition.y <= 0 ||
          predictedPosition.y >= this.canvas.height) {
        return predictedPosition;
      }
    }
    return predictedPosition;
  }

  reset() {
    this.ball.start = false;
    this.player.reset();
    this.enemy.reset();
    this.ball.reset();

  }

  update(deltaTime) {
    if (this.ball.isMoving()) {
      this.checkBallWallCollision();
      this.checkBallPaddleCollision();
    }
  }
}