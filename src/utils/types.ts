import { ApplicationError } from "./errors";

export type NullableString = string | null | undefined;

export type NullableArray<TItem = unknown> = TItem[] | null | undefined;

export type ErrorServerSentEvent = { event: "error"; error: ApplicationError };

export type ServerSentEvent<TEvent extends String = String, TData = unknown> =
  | { event: "start" }
  | { event: TEvent; data: TData }
  | { event: "end" }
  | ErrorServerSentEvent;
