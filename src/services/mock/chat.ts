import { v4 as uuid } from "uuid";
import { Chat } from "../../models/entities/chat";
import { Message } from "../../models/entities/message";
import {
  CreateChatRequest,
  DeleteChatParams,
  GetChatParams,
  GetChatQuery,
  GetChatsQuery,
  SendMessageParams,
  SendMessageRequest,
  UpdateChatParams,
  UpdateChatRequest,
} from "../../models/requests/chat";
import {
  ChatServerSentEvent,
  DeleteChatResponse,
  GetChatResponse,
  GetChatsResponse,
  UpdateChatResponse,
} from "../../models/responses/chat";
import { ApplicationError } from "../../utils/errors";
import { sleep } from "../../utils/functions";
import { IChatService } from "../chat";
import { data } from "./data";

export class MockChatService implements IChatService {
  // private assistantMockMessages = [
  //   "Unfortunately, I can’t answer your message right now… but don’t worry, I’ve hired a team of squirrels to type a response for me. They’re just a little slow. 🐿️💻",
  //   "Unfortunately, I can’t answer your message right now… but I’ve sent a carrier pigeon with my reply. Estimated delivery: 3–5 business days. 🕊️📜",
  //   "Unfortunately, I can’t answer your message right now… but I’m currently in a very intense staring contest with my coffee mug. ☕👀",
  //   "Unfortunately, I can’t answer your message right now… but if you hum loudly into your phone, I might pick it up telepathically. 🔮📱",
  //   "Unfortunately, I can’t answer your message right now… but I promise I’ll get back to you before my Wi-Fi realizes it’s unreliable again. 📶😅",
  // ];
  private assistantMockMessages = [
    `React.js (often just called **React**) is a **JavaScript library** created by Facebook for building **user interfaces**—especially **single-page applications (SPAs)** where the UI updates dynamically without reloading the entire page.  \n\nHere are the key points:  \n\n- **Component-based** → You build reusable pieces of UI called *components*. Each component manages its own state and logic, then React combines them into complex interfaces.  \n- **Declarative** → Instead of telling the browser *how* to update the UI, you describe *what the UI should look like* for a given state, and React takes care of updating it efficiently.  \n- **Virtual DOM** → React uses an in-memory representation of the DOM. When data changes, React compares the new virtual DOM with the old one (*diffing*), and updates only what’s necessary in the real DOM (*reconciliation*), making it fast.  \n- **Unidirectional data flow** → Data flows one way, from parent to child components, making apps easier to reason about and debug.  \n- **Ecosystem** → Often used with libraries like **React Router** (for routing) and **Redux/Zustand/Recoil** (for state management).  \n\n👉 In short: **React helps developers build fast, modular, and interactive UIs with less code and better performance.**  \n\nDo you want me to explain it in a **beginner-friendly analogy** (like Lego blocks), or in a **technical way** (with code examples)?`,
  ];

  async getChats(query?: GetChatsQuery): Promise<GetChatsResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const limit = query?.limit ?? 20;

        const chats = data.chats
          .filter(
            (chat) =>
              query?.search == null ||
              chat.title?.toLowerCase().includes(query.search.toLowerCase())
          )
          .sort(
            (chatA, chatB) =>
              (chatB.createdAt?.getTime() ?? 0) -
              (chatA.createdAt?.getTime() ?? 0)
          );

        const paginatedChats = chats
          .filter(
            (chat) =>
              query?.cursor == null ||
              (chat.createdAt?.getTime() ?? 0) > query.cursor.getTime()
          )
          .slice(0, limit)
          .map((chat) => ({ ...chat }));

