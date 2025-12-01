import { expect, test } from "@playwright/test";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import { Chat } from "../src/models/entities/chat";
import { clearTestData, createTestData } from "./utils";

test.describe("Chat", () => {
  test.describe.configure({ mode: "serial" });

  const userId = randomUUID();

  const chats: Chat[] = Array.from({ length: 5 }, (_, index) => ({
    id: randomUUID(),
    title: `Chat ${index + 1}`,
    projectId: null,
    userId,
    createdAt: addDays(new Date(), -100 + index).toISOString(),
    updatedAt: addDays(new Date(), -100 + index).toISOString(),
  }));

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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      chats,
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

  test("create new chat", async ({ page }) => {
    await page.getByPlaceholder(/how can i help you today/i).fill("Hello!");

    await page.getByRole("button", { name: /send message/i }).click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText("Hello!");

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).not.toBeEmpty();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);

    const chatId = page.url().split("/").pop();

    await expect(page.locator(`a[href="/chats/${chatId}"]`)).toBeVisible();
  });

  test("create new chat (mock endpoint)", async ({ page }) => {
    await page.route("**/api/chats**", async (route) => {
      const request = route.request();
      const url = request.url();

      if (request.method() === "POST") {
        return route.continue({
          url: url.replace("/api/chats", "/api/__test__/data/chats"),
        });
      }

      route.continue();
    });

    await page
      .getByPlaceholder(/how can i help you today/i)
      .fill("Mock User Message");

    await page.getByRole("button", { name: /send message/i }).click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Mock User Message"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).not.toBeEmpty();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);

    const chatId = page.url().split("/").pop();

    await expect(page.locator(`a[href="/chats/${chatId}"]`)).toBeVisible();
  });

  test("create new chat with documents (mock endpoint)", async ({ page }) => {
    await page.route("**/api/chats**", async (route) => {
      const request = route.request();
      const url = request.url();

      if (request.method() === "POST") {
        return route.continue({
          url: url.replace("/api/chats", "/api/__test__/data/chats"),
        });
      }

      route.continue();
    });

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.getByRole("button", { name: /attach document/i }).click(),
    ]);

    await fileChooser.setFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Mock File Content"),
    });

    await expect(page.getByText("notes.txt")).toBeVisible();

    await page
      .getByPlaceholder(/how can i help you today/i)
      .fill("Mock User Message");

    await page.getByRole("button", { name: /send message/i }).click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Mock User Message"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).not.toBeEmpty();

    await expect(page.getByText(/process document notes.txt/i)).toBeVisible();
    await expect(page.getByText(/read document notes.txt/i)).toBeVisible();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);

    const chatId = page.url().split("/").pop();

    await expect(page.locator(`a[href="/chats/${chatId}"]`)).toBeVisible();
  });

  test("send second message (mock endpoint)", async ({ page }) => {
    await page.route("**/api/chats**", async (route) => {
      const request = route.request();
      const url = request.url();

      if (request.method() === "POST") {
        return route.continue({
          url: url.replace("/api/chats", "/api/__test__/data/chats"),
        });
      }

      route.continue();
    });

    await page
      .getByPlaceholder(/how can i help you today/i)
      .fill("Mock User Message");

    await page.getByRole("button", { name: /send message/i }).click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Mock User Message"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).not.toBeEmpty();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);

    await page
      .getByPlaceholder(/reply to assistant/i)
      .fill("Mock User Message 2");

    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.locator('[data-role="user"]').last()).toBeVisible();
    await expect(page.locator('[data-role="user"]').last()).toContainText(
      "Mock User Message 2"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]').last()).toBeVisible();
    await expect(
      page.locator('[data-role="assistant"]').last()
    ).not.toBeEmpty();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(4);

    const chatId = page.url().split("/").pop();

    await expect(page.locator(`a[href="/chats/${chatId}"]`)).toBeVisible();
  });

  test("send second message with documents (mock endpoint)", async ({
    page,
  }) => {
    await page.route("**/api/chats**", async (route) => {
      const request = route.request();
      const url = request.url();

      if (request.method() === "POST") {
        return route.continue({
          url: url.replace("/api/chats", "/api/__test__/data/chats"),
        });
      }

      route.continue();
    });

    await page
      .getByPlaceholder(/how can i help you today/i)
      .fill("Mock User Message");

    await page.getByRole("button", { name: /send message/i }).click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Mock User Message"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).not.toBeEmpty();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.getByRole("button", { name: /attach document/i }).click(),
    ]);

    await fileChooser.setFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Mock File Content"),
    });

    await expect(page.getByText("notes.txt")).toBeVisible();

    await page
      .getByPlaceholder(/reply to assistant/i)
      .fill("Mock User Message 2");

    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.locator('[data-role="user"]').last()).toBeVisible();
    await expect(page.locator('[data-role="user"]').last()).toContainText(
      "Mock User Message 2"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]').last()).toBeVisible();
    await expect(
      page.locator('[data-role="assistant"]').last()
    ).not.toBeEmpty();

    await expect(page.getByText(/process document notes.txt/i)).toBeVisible();
    await expect(page.getByText(/read document notes.txt/i)).toBeVisible();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(4);

    const chatId = page.url().split("/").pop();

    await expect(page.locator(`a[href="/chats/${chatId}"]`)).toBeVisible();
  });

  test("edit root message", async ({ page }) => {
    await page.route("**/api/chats**", async (route) => {
      const request = route.request();
      const url = request.url();

      if (request.method() === "POST") {
        return route.continue({
          url: url.replace("/api/chats", "/api/__test__/data/chats"),
        });
      }

      route.continue();
    });

    await page
      .getByPlaceholder(/how can i help you today/i)
      .fill("Mock User Message");

    await page.getByRole("button", { name: /send message/i }).click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Mock User Message"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).not.toBeEmpty();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);

    await page.getByRole("button", { name: /edit message/i }).click();

    await page
      .getByPlaceholder(/edit message/i)
      .fill("Mock User Message Updated");

    await page.getByRole("button", { name: /^edit$/i }).click();

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Mock User Message Updated"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).not.toBeEmpty();

    const chatId = page.url().split("/").pop();

    await expect(page.locator(`a[href="/chats/${chatId}"]`)).toBeVisible();
  });

  test("edit second message", async ({ page }) => {
    await page.route("**/api/chats**", async (route) => {
      const request = route.request();
      const url = request.url();

      if (request.method() === "POST") {
        return route.continue({
          url: url.replace("/api/chats", "/api/__test__/data/chats"),
        });
      }

      route.continue();
    });

    await page
      .getByPlaceholder(/how can i help you today/i)
      .fill("Mock User Message");

    await page.getByRole("button", { name: /send message/i }).click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Mock User Message"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).not.toBeEmpty();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);

    await page
      .getByPlaceholder(/reply to assistant/i)
      .fill("Mock User Message 2");

    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.locator('[data-role="user"]').last()).toBeVisible();
    await expect(page.locator('[data-role="user"]').last()).toContainText(
      "Mock User Message 2"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]').last()).toBeVisible();
    await expect(
      page.locator('[data-role="assistant"]').last()
    ).not.toBeEmpty();

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(4);

    await page
      .getByRole("button", { name: /edit message/i })
      .last()
      .click();

    await page
      .getByPlaceholder(/edit message/i)
      .last()
      .fill("Mock User Message Updated");

    await page
      .getByRole("button", { name: /^edit$/i })
      .last()
      .click();

    await expect(page.locator('[data-role="user"]').last()).toBeVisible();
    await expect(page.locator('[data-role="user"]').last()).toContainText(
      "Mock User Message Updated"
    );

    await expect(page.getByTestId("streaming-indicator")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("streaming-indicator")).not.toBeVisible({
      timeout: 60000,
    });

    await expect(page.locator('[data-role="assistant"]').last()).toBeVisible();
    await expect(
      page.locator('[data-role="assistant"]').last()
    ).not.toBeEmpty();

    const chatId = page.url().split("/").pop();

    await expect(page.locator(`a[href="/chats/${chatId}"]`)).toBeVisible();
  });

  test("rename chat", async ({ page }) => {
    await page.getByRole("link", { name: /chat 5/i }).click();

    await page.waitForURL("**/chats/*");

    await page.getByRole("button", { name: /^chat 5$/i }).click();

    await page.getByRole("menuitem", { name: /rename/i }).click();

    await page.getByPlaceholder(/chat title/i).fill("Chat 5 Updated");

    await page.getByRole("button", { name: /rename/i }).click();

    await expect(
      page.getByRole("button", { name: /^chat 5 updated$/i })
    ).toBeVisible();

    await expect(page.locator('a[href^="/chats/"]').first()).toHaveText(
      "Chat 5 Updated"
    );
  });

  test("delete chat", async ({ page }) => {
    await page.getByRole("link", { name: /chat 5/i }).click();

    await page.waitForURL("**/chats/*");

    await page.getByRole("button", { name: /^chat 5$/i }).click();

    await page.getByRole("menuitem", { name: /delete/i }).click();

    await page.getByRole("button", { name: /delete/i }).click();

    await page.waitForURL("/new");

    await expect(page.getByText("Chat 5")).toHaveCount(0);
  });
});
