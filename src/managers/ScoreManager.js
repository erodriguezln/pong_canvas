export class ScoreManager {
  constructor(eventManager) {
    this.playerOneScore = 0;
    this.playerTwoScore = 0;

    eventManager.subscribe('Point', this.addPoint.bind(this));
    eventManager.subscribe('Reset', this.reset.bind(this));
  }

  get scores() {
    return {
      playerOne: this.playerOneScore,
      playerTwo: this.playerTwoScore,
    };
  }

  addPoint(data) {
    if (data.player === 'playerOne') {
      this.playerOneScore += 1;
    } else if (data.player === 'playerTwo') {
      this.playerTwoScore += 1;
    }
  }

  reset() {
    this.playerOneScore = 0;
    this.playerTwoScore = 0;
  }
}