export class SoundManager {
  constructor(eventManager) {
    this.hit = new Audio('hit.wav');
    this.menu = new Audio('menu.mp3');
    this.point = new Audio('point.wav');

    this.point.volume = 0.2;

    eventManager.subscribe('Hit', this.playHit.bind(this));
    eventManager.subscribe('Point', this.playPoint.bind(this));

  }

  playHit() {
    this.hit.play();
  }

  playPoint() {
    this.point.play();
  }

  playMenu() {
    this.menu.loop = true;
    this.menu.play();
  }
}