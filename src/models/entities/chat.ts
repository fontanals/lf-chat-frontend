import { Message } from "./message";

export type Chat = {
  id: string;
  title: string;
  createdAt?: Date;
  messages?: Message[];
};
