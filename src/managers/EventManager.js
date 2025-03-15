export class EventManager {
  constructor() {
    this.events = new Map([
      ['Hit', []],
      ['Point', []],
      ['Start', []],
      ['Reset', []],
      ['GameOver', []],
    ]);
  }

  subscribe(event, func) {
    if (!this.events.has(event)) {
      throw new Error(`Event ${event} does not exist`);
    }

    this.events.get(event).push(func);

    // Return function to easily unsubscribe
    return () => this.unsubscribe(event, func);
  }

  unsubscribe(event, func) {
    if (this.events.has(event)) {
      const observers = this.events.get(event);

      this.events.set(
          event,
          observers.filter(observer => observer !== func),
      );
    }
  }

  notify(event, data = null) {
    if (this.events.has(event)) {
      const observers = this.events.get(event);

      observers.forEach(observer => observer(data));
    }
  }
}