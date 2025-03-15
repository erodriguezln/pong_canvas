import { Vector2D } from '../utils/Vector2D.js';

export class Paddle {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._speed = 16; //18
    this._dimensions = {w: 10, h: 80};

    this._position = new Vector2D(0,
        this.canvas.height / 2 - this._dimensions.h / 2);

    this.state = null;
  }

  get speed() {
    return this._speed;
  }

  get dimensions() {
    const {w, h} = this._dimensions;

    return {w, h};
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
  }

  render() {
    if (this.state) {
      this.state.render();
    }
  }

  reset() {
  }

  changeState(newState) {
    if (this.state) {
      this.state.exit();
    }

    this.state = newState;
    this.state.init();
  }
}