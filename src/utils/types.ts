import { ApplicationError } from "./errors";

export type NullableString = string | null | undefined;

export type NullableArray<T = unknown> = T[] | null | undefined;

export type ServerSentEvent<TEvent = string, TData = unknown> = {
  event: TEvent;
  data: TData;
  isDone: boolean;
};

export type ErrorServerSentEvent = ServerSentEvent<"error", ApplicationError>;
