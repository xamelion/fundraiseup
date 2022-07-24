interface IBuffer {
  event: string;
  tags: string[];
  url: string;
  title: string;
  ts: string;
}

class Tracker {
  private static instance: Tracker;
  private buffer: IBuffer[] = [];
  private lastSendTime = 0;
  private locked = false;
  private timeOutSender: ReturnType<typeof setTimeout>;

  constructor() {
    window.addEventListener('beforeunload', () => {
      this.trySender();
    });
  }

  public static getInstance(): Tracker {
    if (!Tracker.instance) {
      Tracker.instance = new Tracker();
    }
    return Tracker.instance;
  }

  public static checkNotResponse(response): void {
    if (!response.ok) {
      throw new Error('Not 2xx response');
    }
  }

  private get isDenied(): boolean {
    const isTooLittleBuffer = this.buffer.length < 3;
    const isTooLittleTime = Date.now() - this.lastSendTime < 1000;
    const isLock = this.locked;

    return (isTooLittleBuffer && isTooLittleTime) || isLock;
  }

  public track(event: string, ...tags: string[]): void {
    const buffer: IBuffer = {
      event,
      tags,
      url: window.location.href,
      title: document.title,
      ts: new Date().toISOString(),
    };

    this.buffer.push(buffer);

    this.sendToServer();
  }

  private sendToServer(): void {
    if (this.isDenied) {
      this.sendToServerFromTimeout(1000);

      return;
    }

    this.trySender();
  }

  private trySender(): void {
    this.timeoutClear();
    this.lock();
    this.updateTime();

    const buffer = this.pullFromBuffer();

    if (buffer.length === 0) {
      this.unlock();

      return;
    }

    this.postTrack(buffer)
      .then(Tracker.checkNotResponse)
      .catch(() => {
        this.appendToBuffer(buffer);
        this.sendToServer();
      })
      .finally(() => {
        this.unlock();
      });
  }

  private updateTime(): void {
    this.lastSendTime = Date.now();
  }

  private appendToBuffer(buffer: IBuffer[]): void {
    this.buffer = [...buffer, ...this.buffer];
  }

  private pullFromBuffer(): IBuffer[] {
    const buffer = [...this.buffer];
    this.buffer = [];

    return buffer;
  }

  private lock(): void {
    this.locked = true;
  }

  private unlock(): void {
    this.locked = false;
  }

  private postTrack(senderBuffer: IBuffer[]): Promise<Response> {
    return fetch('http://localhost:8001/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(senderBuffer),
    });
  }

  private sendToServerFromTimeout(time: number): void {
    this.timeoutClear();

    this.timeOutSender = setTimeout(() => {
      this.sendToServer();
    }, time);
  }

  private timeoutClear(): void {
    if (!this.timeOutSender) {
      return;
    }

    clearTimeout(this.timeOutSender);
  }
}

(window as any).tracker = Tracker.getInstance();
