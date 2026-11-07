import configuration from "../emails.json";

/** Validate the editable recipient file before publishing the site. */
export function readEmailRecipients(value: unknown): string[] {
  const recipients =
    value && typeof value === "object" && "recipients" in value
      ? value.recipients
      : undefined;
  if (!Array.isArray(recipients) || recipients.length === 0) {
    throw new Error(
      "emails.json: add at least one email address to recipients.",
    );
  }

  const addresses: string[] = [];
  const seen = new Set<string>();
  for (const [index, value] of recipients.entries()) {
    const address = typeof value === "string" ? value.trim() : "";
    // Plain addresses only: no display names, lists or mailto header parameters.
    const valid =
      /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}$/.test(
        address,
      );
    if (
      !valid ||
      address.length > 254 ||
      address.split("@")[0].length > 64 ||
      address.includes("..")
    ) {
      throw new Error(
        `emails.json: recipient ${index + 1} must be a valid email address, such as name@company.com.`,
      );
    }
    const identity = address.toLowerCase();
    if (!seen.has(identity)) {
      seen.add(identity);
      addresses.push(address);
    }
  }
  return addresses;
}

export const emailRecipients = readEmailRecipients(configuration);
// Encode each address separately so a '+' or '?' cannot change the URI fields.
export const emailRecipientList = emailRecipients
  .map((address) => address.split("@").map(encodeURIComponent).join("@"))
  .join(",");
