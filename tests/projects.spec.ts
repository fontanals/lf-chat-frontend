import { expect, test } from "@playwright/test";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import { Project } from "../src/models/entities/project";
import { clearTestData, createTestData } from "./utils";

test.describe("Projects", () => {
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

  test("view projects", async ({ page }) => {
    await page.getByRole("link", { name: /^projects$/i }).click();

    await page.waitForURL("/projects");

    const projectLinks = page.locator('a[href^="/projects/"]');

    await expect(projectLinks).toHaveCount(5);

    for (let index = 0; index < 5; index++) {
      await expect(projectLinks.nth(index)).toContainText(
        projects[4 - index].title
      );
      await expect(projectLinks.nth(index)).toContainText(
        projects[4 - index].description
      );
    }
  });

  test("create new project", async ({ page }) => {
    await page.getByRole("link", { name: /^projects$/i }).click();

    await page.waitForURL("/projects");

    await page.getByRole("button", { name: /create project/i }).click();

    await page.getByRole("textbox", { name: /title/i }).fill("New Project");
    await page
      .getByRole("textbox", { name: /description/i })
      .fill("New Project Description");

    await page.getByRole("button", { name: /create project/i }).click();

    const projectLinks = page.locator('a[href^="/projects/"]');

    await expect(projectLinks).toHaveCount(6);

    for (let index = 0; index < 6; index++) {
      await expect(projectLinks.nth(index)).toContainText(
        index === 0 ? "New Project" : projects[5 - index].title
      );
      await expect(projectLinks.nth(index)).toContainText(
        index === 0
          ? "New Project Description"
          : projects[5 - index].description
      );
    }
  });

  test("edit project", async ({ page }) => {
    await page.getByRole("link", { name: /^projects$/i }).click();

    await page.waitForURL("/projects");

    await page
      .getByRole("button", { name: /more options for project 5/i })
      .click();

    await page.getByRole("menuitem", { name: /edit/i }).click();

    await page
      .getByRole("textbox", { name: /title/i })
      .fill("Project 5 Updated");
    await page
      .getByRole("textbox", { name: /description/i })
      .fill("Project 5 Description Updated");

    await page.getByRole("button", { name: /edit/i }).click();

    const projectLinks = page.locator('a[href^="/projects/"]');

    await expect(projectLinks).toHaveCount(5);

    for (let index = 0; index < 5; index++) {
      await expect(projectLinks.nth(index)).toContainText(
        index === 0 ? "Project 5 Updated" : projects[4 - index].title
      );
      await expect(projectLinks.nth(index)).toContainText(
        index === 0
          ? "Project 5 Description Updated"
          : projects[4 - index].description
      );
    }
  });

  test("delete project", async ({ page }) => {
    await page.getByRole("link", { name: /^projects$/i }).click();

    await page.waitForURL("/projects");

    await page
      .getByRole("button", { name: /more options for project 5/i })
      .click();

    await page.getByRole("menuitem", { name: /delete/i }).click();

    await page.getByRole("button", { name: /delete/i }).click();

    await expect(page.getByText("Project 5")).toHaveCount(0);
  });
});
