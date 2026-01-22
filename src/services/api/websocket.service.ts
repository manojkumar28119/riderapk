type MessageHandler = (data: unknown) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private connectPromise: Promise<void> | null = null;
  private shouldReconnect = true;

  connect(url: string): Promise<void> {
    // Already connected
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    // Connection already in progress
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.shouldReconnect = true;

    this.connectPromise = new Promise((resolve, reject) => {

      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log("[WS] Connected");
          this.connectPromise = null;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.messageHandlers.forEach((h) => h(data));
          } catch (e) {
            console.error("[WS] Parse error", e);
          }
        };

        this.ws.onerror = (err) => {
          console.warn("[WS] Error (transient)", err);
        };

        this.ws.onclose = () => {
          console.log("[WS] Closed");
          this.ws = null;
          this.connectPromise = null;

          if (this.shouldReconnect) {
            setTimeout(() => this.connect(url), 3000);
          }
        };
      } catch (err) {
        this.connectPromise = null;
        reject(err);
      }
    });

    return this.connectPromise;
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  disconnect() {
    console.log("[WS] Intentional disconnect");
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
    this.connectPromise = null;
    this.messageHandlers = [];
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();
