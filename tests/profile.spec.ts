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

  test("edit profile information", async ({ page }) => {
    await page.getByRole("button", { name: /profile menu/i }).click();

    await page.getByRole("link", { name: /profile/i }).click();

    await page.waitForURL("/profile");

    await page.getByRole("button", { name: /edit/i }).click();

    await page.getByRole("textbox", { name: /name/i }).fill("User 1 Updated");
    await page
      .getByRole("textbox", { name: /how the assistant should address you/i })
      .fill("User 1 Display Name Updated");
    await page
      .getByRole("textbox", {
        name: /custom instructions for the assistant/i,
      })
      .fill("Custom Instructions Updated");

    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByRole("textbox", { name: /name/i })).toHaveValue(
      "User 1 Updated"
    );
    await expect(
      page.getByRole("textbox", {
        name: /how the assistant should address you/i,
      })
    ).toHaveValue("User 1 Display Name Updated");
    await expect(
      page.getByRole("textbox", {
        name: /custom instructions for the assistant/i,
      })
    ).toHaveValue("Custom Instructions Updated");
  });

  test("delete all chats", async ({ page }) => {
    await expect(page.locator('a[href^="/chats/"]')).toHaveCount(chats.length);

    await page.getByRole("button", { name: /profile menu/i }).click();

    await page.getByRole("link", { name: /profile/i }).click();

    await page.waitForURL("/profile");

    await page.getByRole("link", { name: /data/i }).click();

    await page.waitForURL("/profile/data");

    await page.getByRole("button", { name: /delete all chats/i }).click();

    await page.getByRole("button", { name: /delete/i }).click();

    await expect(page.locator('a[href^="/chats/"]')).toHaveCount(0);
  });

  test("delete account", async ({ page }) => {
    await expect(page.locator('a[href^="/chats/"]')).toHaveCount(chats.length);

    await page.getByRole("button", { name: /profile menu/i }).click();

    await page.getByRole("link", { name: /profile/i }).click();

    await page.waitForURL("/profile");

    await page.getByRole("link", { name: /account/i }).click();

    await page.waitForURL("/profile/account");

    await page.getByRole("button", { name: /delete account/i }).click();

    await page.getByRole("button", { name: /delete/i }).click();

    await page.waitForURL("/signin");

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("user1@example.com");
    await page.getByRole("textbox", { name: /password/i }).fill("password");

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });
});
