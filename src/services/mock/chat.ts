import { v4 as uuid } from "uuid";
import { Chat } from "../../models/entities/chat";
import { Message, TextPart } from "../../models/entities/message";
import {
  CreateChatRequest,
  DeleteChatParams,
  GetChatMessagesParams,
  GetChatParams,
  GetChatQuery,
  GetChatsQuery,
  SendMessageParams,
  SendMessageRequest,
  UpdateChatParams,
  UpdateChatRequest,
  UpdateMessageParams,
  UpdateMessageRequest,
} from "../../models/requests/chat";
import {
  DeleteChatResponse,
  GetChatMessagesResponse,
  GetChatResponse,
  GetChatsResponse,
  SendMessageEvent,
  UdpateMessageResponse,
  UpdateChatResponse,
} from "../../models/responses/chat";
import { ApplicationError } from "../../utils/errors";
import { sleep } from "../../utils/functions";
import { IChatService } from "../chat";
import { mockData } from "./data";

const mockMessages = [
  {
    title: "Squirrel Support Team",
    message:
      "Unfortunately, I can't answer your message right now… but don't worry, I've hired a team of squirrels to type a response for me. They're just a little slow. 🐿️💻",
  },
  {
    title: "Express Pigeon Delivery",
    message:
      "Unfortunately, I can't answer your message right now… but I've sent a carrier pigeon with my reply. Estimated delivery: 3-5 business days. 🕊️📜",
  },
  {
    title: "Mug Standoff",
    message:
      "Unfortunately, I can't answer your message right now… but I'm currently in a very intense staring contest with my coffee mug. ☕👀",
  },
  {
    title: "Telepathic Hotline",
    message:
      "Unfortunately, I can't answer your message right now… but if you hum loudly into your phone, I might pick it up telepathically. 🔮📱",
  },
  {
    title: "Wi-Fi's Last Chance",
    message:
      "Unfortunately, I can't answer your message right now… but I promise I'll get back to you before my Wi-Fi realizes it's unreliable again. 📶😅",
  },
  {
    title: "Time-Travel Delay",
    message:
      "Unfortunately, I can't answer your message right now… but I accidentally replied yesterday. Check your inbox in the past. ⏳🌀",
  },
  {
    title: "Alien Negotiations",
    message:
      "Unfortunately, I can't answer your message right now… but I'm in the middle of peace talks with extraterrestrials. 👽🤝🌌",
  },
  {
    title: "Ninja Training Break",
    message:
      "Unfortunately, I can't answer your message right now… but I'm practicing my ninja disappearing act. If you don't see me, it's working. 🥷💨",
  },
  {
    title: "Dragon-Sitting Duty",
    message:
      "Unfortunately, I can't answer your message right now… but I promised to babysit a dragon, and it's a little clingy. 🐉🍼",
  },
  {
    title: "Parallel Universe Login",
    message:
      "Unfortunately, I can't answer your message right now… but my account is currently logged in from a parallel dimension. 🌌🔑",
  },
  {
    title: "Robot Uprising",
    message:
      "Unfortunately, I can't answer your message right now… but my toaster just declared itself emperor and I need to negotiate. 🤖🍞",
  },
  {
    title: "Spy Mission Cover",
    message:
      "Unfortunately, I can't answer your message right now… but I'm undercover at a sandwich shop. Classified stuff. 🕵️🥪",
  },
  {
    title: "Zombie Survival Drill",
    message:
      "Unfortunately, I can't answer your message right now… but I'm testing my zombie escape plan. 🧟🏃‍♂️",
  },
  {
    title: "Unicorn Parade",
    message:
      "Unfortunately, I can't answer your message right now… but there's a unicorn parade outside and I can't miss it. 🦄🎉",
  },
  {
    title: "Invisible Mode",
    message:
      "Unfortunately, I can't answer your message right now… but I accidentally turned myself invisible and can't find the keyboard. 👻⌨️",
  },
  {
    title: "Penguin Conference",
    message:
      "Unfortunately, I can't answer your message right now… but I'm attending a very serious penguin conference in Antarctica. 🐧❄️",
  },
  {
    title: "Quantum Coffee Break",
    message:
      "Unfortunately, I can't answer your message right now… but my coffee exists in both full and empty states, and I must observe it. ☕⚛️",
  },
  {
    title: "Wizard Exam",
    message:
      "Unfortunately, I can't answer your message right now… but I'm taking my wizard finals and one wrong spell could turn me into a frog. 🧙‍♂️🐸",
  },
  {
    title: "Octopus Typing Contest",
    message:
      "Unfortunately, I can't answer your message right now… but I challenged an octopus to a typing competition. It's winning. 🐙⌨️",
  },
  {
    title: "Portal Maintenance",
    message:
      "Unfortunately, I can't answer your message right now… but I'm fixing a glitchy portal before my socks get lost in another dimension again. 🌀🧦",
  },
];

