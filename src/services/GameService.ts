class GameService {
    private steps: string[] = [];

  public initSteps() {
    this.steps = [];
  }
  
  public addStep(): void {
    const num = Math.floor(Math.random() * 4) + 1;
    switch (num) {
      case 1:
        this.steps.push("green");
        break;
      case 2:
        this.steps.push("red");
        break;
      case 3:
        this.steps.push("yellow");
        break;
      case 4:
        this.steps.push("blue");
        break;
    }
  }
  public getSteps() {
    return this.steps;
  }
}
  export const gameService = new GameService();