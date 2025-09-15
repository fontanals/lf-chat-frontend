import { isValid } from "date-fns";

export class SearchParamsUtils {
  static getDate(searchParams: URLSearchParams, key: string): Date | null {
    const parsedValue = new Date(searchParams.get(key) ?? "");

    return isValid(parsedValue) ? parsedValue : null;
  }
}
