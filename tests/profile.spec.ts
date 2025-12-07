import { expect, test } from "@playwright/test";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import { Chat } from "../src/models/entities/chat";
import { clearTestData, createTestData } from "./utils";

test.describe("Profile", () => {
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

    console.log("URL ", `${process.env.VITE_API_BASE_URL}/signin`);

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

  test("view profile information", async ({ page }) => {
    await page.getByRole("button", { name: /profile menu/i }).click();

    await page.getByRole("link", { name: /profile/i }).click();

    await page.waitForURL("/profile");

    await expect(page.getByRole("textbox", { name: /name/i })).toHaveValue(
      "User 1"
    );
    await expect(
      page.getByRole("textbox", {
        name: /how the assistant should address you/i,
      })
    ).toHaveValue("User 1");
  });
});
