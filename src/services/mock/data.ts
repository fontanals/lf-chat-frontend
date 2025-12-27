import { addDays, addSeconds } from "date-fns";
import { v4 as uuid } from "uuid";
import { Chat } from "../../models/entities/chat";
import { Document } from "../../models/entities/document";
import { Message } from "../../models/entities/message";
import { Project } from "../../models/entities/project";
import { User } from "../../models/entities/user";

const users: User[] = [
  {
    id: uuid(),
    name: "Demo User",
    email: "demo@lfchat.com",
    displayName: "Demo",
    customPrompt: null,
    createdAt: addDays(new Date(), -25).toISOString(),
    updatedAt: addDays(new Date(), -25).toISOString(),
  },
];

const projects: Project[] = [
  {
    id: uuid(),
    title: "Finance Tracking",
    description: "Project for tracking and analisys of personal finance.",
    createdAt: addDays(new Date(), -22).toISOString(),
    updatedAt: addDays(new Date(), -22).toISOString(),
  },
];

const documents: Document[] = [
  {
    id: uuid(),
    key: uuid(),
    name: "expenses.pdf",
    mimetype: "application/pdf",
    sizeInBytes: 234567,
    isProcessed: true,
    chatId: null,
    projectId: projects[0].id,
    createdAt: addDays(new Date(), -22).toISOString(),
    updatedAt: addDays(new Date(), -22).toISOString(),
  },
];

const chats: Chat[] = [
  {
    id: uuid(),
    title: "Space Joke",
    projectId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    title: "Breakfast Meal Plan",
    projectId: null,
    createdAt: addDays(new Date(), -3).toISOString(),
  },
  {
    id: uuid(),
    title: "Expenses Summary",
    projectId: projects[0].id,
    createdAt: addDays(new Date(), -5).toISOString(),
  },
  {
    id: uuid(),
    title: "New Chat",
    projectId: null,
    createdAt: addDays(new Date(), -8).toISOString(),
  },
];

