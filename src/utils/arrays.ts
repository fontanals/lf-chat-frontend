import { NullableArray } from "./types";

export class ArrayUtils {
  static isNullOrEmpty(array: NullableArray): boolean {
    return array == null || array.length === 0;
  }
}