        resolve({ chats: paginatedChats, totalChats: chats.length });
      }, 300)
    );
  }

  async getChat(
    params: GetChatParams,
    query?: GetChatQuery
  ): Promise<GetChatResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const chat = data.chats.find((chat) => chat.id === params.chatId);

        if (chat == null) {
          return reject(ApplicationError.notFound());
        }

        resolve({
          chat: {
            ...chat,
            messages: query?.expand?.includes("messages")
              ? data.messages
                  .filter((message) => message.chatId === chat.id)
                  .map((message) => ({ ...message }))
              : undefined,
          },
        });
      }, 300)
    );
  }

  async createChat(
    request: CreateChatRequest,
    onEvent: (event: ChatServerSentEvent) => void
  ): Promise<void> {
    const chat: Chat = {
      id: request.id,
      title: "New Chat",
      createdAt: new Date(),
    };

    const userMessage: Message = {
      id: uuid(),
      role: "user",
      content: request.message,
      chatId: chat.id,
    };

    const assistantMessage: Message = {
      id: uuid(),
      role: "assistant",
      content: "",
      chatId: chat.id,
    };

    data.chats.push(chat);
    data.messages.push(userMessage);

    const messageChunks =
      this.assistantMockMessages[
        Math.floor(Math.random() * this.assistantMockMessages.length)
      ].split(" ");

    onEvent({
      event: "start",
      data: { messageId: assistantMessage.id },
      isDone: false,
    });

    let index = 0;

    for (const messageChunk of messageChunks) {
      assistantMessage.content +=
        index === messageChunks.length - 1 ? messageChunk : messageChunk + " ";

      onEvent({
        event: "delta",
        data: {
          messageId: assistantMessage.id,
          delta:
            index === messageChunks.length - 1
              ? messageChunk
              : messageChunk + " ",
        },
        isDone: false,
      });

      await sleep(50);
      index++;
    }

    data.messages.push(assistantMessage);

    onEvent({
      event: "end",
      data: { messageId: assistantMessage.id },
      isDone: true,
    });
  }

  async sendMessage(
    params: SendMessageParams,
    request: SendMessageRequest,
    onEvent: (event: ChatServerSentEvent) => void
  ): Promise<void> {
    const chatExists = data.chats.some((chat) => chat.id === params.chatId);

    if (!chatExists) {
      throw ApplicationError.notFound();
    }

    const userMessage: Message = {
      id: request.id,
      role: "user",
      content: request.content,
      chatId: params.chatId,
    };

    const assistantMessage: Message = {
      id: uuid(),
      role: "assistant",
      content: "",

      chatId: params.chatId,
    };

    data.messages.push(userMessage);

    const messageChunks =
      this.assistantMockMessages[
        Math.floor(Math.random() * this.assistantMockMessages.length)
      ].split(" ");

    onEvent({
      event: "start",
      data: { messageId: assistantMessage.id },
      isDone: false,
    });

    let index = 0;

    for (const messageChunk of messageChunks) {
      assistantMessage.content +=
        index === messageChunks.length - 1 ? messageChunk : messageChunk + " ";

      onEvent({
        event: "delta",
        data: {
          messageId: assistantMessage.id,
          delta:
            index === messageChunks.length - 1
              ? messageChunk
              : messageChunk + " ",
        },
        isDone: false,
      });

      await sleep(50);
      index++;
    }

    data.messages.push(assistantMessage);

    onEvent({
      event: "end",
      data: { messageId: assistantMessage.id },
      isDone: true,
    });
  }

  async updateChat(
    params: UpdateChatParams,
    request: UpdateChatRequest
  ): Promise<UpdateChatResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const chatExists = data.chats.some((chat) => chat.id === params.chatId);

        if (!chatExists) {
          return reject(ApplicationError.notFound());
        }

        data.chats = data.chats.map((chat) =>
          chat.id === params.chatId ? { ...chat, ...request } : chat
        );

        resolve({ chatId: params.chatId });
      }, 300)
    );
  }

  async deleteChat(params: DeleteChatParams): Promise<DeleteChatResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const chatExists = data.chats.some((chat) => chat.id === params.chatId);

        if (!chatExists) {
          return reject(ApplicationError.notFound());
        }

        data.chats = data.chats.filter((chat) => chat.id !== params.chatId);

        resolve({ chatId: params.chatId });
      }, 300)
    );
  }
}
