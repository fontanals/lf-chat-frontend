import { test } from "@playwright/test";
import { clearTestData } from "./utils";

test.describe("Authentication", () => {
  test.describe.configure({ mode: "default" });

  test.afterAll(async () => {
    await clearTestData();
  });

  test("redirect to sign in page", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.waitForURL("http://localhost:5173/signin");
  });

  test("sign up", async ({ page }) => {
    await page.goto("http://localhost:5173/signup");

    await page.getByRole("textbox", { name: /name/i }).fill("Test User");
    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: /password/i })
      .fill("test-password");

    await page.getByRole("button", { name: /sign up/i }).click();

    await page.waitForURL("http://localhost:5173/new");
  });

  test("sign in", async ({ page }) => {
    await page.goto("http://localhost:5173/signin");

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: /password/i })
      .fill("test-password");

    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("http://localhost:5173/new");
  });

  test("sign out", async ({ page }) => {
    await page.goto("http://localhost:5173/signin");

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: /password/i })
      .fill("test-password");

    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("http://localhost:5173/new");

    await page.getByRole("button", { name: /profile menu/i }).click();

    await page.getByRole("menuitem", { name: /sign out/i }).click();

    await page.waitForURL("http://localhost:5173/signin");
  });
});