export class MockChatService implements IChatService {
  async getChats(query?: GetChatsQuery): Promise<GetChatsResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const limit = query?.limit ?? 20;

        const chats = mockData.chats
          .filter(
            (chat) =>
              (query?.search == null ||
                chat.title
                  ?.toLowerCase()
                  .includes(query.search.toLowerCase())) &&
              (query?.projectId == null || chat.projectId === query.projectId)
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
        const chat = mockData.chats.find((chat) => chat.id === params.chatId);

        if (chat == null) {
          return reject(ApplicationError.notFound());
        }

        resolve({
          ...chat,
          project: query?.expand?.includes("project")
            ? mockData.projects.find((project) => project.id === chat.projectId)
            : undefined,
        });
      }, 300)
    );
  }

  async getChatMessages(
    params: GetChatMessagesParams
  ): Promise<GetChatMessagesResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const chatExists = mockData.chats.some(
          (chat) => chat.id === params.chatId
        );

        if (!chatExists) {
          return reject(ApplicationError.notFound());
        }

        const messages = mockData.messages
          .filter((message) => message.chatId === params.chatId)
          .map((message) => ({ ...message }));

        const latestPath: string[] = [];
        const rootMessageIds: string[] = [];
        const messagesMap: Record<string, Message> = {};

        messages.forEach((message) => {
          message.childrenMessageIds = [];
          messagesMap[message.id] = message;

          if (message.parentMessageId != null) {
            const parentMessage = messagesMap[message.parentMessageId];

            if (parentMessage != null) {
              parentMessage.childrenMessageIds!.push(message.id);
            }
          } else {
            rootMessageIds.push(message.id);
          }
        });

        let currentMessage = messages[messages.length - 1] as
          | Message
          | undefined;

        while (currentMessage != null) {
          latestPath.unshift(currentMessage.id);
          currentMessage =
            currentMessage.parentMessageId != null
              ? messagesMap[currentMessage.parentMessageId]
              : undefined;
        }

        resolve({ latestPath, rootMessageIds, messages: messagesMap });
      }, 300)
    );
  }

  async createChat(
    request: CreateChatRequest,
    onEvent: (event: SendMessageEvent) => void
  ): Promise<void> {
    const mockMessage =
      mockMessages[Math.floor(Math.random() * mockMessages.length)];

    const chat: Chat = {
      id: request.id,
      title: mockMessage.title,
      projectId: request.projectId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userMessage: Message = {
      id: uuid(),
      role: "user",
      content: request.message,
      parentMessageId: null,
      chatId: chat.id,
      createdAt: chat.createdAt,
      updatedAt: chat.createdAt,
    };

    const assistantMessage: Message = {
      id: uuid(),
      role: "assistant",
      content: [{ type: "text", text: mockMessage.message }],
      parentMessageId: userMessage.id,
      chatId: chat.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockData.chats.push(chat);
    mockData.messages.push(userMessage);

    const messageChunks = mockMessage.message.split(" ");

    onEvent({ event: "start" });

    onEvent({
      event: "message-start",
      data: { type: "message-start", messageId: assistantMessage.id },
    });

    onEvent({
      event: "text-start",
      data: { type: "text-start", messageId: assistantMessage.id },
    });

    const messageContentPart: TextPart = { type: "text", text: "" };

    let messageChunkIndex = 0;

    for (const messageChunk of messageChunks) {
      messageContentPart.text +=
        messageChunkIndex < messageChunks.length - 1
          ? messageChunk + " "
          : messageChunk;

      onEvent({
        event: "text-delta",
        data: {
          type: "text-delta",
          messageId: assistantMessage.id,
          delta:
            messageChunkIndex < messageChunks.length - 1
              ? messageChunk + " "
              : messageChunk,
        },
      });

      await sleep(50);

      messageChunkIndex++;
    }

    onEvent({
      event: "text-end",
      data: { type: "text-end", messageId: assistantMessage.id },
    });

    onEvent({
      event: "message-end",
      data: { type: "message-end", messageId: assistantMessage.id },
    });

    mockData.messages.push(assistantMessage);

    onEvent({ event: "end" });
  }

  async sendMessage(
    params: SendMessageParams,
    request: SendMessageRequest,
    onEvent: (event: SendMessageEvent) => void
  ): Promise<void> {
    const chatExists = mockData.chats.some((chat) => chat.id === params.chatId);

    if (!chatExists) {
      throw ApplicationError.notFound();
    }

    const mockMessage =
      mockMessages[Math.floor(Math.random() * mockMessages.length)];

    const userMessage: Message = {
      id: request.id,
      role: "user",
      content: request.content,
      parentMessageId: request.parentMessageId,
      chatId: params.chatId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const assistantMessage: Message = {
      id: uuid(),
      role: "assistant",
      content: [{ type: "text", text: mockMessage.message }],
      parentMessageId: userMessage.id,
      chatId: params.chatId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockData.messages.push(userMessage);

    const messageChunks = mockMessage.message.split(" ");

    onEvent({ event: "start" });

    onEvent({
      event: "message-start",
      data: { type: "message-start", messageId: assistantMessage.id },
    });

    onEvent({
      event: "text-start",
      data: { type: "text-start", messageId: assistantMessage.id },
    });

    const messageContentPart: TextPart = { type: "text", text: "" };

    let messageChunkIndex = 0;

    for (const messageChunk of messageChunks) {
      messageContentPart.text +=
        messageChunkIndex < messageChunks.length - 1
          ? messageChunk + " "
          : messageChunk;

      onEvent({
        event: "text-delta",
        data: {
          type: "text-delta",
          messageId: assistantMessage.id,
          delta:
            messageChunkIndex < messageChunks.length - 1
              ? messageChunk + " "
              : messageChunk,
        },
      });

      await sleep(50);

      messageChunkIndex++;
    }

    onEvent({
      event: "text-end",
      data: { type: "text-end", messageId: assistantMessage.id },
    });

    onEvent({
      event: "message-end",
      data: { type: "message-end", messageId: assistantMessage.id },
    });

    mockData.messages.push(assistantMessage);

    onEvent({ event: "end" });
  }

  async updateChat(
    params: UpdateChatParams,
    request: UpdateChatRequest
  ): Promise<UpdateChatResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const chatExists = mockData.chats.some(
          (chat) => chat.id === params.chatId
        );

        if (!chatExists) {
          return reject(ApplicationError.notFound());
        }

        mockData.chats = mockData.chats.map((chat) =>
          chat.id === params.chatId
            ? { ...chat, ...request, updatedAt: new Date() }
            : chat
        );

        resolve(params.chatId);
      }, 300)
    );
  }

  async updateMessage(
    params: UpdateMessageParams,
    request: UpdateMessageRequest
  ): Promise<UdpateMessageResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const messageExists = mockData.messages.some(
          (message) => message.id === params.messageId
        );

        if (!messageExists) {
          return reject(ApplicationError.notFound());
        }

        mockData.messages = mockData.messages.map((message) =>
          message.id === params.messageId ? { ...message, ...request } : message
        );

        resolve(params.messageId);
      }, 300)
    );
  }

  async deleteChat(params: DeleteChatParams): Promise<DeleteChatResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const chatExists = mockData.chats.some(
          (chat) => chat.id === params.chatId
        );

        if (!chatExists) {
          return reject(ApplicationError.notFound());
        }

        mockData.messages = mockData.messages.filter(
          (message) => message.chatId !== params.chatId
        );

        mockData.chats = mockData.chats.filter(
          (chat) => chat.id !== params.chatId
        );

        resolve(params.chatId);
      }, 300)
    );
  }
}
