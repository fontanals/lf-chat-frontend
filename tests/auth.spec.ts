import { expect, test } from "@playwright/test";
import { clearTestData, getUsers } from "./utils";

test.describe("Authentication", () => {
  test.describe.configure({ mode: "serial" });

  test.afterAll(async () => {
    await clearTestData();
  });

  test("sign up", async ({ page }) => {
    await page.goto("/");

    await page.waitForURL("/signin");

    await page.getByRole("link", { name: /sign up/i }).click();

    await page.waitForURL("/signup");

    await page.getByRole("textbox", { name: /name/i }).fill("Test User");
    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");
    await page.getByRole("textbox", { name: /password/i }).fill("password");

    await page.getByRole("button", { name: /sign up/i }).click();

    await expect(
      page.getByText(/an account verification email was sent to your inbox/i)
    ).toBeVisible();
  });

  test("verify account", async ({ page }) => {
    const users = await getUsers({ email: "test@example.com" });

    const user = users[0];

    await page.goto(`/verify-account?token=${user.verificationToken}`);

    await page.getByRole("button", { name: /verify account/i }).click();

    await expect(
      page.getByText(/your account has been verified/i)
    ).toBeVisible();
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

  test("recover password", async ({ page }) => {
    await page.goto("/");

    await page.waitForURL("/signin");

    await page.getByRole("link", { name: /forgot your password/i }).click();

    await page.waitForURL("/recover-password");

    await page.getByRole("button", { name: /recover password/i }).waitFor();

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");

    await page.getByRole("button", { name: /recover password/i }).click();

    await expect(
      page.getByText(/a password recovery email was sent to your inbox/i)
    ).toBeVisible();
  });

  test("reset password", async ({ page }) => {
    const users = await getUsers({ email: "test@example.com" });

    const user = users[0];

    await page.goto(`/reset-password?token=${user.recoveryToken}`);

    await page
      .getByRole("textbox", { name: /new password/i })
      .fill("new-password");
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill("new-password");

    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(page.getByText(/your password has been reset/i)).toBeVisible();

    await page.getByRole("link", { name: /sign in/i }).click();

    await page.waitForURL("/signin");

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");
    await page.getByRole("textbox", { name: /password/i }).fill("new-password");

    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("/new");
  });
});
