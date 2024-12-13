export class Helper {
  public delay(ms: number) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
    }, ms);
    });
  }
}

export const helper = new Helper();
