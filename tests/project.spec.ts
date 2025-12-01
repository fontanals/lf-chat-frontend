import { expect, test } from "@playwright/test";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import { Chat } from "../src/models/entities/chat";
import { Document } from "../src/models/entities/document";
import { Message } from "../src/models/entities/message";
import { Project } from "../src/models/entities/project";
import { clearTestData, createTestData } from "./utils";

test.describe("Project", () => {
  test.describe.configure({ mode: "serial" });

  const userId = randomUUID();

  const projects: Project[] = Array.from({ length: 5 }, (_, index) => ({
    id: randomUUID(),
    title: `Project ${index + 1}`,
    description: `Project ${index + 1} Description`,
    userId,
    createdAt: addDays(new Date(), -100 + index).toISOString(),
    updatedAt: addDays(new Date(), -100 + index).toISOString(),
  }));

  const chats: Chat[] = projects.slice(0, 2).flatMap((project) =>
    Array.from({ length: 30 }, (_, index) => ({
      id: randomUUID(),
      title: `${project.title} Chat ${index + 1}`,
      projectId: project.id,
      userId,
      createdAt: addDays(project.createdAt!, index).toISOString(),
      updatedAt: addDays(project.createdAt!, index).toISOString(),
    }))
  );

  const messages: Message[] = chats.slice(0, 10).flatMap((chat) => {
    const userMessageId = randomUUID();

    return [
      {
        id: userMessageId,
        role: "user",
        content: [
          {
            type: "text",
            id: randomUUID(),
            text: `${chat.title} User Message`,
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
            text: `${chat.title} Assistant Message`,
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

  const documents: (Document & { content: string })[] = Array.from(
    { length: 2 },
    (_, index) => ({
      id: randomUUID(),
      key: `test/document_${index + 1}.txt`,
      name: `document_${index + 1}.txt`,
      content: `Document ${index + 1} Content`,
      mimetype: "text/plain",
      sizeInBytes: 2048,
      isProcessed: false,
      chatId: null,
      projectId: projects[0].id,
      userId,
      createdAt: projects[0].createdAt,
      updatedAt: projects[0].updatedAt,
    })
  );

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
      projects,
      chats,
      messages,
      documents,
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

  test("view project", async ({ page }) => {
    await page.getByRole("link", { name: /projects/i }).click();

    await page.waitForURL("/projects");

    await page.getByRole("link", { name: /project 1 description/i }).click();

    await page.waitForURL("**/projects/*");

    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/^project 1$/i)).toBeVisible();
    await expect(page.getByText(/project 1 description/i)).toBeVisible();
  });

  test("edit project", async ({ page }) => {
    await page.getByRole("link", { name: /projects/i }).click();

    await page.waitForURL("/projects");

    await page.getByRole("link", { name: /project 1 description/i }).click();

    await page.waitForURL("**/projects/*");

    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /edit project/i }).click();

    await page
      .getByRole("textbox", { name: /title/i })
      .fill("Project 1 Updated");
    await page
      .getByRole("textbox", { name: /description/i })
      .fill("Project 1 Description Updated");

    await page.getByRole("button", { name: /edit/i }).click();

    await expect(page.getByText(/^project 1 updated$/i)).toBeVisible();
    await expect(
      page.getByText(/project 1 description updated/i)
    ).toBeVisible();
  });

  test("delete project", async ({ page }) => {
    await page.getByRole("link", { name: /projects/i }).click();

    await page.waitForURL("/projects");

    await page.getByRole("link", { name: /project 1 description/i }).click();

    await page.waitForURL("**/projects/*");

    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /delete project/i }).click();

    await page.getByRole("button", { name: /delete/i }).click();

    await page.waitForURL("/new");

    await expect(page.getByText(/project 1/i)).toHaveCount(0);
  });

  test("view project documents", async ({ page }) => {
    await page.getByRole("link", { name: /projects/i }).click();

    await page.waitForURL("/projects");

    await page.getByRole("link", { name: /project 1 description/i }).click();

    await page.waitForURL("**/projects/*");

    await page.waitForLoadState("networkidle");

    for (const document of documents) {
      await expect(page.getByText(document.name)).toBeVisible();
    }
  });

  test("add document", async ({ page }) => {
    await page.getByRole("link", { name: /projects/i }).click();

    await page.waitForURL("/projects");

    await page.getByRole("link", { name: /project 1 description/i }).click();

    await page.waitForURL("**/projects/*");

    await page.waitForLoadState("networkidle");

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.getByRole("button", { name: /add document/i }).click(),
    ]);

    await fileChooser.setFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Mock File Content"),
    });

    await expect(page.getByText("notes.txt")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /remove document notes.txt/i })
    ).toBeVisible();
  });

  test("remove document", async ({ page }) => {
    await page.getByRole("link", { name: /projects/i }).click();

    await page.waitForURL("/projects");

    await page.getByRole("link", { name: /project 1 description/i }).click();

    await page.waitForURL("**/projects/*");

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("button", { name: /remove document document_1.txt/i })
      .click();

    await expect(page.getByText("document_1.txt")).toHaveCount(0);
  });

  test("view project chats", async ({ page }) => {
    await page.getByRole("link", { name: /projects/i }).click();

    await page.waitForURL("/projects");

    await page.getByRole("link", { name: /project 1 description/i }).click();

    await page.waitForURL("**/projects/*");

    await page.waitForLoadState("networkidle");

    let chatLinks = page
      .getByTestId("project-chat-list")
      .locator('a[href^="/chats/"]');

    const projectChats = chats.slice(0, 30);

    await expect(chatLinks).toHaveCount(25);

    for (let index = 0; index < 25; index++) {
      await expect(chatLinks.nth(index)).toContainText(
        projectChats[29 - index].title
      );
    }

    await page.getByRole("button", { name: /load more/i }).click();

    chatLinks = page
      .getByTestId("project-chat-list")
      .locator('a[href^="/chats/"]');

    await expect(chatLinks).toHaveCount(30);

    for (let index = 0; index < 30; index++) {
      await expect(chatLinks.nth(index)).toContainText(
        projectChats[29 - index].title
      );
    }

    await chatLinks.last().click();

    await page.waitForURL("**/chats/*");

    await expect(page.locator('[data-role="user"]')).toBeVisible();
    await expect(page.locator('[data-role="user"]')).toContainText(
      "Project 1 Chat 1 User Message"
    );

    await expect(page.locator('[data-role="assistant"]')).toBeVisible();
    await expect(page.locator('[data-role="assistant"]')).toContainText(
      "Project 1 Chat 1 Assistant Message"
    );

    await expect(
      page.locator('[data-role="user"], [data-role="assistant"]')
    ).toHaveCount(2);
  });
});
