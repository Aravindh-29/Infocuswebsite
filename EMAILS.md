# Contact form recipient emails

Edit **emails.json** in the project root to choose who receives enquiries:

```json
{
  "recipients": ["hr@infocuscs.com", "aravindhkumar146@gmail.com"]
}
```

Add addresses in quotes, separated by commas. Do not put passwords or API keys
in this file. Duplicate addresses are removed automatically; invalid or empty
lists stop the build with an explanation.

## How the form works

1. The customer enters their project, service, preferred office, name, email,
   phone number and company.
2. **Review** shows all their answers before proceeding.
3. **Send email** opens Gmail with both recipients, a subject and all the
   customer's details filled in. They may need to sign in to Gmail first.
4. The customer reviews the draft and clicks **Send inside Gmail**.

The form also provides **Open Gmail draft** if the new tab was blocked and
**Open in email app** for customers who use another email service. The message
is sent from the account they select in their email app; the contact email
entered in the form is included in the message body.

No SMTP credentials or email backend are required for this flow. `emails.json`
stores the recipient list, not the messages. Recipient addresses are visible
to the customer and included in the published website. The website only
prepares the draft; it cannot know whether the customer clicked Send or whether
the email was delivered. It never reports a sent-email confirmation.

Google's [Gmail sending guide](https://support.google.com/mail/answer/2819488?hl=en)
explains the final Send step. Very long drafts and mobile email clients may have
different link-handling limits; keep project descriptions concise and use the
alternative email-app link if needed.

## Apply recipient changes

After saving `emails.json`, run `npm run build`, then refresh the local preview
or deploy the new contents of `out/`. A previously exported website keeps its old
recipient list until rebuilt and redeployed. Run `python scripts/package-renewal.py`
to refresh the deployment ZIP. Careers links still use the published HR address.