const userMessageIds = [uuid(), uuid(), uuid(), uuid()];
const messages: Message[] = [
  {
    id: userMessageIds[0],
    role: "user",
    content: [
      { type: "text", id: uuid(), text: "Can you tell me a joke about space?" },
    ],
    parentMessageId: null,
    chatId: chats[0].id,
    createdAt: chats[0].createdAt,
  },
  {
    id: uuid(),
    role: "assistant",
    content: [
      {
        type: "text",
        id: uuid(),
        text: "Sure! Here's one:\n\n**Why don't astronauts get hungry after being blasted into space?**  \nBecause they've just had a big launch. 🚀😄\n\nWant another?",
      },
    ],
    feedback: null,
    finishReason: "stop",
    parentMessageId: userMessageIds[0],
    chatId: chats[0].id,
    createdAt: addSeconds(chats[0].createdAt!, 6).toISOString(),
  },
  {
    id: userMessageIds[1],
    role: "user",
    content: [
      {
        type: "text",
        id: uuid(),
        text: "Can you give me a simple breakfast meal plan for the week?",
      },
    ],
    parentMessageId: null,
    chatId: chats[1].id,
    createdAt: chats[1].createdAt,
  },
  {
    id: uuid(),
    role: "assistant",
    content: [
      {
        type: "text",
        id: uuid(),
        text: "Here's a **simple 7-day breakfast meal plan** you can mix and match. I kept it quick, balanced, and not repetitive:  \n\n---\n\n### **Day 1 - Monday**\n- Greek yogurt with honey  \n- Fresh berries (strawberries, blueberries, raspberries)  \n- Handful of granola  \n\n---\n\n### **Day 2 - Tuesday**\n- Scrambled eggs (2-3)  \n- Whole grain toast  \n- Sliced avocado with a sprinkle of salt and lemon  \n\n---\n\n### **Day 3 - Wednesday**\n- Overnight oats (oats, milk/plant milk, chia seeds, banana)  \n- Topped with a spoon of peanut butter  \n\n---\n\n### **Day 4 - Thursday**\n- Smoothie: spinach, banana, frozen mango, protein powder (optional), almond milk  \n- Handful of almonds or walnuts on the side  \n\n---\n\n### **Day 5 - Friday**\n- Cottage cheese or ricotta with sliced peaches or pineapple  \n- A slice of whole grain bread with nut butter  \n\n---\n\n### **Day 6 - Saturday**\n- Veggie omelette (eggs, spinach, tomato, bell pepper, mushrooms)  \n- Whole grain toast or pita  \n\n---\n\n### **Day 7 - Sunday**\n- Pancakes or waffles (whole wheat if possible)  \n- Topped with fresh fruit instead of syrup  \n- Greek yogurt on the side  \n\n---\n\n👉 This plan is **protein + fiber + healthy fats** focused, so you'll stay full without cooking complicated meals.  \n\nWould you like me to also make a **shopping list** for the whole week so you can prep in advance?",
      },
    ],
    feedback: "like",
    finishReason: "stop",
    parentMessageId: userMessageIds[1],
    chatId: chats[1].id,
    createdAt: addSeconds(chats[1].createdAt!, 16).toISOString(),
  },
  {
    id: userMessageIds[2],
    role: "user",
    content: [
      { type: "document", id: documents[0].id, name: documents[0].name },
      {
        type: "text",
        id: uuid(),
        text: "Can you summarize my expenses from the document?",
      },
    ],
    parentMessageId: null,
    chatId: chats[2].id,
    createdAt: chats[2].createdAt,
  },
  {
    id: uuid(),
    role: "assistant",
    content: [
      {
        type: "text",
        id: uuid(),
        text: "Sure! Let me read your expenses notes first.",
      },
      {
        type: "tool-call",
        id: uuid(),
        name: "processDocument",
        input: { id: documents[0].id, name: documents[0].name },
        output: { success: true, data: documents[0].id },
      },
      {
        type: "tool-call",
        id: uuid(),
        name: "readDocument",
        input: { id: documents[0].id, name: documents[0].name, query: "" },
        output: { success: true, data: "<document-chunk>...</document-chunk>" },
      },
      {
        type: "text",
        id: uuid(),
        text: "Here's a summary of your expenses based on the provided document:\n\n---\n\n### **Monthly Expenses Summary**\n\n1. **Housing**: $1,200 (Rent/Mortgage)\n2. **Utilities**: $150 (Electricity, Water, Internet)\n3. **Groceries**: $400\n4. **Transportation**: $100 (Gas, Public Transit)\n5. **Dining Out**: $200\n6. **Entertainment**: $100\n7. **Healthcare**: $80\n8. **Miscellaneous**: $70\n\n---\n\n### **Total Monthly Expenses**: $2,300\n\n### **Key Insights**:\n- Your largest expense is housing, which is typical.\n- Groceries and dining out combined make up a significant portion of your budget; consider meal planning to save more.\n- Entertainment and miscellaneous expenses are relatively low, which is good for discretionary spending.\n\nWould you like me to help you create a budget plan based on this summary?",
      },
    ],
    feedback: null,
    finishReason: "stop",
    parentMessageId: userMessageIds[2],
    chatId: chats[2].id,
    createdAt: addSeconds(chats[2].createdAt!, 12).toISOString(),
  },
  {
    id: userMessageIds[3],
    role: "user",
    content: [
      {
        type: "text",
        id: uuid(),
        text: "This message can not be shown because it violates our terms of use.",
      },
    ],
    finishReason: "content-filter",
    parentMessageId: null,
    chatId: chats[3].id,
    createdAt: chats[3].createdAt,
  },
  {
    id: uuid(),
    role: "assistant",
    content: [
      {
        type: "text",
        id: uuid(),
        text: "This message can not be answered because it violates our terms of use.",
      },
    ],
    feedback: null,
    finishReason: "content-filter",
    parentMessageId: userMessageIds[3],
    chatId: chats[3].id,
    createdAt: addSeconds(chats[3].createdAt!, 5).toISOString(),
  },
];

export const mockData = { users, projects, documents, chats, messages };
