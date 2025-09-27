import { NullableArray } from "./types";

export class ArrayUtils {
  static isNullOrEmpty(array: NullableArray): boolean {
    return array == null || array.length === 0;
  }

  static lastOrNull<TItem>(array: TItem[] | null | undefined): TItem | null {
    return array != null && array.length > 0 ? array[array.length - 1] : null;
  }
}
