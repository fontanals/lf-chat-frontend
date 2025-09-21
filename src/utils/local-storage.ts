export class LocalStorageUtils {
  static getItem<T>(key: string): T | null;
  static getItem<T>(key: string, fallbackValue: T): T;
  static getItem<T>(key: string, fallbackValue: T | null = null): T | null {
    const item = localStorage.getItem(key);
    return item != null ? (JSON.parse(item) as T) : fallbackValue;
  }

  static setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
