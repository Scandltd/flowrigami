export default class Observable {
  observers: Map<string, ((data: any) => void)[]>;

  constructor() {
    this.observers = new Map();
  }

  public notify(action: string) {
    const listeners = this.observers.get(action);
    if (listeners) {
      listeners.forEach((observer) => observer(action));
    }
  }

  public subscribe(action: string, func: (data: any) => void) {
      let listeners = this.observers.get(action);
      if (!listeners) {
        listeners = [];
      }

      listeners.push(func);
      this.observers.set(action, listeners);
  }

  public unsubscribe(action: string, func: (data: any) => void) {
    let listeners = this.observers.get(action);
    if (listeners) {
      listeners = listeners.filter((subscriber) => subscriber !== func);
      this.observers.set(action, listeners);
    }
  }
}
