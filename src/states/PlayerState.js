import { Vector2D } from '../utils/Vector2D.js';
import { createBox } from '../utils/utils.js';

export class PlayerState {
  constructor(player) {
    this.player = player;
    this.boundKeyDownHandler = this.handleKeyDown.bind(this);
    this.boundKeyUpHandler = this.handleKeyUp.bind(this);

  }

  init() {
    this.bindKeyEvents();
  }

  exit() {
    window.removeEventListener('keydown', this.boundKeyDownHandler);
    window.removeEventListener('keyup', this.boundKeyUpHandler);
  }

  update(deltaTime) {
  }

  bindKeyEvents() {
    window.addEventListener('keydown', this.boundKeyDownHandler);
    window.addEventListener('keyup', this.boundKeyUpHandler);
  }

  handleKeyDown(event) {
  }

  handleKeyUp(event) {
  }

  handleMovement(deltaTime) {
  }

  render() {
    const {x, y} = this.player.position;
    const {w, h} = this.player.dimensions;

    createBox(this.player.ctx, x + 10, y, w, h);
  }
}

export class PlayerInitialState extends PlayerState {
  constructor(player, canvas) {
    super(player);
    this.canvas = canvas;
  }

  init() {
    super.init();

    this.player.position = new Vector2D(0,
        this.canvas.height / 2 - this.player.dimensions.h / 2);
    this.player.changeState(new PlayerMovingState(this.player, this.canvas));
  }
}

export class PlayerMovingState extends PlayerState {
  constructor(player, canvas) {
    super(player);
    this.canvas = canvas;
    this.keys = {
      w: false,
      s: false,
      ArrowUp: false,
      ArrowDown: false,
    };
  }

  handleKeyDown(event) {
    if (this.keys.hasOwnProperty(event.key)) {
      this.keys[event.key] = true;
    }
  }

  handleKeyUp(event) {
    if (this.keys.hasOwnProperty(event.key)) {
      this.keys[event.key] = false;
    }
  }

  handleMovement(deltaTime) {
    const moveDistance = this.player._speed * deltaTime * 60;

    if (this.keys.w || this.keys.ArrowUp) {
      this.player._position.y = Math.max(this.player._position.y - moveDistance,
          0);
    }
    if (this.keys.s || this.keys.ArrowDown) {
      this.player._position.y = Math.min(this.player._position.y + moveDistance,
          this.canvas.height - this.player.dimensions.h);
    }
  }

  update(deltaTime) {
    this.handleMovement(deltaTime);
  }
}

export class PlayerPauseState extends PlayerState {
  init() {
    super.init();
  }
}