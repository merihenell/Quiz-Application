const { test, expect } = require("@playwright/test");

const email = `user${Math.random()}@user.com`;
const password = `${Math.random()}`;
const topic1 = `Topic ${Math.random()}`;
const topic2 = `Topic ${Math.random()}`;
const question = `Question ${Math.random()}`;
const option1 = `Option ${Math.random()}`; // taken as correct answer
const option2 = `Option ${Math.random()}`;

test("Main page has expected statistics and links.", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("li")).toContainText(["Topics", "Questions", "Answers"]);
  await expect(page.locator("a >> text='Register'")).toHaveAttribute("href", "/auth/register");
  await expect(page.locator("a >> text='Login'")).toHaveAttribute("href", "/auth/login");
});

test("User can register successfully.", async ({ page }) => {
  await page.goto("/auth/register");
  await page.locator("input[type=email]").type(email);
  await page.locator("input[type=password]").type(password);
  await page.locator("input[type=submit]").click();
  await expect(page.locator("h1")).toContainText("Login");
  await page.locator("input[type=email]").type(email);
  await page.locator("input[type=password]").type(password);
  await page.locator("input[type=submit]").click();
  await expect(page.locator("h1")).toContainText("Topics");
});

test.describe("Admin actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator("input[type=email]").type("admin@admin.com");
    await page.locator("input[type=password]").type("123456");
    await page.locator("input[type=submit]").click();
  });

  test("Admin can add topics.", async ({ page }) => {
    await page.locator("input[type=text]").type(topic1);
    await page.locator("input[type=submit] >> text='Add'").click();
    await page.locator("input[type=text]").type(topic2);
    await page.locator("input[type=submit] >> text='Add'").click();
    await expect(page.locator(`li >> text='${topic1}'`)).toHaveText(topic1);
    await expect(page.locator(`li >> text='${topic2}'`)).toHaveText(topic2);
  });
  
  test("Admin can delete topics.", async ({ page }) => {
    await page.getByRole('listitem').filter({ hasText: `${topic2} Delete` }).getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator("li")).not.toHaveText([topic2]);
  });  
});

test.describe("User actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator("input[type=email]").type(email);
    await page.locator("input[type=password]").type(password);
    await page.locator("input[type=submit]").click();
  });
  
  test("User cannot add or delete topics.", async ({ page }) => {
    await expect(page.locator("input[type=submit]")).not.toContainText(["Add", "Delete"]);
  });
  
  test("Use can add questions.", async ({ page }) => {
    await page.locator(`a >> text='${topic1}'`).click();
    await page.locator("textarea").type(question);
    await page.locator("input[type=submit] >> text='Add'").click();
    await expect(page.locator(`li >> text='${question}'`)).toHaveText(question);
  });
  
  test("User can add answer options.", async ({ page }) => {
    await page.locator(`a >> text='${topic1}'`).click();
    await page.locator(`a >> text='${question}'`).click();
    await page.locator("textarea").type(option1);
    await page.getByRole('checkbox').check();
    await page.locator("input[type=submit] >> text='Add'").click();
    await page.locator("textarea").type(option2);
    await page.locator("input[type=submit] >> text='Add'").click();
    await expect(page.locator(`li >> text='${option1} (true)'`)).toContainText([option1]);
    await expect(page.locator(`li >> text='${option2} (false)'`)).toContainText([option2]);
  });
  
  test("User can answer quiz.", async ({ page }) => {
    await page.goto("/quiz");
    await expect(page.locator(`li >> text='${topic1}'`)).toHaveText(topic1);
    await page.locator(`a >> text='${topic1}'`).click();
    await expect(page.locator("h2")).toHaveText(question);
    await page.getByRole('listitem').filter({ hasText: `${option1} Choose` }).getByRole('button', { name: 'Choose' }).click();
    await expect(page.locator("h3")).toHaveText("Correct!");
  });
  
  test("User can delete answer options.", async ({ page }) => {
    await page.locator(`a >> text='${topic1}'`).click();
    await page.locator(`a >> text='${question}'`).click();
    await page.getByRole('listitem').filter({ hasText: `${option1} (true) Delete option` }).getByRole('button', { name: 'Delete option' }).click();
    await expect(page.locator("li")).not.toContainText([option1]);
    await page.getByRole('listitem').filter({ hasText: `${option2} (false) Delete option` }).getByRole('button', { name: 'Delete option' }).click();
    await expect(page.locator("li")).not.toContainText([option2]);
  });
  
  test("User can delete questions.", async ({ page }) => {
    await page.locator(`a >> text='${topic1}'`).click();
    await page.locator(`a >> text='${question}'`).click();
    await page.locator("input[type=submit] >> text='Delete question'").click();
    await expect(page.locator("li")).not.toHaveText([question]);
  });
});