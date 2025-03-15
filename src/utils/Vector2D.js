export class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get position() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  set position({x, y}) {
    this.x = x;
    this.y = y;
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get normalized() {
    const magnitude = this.magnitude;

    return new Vector2D(this.x / magnitude, this.y / magnitude);
  }

  direction(destine) {
    return new Vector2D(
        destine.x - this.x,
        destine.y - this.y
    );
  }
}