import { test } from "@playwright/test";
import { randomUUID } from "crypto";
import { clearTestData, createTestData } from "./utils";

test.describe("Authentication", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    await createTestData({
      users: [
        {
          id: randomUUID(),
          name: "Test User",
          email: "test@example.com",
          password: "password",
          displayName: "Test User",
          customPrompt: null,
          verificationToken: null,
          recoveryToken: null,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  });

  test.afterAll(async () => {
    await clearTestData();
  });

  test("sign in", async ({ page }) => {
    await page.goto("/");

    await page.waitForURL("/signin");

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");
    await page.getByRole("textbox", { name: /password/i }).fill("password");

    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("/new");
  });

  test("sign out", async ({ page }) => {
    await page.goto("/");

    await page.waitForURL("/signin");

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");
    await page.getByRole("textbox", { name: /password/i }).fill("password");

    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("/new");

    await page.getByRole("button", { name: /profile menu/i }).click();

    await page.getByRole("menuitem", { name: /sign out/i }).click();

    await page.waitForURL("/signin");
  });
});
