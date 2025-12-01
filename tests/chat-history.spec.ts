import { expect, test } from "@playwright/test";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import { Chat } from "../src/models/entities/chat";
import { Message } from "../src/models/entities/message";
import { clearTestData, createTestData } from "./utils";

test.describe("Chat History", () => {
  test.describe.configure({ mode: "serial" });

  const userId = randomUUID();

  const chats: Chat[] = Array.from({ length: 30 }, (_, index) => ({
    id: randomUUID(),
    title: `Chat ${index + 1}`,
    projectId: null,
    userId,
    createdAt: addDays(new Date(), -100 + index).toISOString(),
    updatedAt: addDays(new Date(), -100 + index).toISOString(),
  }));

  const messages: Message[] = chats.flatMap((chat, index) => {
    const userMessageId = randomUUID();

    return [
      {
        id: userMessageId,
        role: "user",
        content: [
          {
            type: "text",
            id: randomUUID(),
            text: `Chat ${index + 1} User Message`,
          },
        ],
        feedback: null,
        finishReason: null,
        parentMessageId: null,
        chatId: chat.id,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
      {
        id: randomUUID(),
        role: "assistant",
        content: [
          {
            type: "text",
            id: randomUUID(),
            text: `Chat ${index + 1} Assistant Message`,
          },
        ],
        feedback: null,
        finishReason: "stop",
        parentMessageId: userMessageId,
        chatId: chat.id,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    ];
  });

  test.beforeEach(async ({ page, request }) => {
    await createTestData({
      users: [
        {
          id: userId,
          name: "User 1",
          email: "user1@example.com",
          password: "password",
          displayName: "User 1",
          customPrompt: null,
          verificationToken: null,
          recoveryToken: null,
          isVerified: true,
          createdAt: addDays(new Date(), -100).toISOString(),
          updatedAt: addDays(new Date(), -100).toISOString(),
        },
      ],
      chats,
      messages,
    });

    const response = await request.post(
      `${process.env.VITE_API_BASE_URL}/signin`,
      { data: { email: "user1@example.com", password: "password" } }
    );

    if (!response.ok()) {
      throw new Error(
        `Sign in failed: ${response.status()} ${await response.text()}`
      );
    }

    const storageState = await request.storageState();

    await page.context().addCookies(storageState.cookies);

    await page.goto("/");
  });

  test.afterEach(async () => {
    await clearTestData();
  });

  test("view previous chats", async ({ page }) => {
    await expect(page.getByText(/previous chats/i)).toBeVisible();

    const chatLinks = page.locator('a[href^="/chats/"]');

    await expect(chatLinks).toHaveCount(25);

    for (let index = 0; index < 25; index++) {
      await expect(chatLinks.nth(index)).toContainText(chats[29 - index].title);
    }

    await expect(
      page.getByRole("link", { name: /view complete history/i })
    ).toBeVisible();

    await chatLinks.first().click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Chat 30 User Message"
    );

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).toContainText(
      "Chat 30 Assistant Message"
    );

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);
  });

  test("view complete chat history", async ({ page }) => {
    await page.getByRole("link", { name: /chat history/i }).click();

    await page.waitForURL("/history");

    await expect(page.getByText(/30 chats found/)).toBeVisible();

    let chatLinks = page
      .getByTestId("history-chat-list")
      .locator('a[href^="/chats/"]');

    await expect(chatLinks).toHaveCount(25);

    for (let index = 0; index < 25; index++) {
      await expect(chatLinks.nth(index)).toContainText(chats[29 - index].title);
    }

    await expect(
      page.getByRole("button", { name: /load more/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /load more/i }).click();

    chatLinks = page
      .getByTestId("history-chat-list")
      .locator('a[href^="/chats/"]');

    await expect(chatLinks).toHaveCount(30);

    for (let index = 0; index < 30; index++) {
      await expect(chatLinks.nth(index)).toContainText(chats[29 - index].title);
    }

    await page.getByPlaceholder(/search/i).fill("2");

    const targetChats = chats.filter((chat) => chat.title.includes("2"));

    await expect(
      page.getByText(new RegExp(`${targetChats.length} chats found`, "i"))
    ).toBeVisible();

    chatLinks = page
      .getByTestId("history-chat-list")
      .locator('a[href^="/chats/"]');

    await expect(chatLinks).toHaveCount(targetChats.length);

    for (let index = 0; index < targetChats.length; index++) {
      await expect(chatLinks.nth(index)).toContainText(
        targetChats[targetChats.length - 1 - index].title
      );
    }

    await page.getByPlaceholder(/search/i).clear();

    chatLinks = page
      .getByTestId("history-chat-list")
      .locator('a[href^="/chats/"]');

    await expect(chatLinks).toHaveCount(30);

    for (let index = 0; index < 30; index++) {
      await expect(chatLinks.nth(index)).toContainText(chats[29 - index].title);
    }

    await chatLinks.first().click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Chat 30 User Message"
    );

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).toContainText(
      "Chat 30 Assistant Message"
    );

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);
  });

  test("rename chat from previous chats", async ({ page }) => {
    await page
      .getByRole("button", { name: /more options for chat 30/i })
      .click();

    await page.getByRole("menuitem", { name: /rename/i }).click();

    await page.getByPlaceholder(/chat title/i).fill("Chat 30 Updated");

    await page.getByRole("button", { name: /rename/i }).click();

    await expect(page.locator('a[href^="/chats/"]').first()).toHaveText(
      "Chat 30 Updated"
    );
  });

  test("rename chat from chat history", async ({ page }) => {
    await page.getByRole("link", { name: /chat history/i }).click();

    await page.waitForURL("/history");

    await page
      .getByTestId("history-chat-list")
      .getByRole("button", { name: /more options for chat 30/i })
      .click();

    await page.getByRole("menuitem", { name: /rename/i }).click();

    await page.getByPlaceholder(/chat title/i).fill("Chat 30 Updated");

    await page.getByRole("button", { name: /rename/i }).click();

    await expect(page.locator('a[href^="/chats/"]').first()).toHaveText(
      "Chat 30 Updated"
    );

    await expect(
      page
        .getByTestId("history-chat-list")
        .locator('a[href^="/chats/"]')
        .first()
    ).toHaveText("Chat 30 Updated");
  });

  test("delete chat from previous chats", async ({ page }) => {
    await page
      .getByRole("button", { name: /more options for chat 30/i })
      .click();

    await page.getByRole("menuitem", { name: /delete/i }).click();

    await page.getByRole("button", { name: /delete/i }).click();

    await expect(page.getByText("Chat 30")).toHaveCount(0);
  });

  test("delete chat from chat history", async ({ page }) => {
    await page.getByRole("link", { name: /chat history/i }).click();

    await page.waitForURL("/history");

    await page
      .getByTestId("history-chat-list")
      .getByRole("button", { name: /more options for Chat 30/i })
      .click();

    await page.getByRole("menuitem", { name: /delete/i }).click();

    await page.getByRole("button", { name: /delete$/i }).click();

    await expect(page.getByText("Chat 30")).toHaveCount(0);
  });
});
