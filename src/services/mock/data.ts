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
    name: "Lucas Fontana",
    email: "lucas.fontana@aichat.com",
    displayName: "Lucas",
    customPrompt: null,
    createdAt: addDays(new Date(), -25),
  },
];

const projects: Project[] = [
  {
    id: uuid(),
    title: "Finance Tracking",
    description: "Project for tracking and analisys of personal finance.",
    createdAt: addDays(new Date(), -22),
  },
];

const documents: Document[] = [
  {
    id: uuid(),
    name: "expenses.pdf",
    mimetype: "application/pdf",
    sizeInBytes: 234567,
    projectId: projects[0].id,
    createdAt: addDays(new Date(), -22),
  },
];

const chats: Chat[] = [
  { id: uuid(), title: "Space Joke", projectId: null, createdAt: new Date() },
  {
    id: uuid(),
    title: "Breakfast Meal Plan",
    projectId: null,
    createdAt: addDays(new Date(), -3),
  },
  {
    id: uuid(),
    title: "Expenses Summary",
    projectId: projects[0].id,
    createdAt: addDays(new Date(), -5),
  },
];

const userMessageIds = [uuid(), uuid(), uuid()];
const messages: Message[] = [
  {
    id: userMessageIds[0],
    role: "user",
    content: [{ type: "text", text: "Can you tell me a joke about space?" }],
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
        text: "Sure! Here's one:\n\n**Why don't astronauts get hungry after being blasted into space?**  \nBecause they've just had a big launch. 🚀😄\n\nWant another?",
      },
    ],
    feedback: null,
    parentMessageId: userMessageIds[0],
    chatId: chats[0].id,
    createdAt: addSeconds(chats[0].createdAt!, 6),
  },
  {
    id: userMessageIds[1],
    role: "user",
    content: [
      {
        type: "text",
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
        text: "Here's a **simple 7-day breakfast meal plan** you can mix and match. I kept it quick, balanced, and not repetitive:  \n\n---\n\n### **Day 1 - Monday**\n- Greek yogurt with honey  \n- Fresh berries (strawberries, blueberries, raspberries)  \n- Handful of granola  \n\n---\n\n### **Day 2 - Tuesday**\n- Scrambled eggs (2-3)  \n- Whole grain toast  \n- Sliced avocado with a sprinkle of salt and lemon  \n\n---\n\n### **Day 3 - Wednesday**\n- Overnight oats (oats, milk/plant milk, chia seeds, banana)  \n- Topped with a spoon of peanut butter  \n\n---\n\n### **Day 4 - Thursday**\n- Smoothie: spinach, banana, frozen mango, protein powder (optional), almond milk  \n- Handful of almonds or walnuts on the side  \n\n---\n\n### **Day 5 - Friday**\n- Cottage cheese or ricotta with sliced peaches or pineapple  \n- A slice of whole grain bread with nut butter  \n\n---\n\n### **Day 6 - Saturday**\n- Veggie omelette (eggs, spinach, tomato, bell pepper, mushrooms)  \n- Whole grain toast or pita  \n\n---\n\n### **Day 7 - Sunday**\n- Pancakes or waffles (whole wheat if possible)  \n- Topped with fresh fruit instead of syrup  \n- Greek yogurt on the side  \n\n---\n\n👉 This plan is **protein + fiber + healthy fats** focused, so you'll stay full without cooking complicated meals.  \n\nWould you like me to also make a **shopping list** for the whole week so you can prep in advance?",
      },
    ],
    feedback: "like",
    parentMessageId: userMessageIds[1],
    chatId: chats[1].id,
    createdAt: addSeconds(chats[1].createdAt!, 16),
  },
  {
    id: userMessageIds[2],
    role: "user",
    content: [
      {
        type: "document",
        id: documents[0].id,
        name: documents[0].name,
        mimetype: documents[0].mimetype,
      },
      {
        type: "text",
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
        text: "Sure! Here's a summary of your expenses based on the provided document:\n\n---\n\n### **Monthly Expenses Summary**\n\n1. **Housing**: $1,200 (Rent/Mortgage)\n2. **Utilities**: $150 (Electricity, Water, Internet)\n3. **Groceries**: $400\n4. **Transportation**: $100 (Gas, Public Transit)\n5. **Dining Out**: $200\n6. **Entertainment**: $100\n7. **Healthcare**: $80\n8. **Miscellaneous**: $70\n\n---\n\n### **Total Monthly Expenses**: $2,300\n\n### **Key Insights**:\n- Your largest expense is housing, which is typical.\n- Groceries and dining out combined make up a significant portion of your budget; consider meal planning to save more.\n- Entertainment and miscellaneous expenses are relatively low, which is good for discretionary spending.\n\nWould you like me to help you create a budget plan based on this summary?",
      },
    ],
    feedback: null,
    parentMessageId: userMessageIds[2],
    chatId: chats[2].id,
    createdAt: addSeconds(chats[2].createdAt!, 12),
  },
];

export const mockData = { users, projects, documents, chats, messages };
