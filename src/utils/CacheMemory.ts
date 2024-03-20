interface CacheData {
  value: any;
  time: number;
}

export class CacheMemory {
  private readonly cache: Map<string, CacheData> = new Map();
  private readonly timer: Map<string, NodeJS.Timeout> = new Map();
  private expire: number = 3_000;

  constructor(expire: number = 3_000) {
    this.expire = expire;
  }

  public set(key: string, value: any) {
    const data = this.cache.get(key);
    if (data) {
      clearTimeout(this.timer.get(key));
    }
    this.cache.set(key, { value, time: Date.now() });
    this.timer.set(key, setTimeout(() => {
      this.cache.delete(key);
      this.timer.delete(key);
    }, this.expire));
  }

  public get(key: string): any {
    const data = this.cache.get(key);
    if (data) {
      return data.value;
    }
    return null;
  }
}