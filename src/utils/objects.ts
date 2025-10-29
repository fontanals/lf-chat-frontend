export class ObjectUtils {
  static isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
  }
}
