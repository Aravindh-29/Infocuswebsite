import { test, expect, type Page } from "@playwright/test";
import { emailRecipients } from "../lib/email-recipients";

test.use({ reducedMotion: "reduce" });

const details = {
  name: "Preview visitor",
  email: "preview@example.com",
  phone: "+65 6123 4567",
  company: "Preview Company",
};
type GmailCapture = Window & { __gmailOpens: string[] };

async function captureGmail(page: Page) {
  await page.addInitScript(() => {
    const browser = window as unknown as GmailCapture;
    browser.__gmailOpens = [];
    // A blocked popup must leave the visible draft links usable.
    window.open = (url) => {
      browser.__gmailOpens.push(String(url));
      return null;
    };
    localStorage.setItem("deepu-muted", "true");
  });
  const apiCalls: string[] = [];
  await page.route("**/api/contact", async (route) => {
    apiCalls.push(route.request().method());
    await route.abort();
  });
  return {
    opened: () =>
      page.evaluate(() => (window as unknown as GmailCapture).__gmailOpens),
    apiCalls,
  };
}

async function fillProject(
  page: Page,
  message = "Connect our Oracle applications.",
) {
  await page
    .getByLabel("I’m interested in")
    .selectOption({ label: "Oracle services" });
  await page
    .getByLabel("Preferred office")
    .selectOption({ label: "Singapore" });
  await page.getByRole("textbox", { name: "Your challenge" }).fill(message);
}

async function fillDetails(page: Page) {
  await page.getByRole("textbox", { name: "Your name" }).fill(details.name);
  await page.getByRole("textbox", { name: "Work email" }).fill(details.email);
  await page.getByRole("textbox", { name: "Phone number" }).fill(details.phone);
  await page
    .getByRole("textbox", { name: "Company", exact: true })
    .fill(details.company);
}

async function reachReview(page: Page) {
  await page.goto("/contact/");
  await fillProject(page);
  await page.getByRole("button", { name: "Continue to your details" }).click();
  await fillDetails(page);
  await page.getByRole("button", { name: "Review", exact: true }).click();
}

