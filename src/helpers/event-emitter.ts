import { ListenerInfo } from "../types";

class EventEmitter {
  listeners: ListenerInfo = {};

  on(event: string, listener: Function) {
    const id = Math.random().toString(36).substr(2, 9);

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push({ id, cb: listener });

    return () => {
      this.off(event, id);
    };
  }

  private off(event: string, listenerId: string) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener.id !== listenerId
      );
    }
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => {
        listener.cb(data);
      });
    }
  }
}

export default EventEmitter;
