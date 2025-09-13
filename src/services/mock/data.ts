import { addDays, addSeconds } from "date-fns";
import { v4 as uuid } from "uuid";
import { Chat } from "../../models/entities/chat";
import { Message } from "../../models/entities/message";
import { Session } from "../../models/entities/session";
import { User } from "../../models/entities/user";

const users: User[] = [
  {
    id: uuid(),
    name: "Lucas Fontana",
    email: "lucas.fontana@aichat.com",
    displayName: "Lucas",
    customPreferences: null,
    createdAt: addDays(new Date(), -25),
  },
];

const sessions: Session[] = [
  { id: uuid(), userId: users[0].id, createdAt: addDays(new Date(), -3) },
];

const chats: Chat[] = [
  { id: uuid(), title: "Space Joke", createdAt: new Date() },
  {
    id: uuid(),
    title: "Exploring React.js",
    createdAt: addDays(new Date(), -1),
  },
  {
    id: uuid(),
    title: "Breakfast Meal Plan",
    createdAt: addDays(new Date(), -3),
  },
];

const messages: Message[] = [
  {
    id: uuid(),
    role: "user",
    content: "Can you tell me a joke about space?",
    chatId: chats[0].id,
    createdAt: chats[0].createdAt,
  },
  {
    id: uuid(),
    role: "assistant",
    content: `Sure! Here's one:\n\n**Why don’t astronauts get hungry after being blasted into space?**  \nBecause they’ve just had a big launch. 🚀😄\n\nWant another?`,
    chatId: chats[0].id,
    createdAt: addSeconds(chats[0].createdAt!, 6),
  },
  {
    id: uuid(),
    role: "user",
    content: "What is React.js?",
    chatId: chats[1].id,
    createdAt: chats[1].createdAt,
  },
  {
    id: uuid(),
    role: "assistant",
    content: `React.js (often just called **React**) is a **JavaScript library** created by Facebook for building **user interfaces**—especially **single-page applications (SPAs)** where the UI updates dynamically without reloading the entire page.  \n\nHere are the key points:  \n\n- **Component-based** → You build reusable pieces of UI called *components*. Each component manages its own state and logic, then React combines them into complex interfaces.  \n- **Declarative** → Instead of telling the browser *how* to update the UI, you describe *what the UI should look like* for a given state, and React takes care of updating it efficiently.  \n- **Virtual DOM** → React uses an in-memory representation of the DOM. When data changes, React compares the new virtual DOM with the old one (*diffing*), and updates only what’s necessary in the real DOM (*reconciliation*), making it fast.  \n- **Unidirectional data flow** → Data flows one way, from parent to child components, making apps easier to reason about and debug.  \n- **Ecosystem** → Often used with libraries like **React Router** (for routing) and **Redux/Zustand/Recoil** (for state management).  \n\n👉 In short: **React helps developers build fast, modular, and interactive UIs with less code and better performance.**  \n\nDo you want me to explain it in a **beginner-friendly analogy** (like Lego blocks), or in a **technical way** (with code examples)?`,
    chatId: chats[1].id,
    createdAt: addSeconds(chats[1].createdAt!, 19),
  },
  {
    id: uuid(),
    role: "user",
    content: "Can you give me a simple breakfast meal plan for the week?",
    chatId: chats[2].id,
    createdAt: chats[2].createdAt,
  },
  {
    id: uuid(),
    role: "assistant",
    content: `Here’s a **simple 7-day breakfast meal plan** you can mix and match. I kept it quick, balanced, and not repetitive:  \n\n---\n\n### **Day 1 – Monday**\n- Greek yogurt with honey  \n- Fresh berries (strawberries, blueberries, raspberries)  \n- Handful of granola  \n\n---\n\n### **Day 2 – Tuesday**\n- Scrambled eggs (2–3)  \n- Whole grain toast  \n- Sliced avocado with a sprinkle of salt and lemon  \n\n---\n\n### **Day 3 – Wednesday**\n- Overnight oats (oats, milk/plant milk, chia seeds, banana)  \n- Topped with a spoon of peanut butter  \n\n---\n\n### **Day 4 – Thursday**\n- Smoothie: spinach, banana, frozen mango, protein powder (optional), almond milk  \n- Handful of almonds or walnuts on the side  \n\n---\n\n### **Day 5 – Friday**\n- Cottage cheese or ricotta with sliced peaches or pineapple  \n- A slice of whole grain bread with nut butter  \n\n---\n\n### **Day 6 – Saturday**\n- Veggie omelette (eggs, spinach, tomato, bell pepper, mushrooms)  \n- Whole grain toast or pita  \n\n---\n\n### **Day 7 – Sunday**\n- Pancakes or waffles (whole wheat if possible)  \n- Topped with fresh fruit instead of syrup  \n- Greek yogurt on the side  \n\n---\n\n👉 This plan is **protein + fiber + healthy fats** focused, so you’ll stay full without cooking complicated meals.  \n\nWould you like me to also make a **shopping list** for the whole week so you can prep in advance?`,
    chatId: chats[2].id,
    createdAt: addSeconds(chats[2].createdAt!, 16),
  },
];

export const data = { users, sessions, chats, messages };