test("contact journey validates project, email, phone and consent before opening Gmail", async ({
  page,
}) => {
  const capture = await captureGmail(page);
  await page.goto("/contact/");
  const form = page.locator(".contact-form");
  await expect(
    form.getByRole("heading", { name: "Choose your focus.", exact: true }),
  ).toBeVisible();
  await expect(form.locator('[aria-current="step"]')).toHaveCount(1);
  await page.getByRole("button", { name: "Continue to your details" }).click();
  expect(
    await page
      .getByLabel("I’m interested in")
      .evaluate((el: HTMLSelectElement) => el.validity.valueMissing),
  ).toBe(true);
  await fillProject(page, "");
  await page.getByRole("button", { name: "Continue to your details" }).click();
  expect(
    await page
      .getByRole("textbox", { name: "Your challenge" })
      .evaluate((el: HTMLTextAreaElement) => el.validity.valueMissing),
  ).toBe(true);
  await page
    .getByRole("textbox", { name: "Your challenge" })
    .fill("Connect our enterprise applications.");
  await page.getByRole("button", { name: "Continue to your details" }).click();
  await fillDetails(page);
  await page.getByRole("textbox", { name: "Work email" }).fill("invalid-email");
  await page.getByRole("button", { name: "Review", exact: true }).click();
  expect(
    await page
      .getByRole("textbox", { name: "Work email" })
      .evaluate((el: HTMLInputElement) => el.validity.typeMismatch),
  ).toBe(true);
  await page.getByRole("textbox", { name: "Work email" }).fill(details.email);
  const phone = page.getByRole("textbox", { name: "Phone number" });
  await phone.fill("");
  await page.getByRole("button", { name: "Review", exact: true }).click();
  expect(
    await phone.evaluate((el: HTMLInputElement) => el.validity.valueMissing),
  ).toBe(true);
  for (const invalid of ["not a phone", "123456", "1234567890123456"]) {
    await phone.fill(invalid);
    await page.getByRole("button", { name: "Review", exact: true }).click();
    expect(
      await phone.evaluate((el: HTMLInputElement) => el.validity.valid),
    ).toBe(false);
    await expect(
      form.getByRole("heading", { name: "Introduce yourself.", exact: true }),
    ).toBeVisible();
  }
  await phone.fill(details.phone);
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(
    form.getByRole("heading", { name: "Review your enquiry.", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Send email", exact: true }).click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await expect(page.locator(".form-result")).toHaveCount(0);
  expect(await capture.opened()).toEqual([]);
  expect(capture.apiCalls).toEqual([]);
});

test("Gmail and email-app drafts include every current answer and configured recipient after edits", async ({
  page,
}) => {
  const capture = await captureGmail(page);
  await reachReview(page);
  await expect(page.locator(".enquiry-review")).toContainText(details.phone);
  expect(await capture.opened()).toEqual([]);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send email", exact: true }).click();
  await expect(page.locator(".form-result[role='status']")).toContainText(
    "Your email draft is ready.",
  );
  const initialHref = await page
    .getByRole("link", { name: "Open Gmail draft" })
    .getAttribute("href");
  expect(await capture.opened()).toEqual([initialHref]);
  await page.getByRole("button", { name: "Edit project", exact: true }).click();
  await expect(page.locator(".form-result")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open Gmail draft" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("textbox", { name: "Your challenge" }),
  ).toHaveValue("Connect our Oracle applications.");
  await expect(page.getByLabel("Preferred office")).toHaveValue("Singapore");
  const message =
    "Review cloud + ERP integration & architecture.\nInclude order status updates.";
  await page.getByRole("textbox", { name: "Your challenge" }).fill(message);
  await page.getByRole("button", { name: "Continue to your details" }).click();
  await expect(page.getByRole("textbox", { name: "Phone number" })).toHaveValue(
    details.phone,
  );
  await expect(page.getByRole("textbox", { name: "Work email" })).toHaveValue(
    details.email,
  );
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page.getByRole("button", { name: "Edit details", exact: true }).click();
  const phone = "+65 6987 6543";
  const company = "Updated + Company & Partners";
  await page.getByRole("textbox", { name: "Phone number" }).fill(phone);
  await page
    .getByRole("textbox", { name: "Company", exact: true })
    .fill(company);
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.locator(".enquiry-review")).toContainText(phone);
  await expect(page.locator(".enquiry-review")).toContainText(
    message.split("\n")[0],
  );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send email", exact: true }).click();

  const result = page.locator(".form-result[role='status']");
  await expect(result).toContainText("Your email draft is ready.");
  await expect(result).toContainText(
    "Review the message and choose Send in Gmail.",
  );
  await expect(result).not.toContainText("has been sent");
  const link = page.getByRole("link", { name: "Open Gmail draft" });
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(link).toHaveAttribute("rel", /noreferrer/);
  const href = (await link.getAttribute("href"))!;
  const gmail = new URL(href);
  expect(gmail.origin).toBe("https://mail.google.com");
  expect(gmail.searchParams.get("view")).toBe("cm");
  expect(gmail.searchParams.get("to")).toBe(emailRecipients.join(","));
  expect(gmail.searchParams.get("su")).toContain("Oracle services");
  const body = gmail.searchParams.get("body")!;
  for (const value of [
    details.name,
    details.email,
    phone,
    company,
    "Oracle services",
    "Singapore",
    message,
  ]) {
    expect(body).toContain(value);
  }
  expect(body).toMatch(/consent.*(yes|agree)/i);
  expect(body).not.toContain("Connect our Oracle applications.");
  expect(body).not.toContain(details.phone);
  expect(href).not.toBe(initialHref);
  expect(await capture.opened()).toEqual([initialHref, href]);
  expect(capture.apiCalls).toEqual([]);
  await expect(page).toHaveURL(/\/contact\/?$/);

  const emailApp = new URL(
    (await page
      .getByRole("link", { name: "Open in email app" })
      .getAttribute("href"))!,
  );
  expect(emailApp.protocol).toBe("mailto:");
  expect(decodeURIComponent(emailApp.pathname)).toBe(emailRecipients.join(","));
  expect(emailApp.searchParams.get("subject")).toBe(
    gmail.searchParams.get("su"),
  );
  expect(emailApp.searchParams.get("body")).toBe(body);

  await page.getByRole("checkbox").uncheck();
  await expect(page.locator(".form-result")).toHaveCount(0);
  await page.getByRole("button", { name: "Send email", exact: true }).click();
  expect(await capture.opened()).toHaveLength(2);
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  for (const theme of ["light", "dark"] as const) {
    test(
      "contact Gmail flow remains readable on " +
        viewport.name +
        " in " +
        theme +
        " mode",
      async ({ page }) => {
        await page.setViewportSize(viewport);
        const capture = await captureGmail(page);
        await page.addInitScript(
          (theme) => localStorage.setItem("infocus-theme", theme),
          theme,
        );
        await page.goto("/contact/");
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const assertFit = async () => {
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
          const box = (await page.locator(".contact-form").boundingBox())!;
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
        };
        await assertFit();
        await fillProject(page);
        await page
          .getByRole("button", { name: "Continue to your details" })
          .click();
        await assertFit();
        await fillDetails(page);
        const phone = page.getByRole("textbox", { name: "Phone number" });
        expect(
          await phone.evaluate((el) =>
            parseFloat(getComputedStyle(el).fontSize),
          ),
        ).toBeGreaterThanOrEqual(16);
        const phoneBox = (await phone.boundingBox())!;
        expect(phoneBox.x + phoneBox.width).toBeLessThanOrEqual(viewport.width);
        await page.getByRole("button", { name: "Review", exact: true }).click();
        await assertFit();
        await expect(page.locator(".enquiry-review")).toContainText(
          details.phone,
        );
        await page.getByRole("checkbox").check();
        await page
          .getByRole("button", { name: "Send email", exact: true })
          .click();
        await expect(page.locator(".form-result[role='status']")).toContainText(
          "Your email draft is ready.",
        );
        await expect(
          page.getByRole("link", { name: "Open Gmail draft" }),
        ).toBeVisible();
        expect(await capture.opened()).toHaveLength(1);
        expect(capture.apiCalls).toEqual([]);
        await assertFit();
      },
    );
  }
}
