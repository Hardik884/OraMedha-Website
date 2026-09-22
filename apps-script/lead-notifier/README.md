# OraMedha lead notifier

New row in the leads sheet → one Telegram message to each of three people.
Google Apps Script + Telegram Bot API only. Free. No server, no database.

The website, the API route and the sheet layout are untouched. This script only
*reads* the sheet and never writes to it.

## What it found in the existing setup

- Leads are **not** Google Form responses. The site's API route appends rows
  through the Sheets API (`src/lib/google-sheets.ts`), so "On form submit" and
  `onEdit` don't apply. The trigger used is the installable **On change**.
- Tab: `Demo Requests` (unless `GOOGLE_SHEETS_SHEET_NAME` is set on the site —
  if your live tab has another name, add a `SHEET_NAME` script property).
- Headers, read by name at run time: `Submitted At | Name | Mobile | Email | Message | Status`.
- There is no clinic or city column, so the message shows Name, Phone, Email,
  Message and Received time. Empty fields are left out.

## One-time setup

### 1. Create the bot
1. In Telegram, open **@BotFather** → send `/newbot`.
2. Pick a name and a username ending in `bot`.
3. BotFather replies with a token like `123456:ABC…`. Keep it private: never
   paste it into chat, GitHub or a document.

### 2. Let each of the three people receive messages
Each person (you, the Founder, the Marketing Head), from their own Telegram:
1. Search for your bot's username, open it, press **Start**, send "hi".

(A bot can't message someone who hasn't started it. A group also works: add the
bot to the group and send a message there.)

### 3. Add the script
1. Open the leads Google Sheet → **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with `Code.gs` from this folder. Save.
3. Optional: **Project Settings → Show "appsscript.json"** and paste in this
   folder's `appsscript.json`, so permissions stay minimal.

### 4. Add the secrets
**Project Settings (gear) → Script properties → Add script property**:

| Property | Value |
|---|---|
| `BOT_TOKEN` | the token from BotFather |
| `CHAT_ID_1` | first person's chat ID |
| `CHAT_ID_2` | second person's chat ID |
| `CHAT_ID_3` | third person's chat ID |

To get the chat IDs: add `BOT_TOKEN` first, save, then in the editor pick
`listRecentChats` → **Run** → open **Execution log**. It prints one line per
person who messaged the bot (`chat_id 123456789 (private) Name`). Copy each
number into `CHAT_ID_1..3`. (This keeps the token out of browser address bars.)

### 5. Install
1. Pick `setup` in the function dropdown → **Run**.
2. Approve the permissions (see below).
3. `setup` records the current last row as "already seen", installs the
   trigger, and reports which properties are set.
4. Pick `sendTestMessages` → **Run**. All three people should get a test line.

Only people who can edit the sheet can open the script. Don't share the sheet
more widely than that.

## Tests

1. **New lead**: submit the website form (or type a row at the bottom of the
   sheet). Each person gets exactly one message.
2. **Edit**: change Status/Message on an old row. No message.
3. **Second lead**: submit another. One message each, again.
4. **Optional field**: submit with Message empty. No "Message:" line, no
   "undefined".
5. **One recipient failing**: change `CHAT_ID_2` to `1`, submit a lead. The other
   two still get it; the log names `CHAT_ID_2`; the sheet row is untouched.
   Put the right ID back and run `retryPending`. Only `CHAT_ID_2` receives it.
6. **Reinstall**: run `setup` again (or `installTrigger`). Old rows are not
   re-sent.
7. **Re-run**: run `retryPending` with nothing owed. Nothing is sent.
8. **Logs**: **Executions** shows row numbers and recipient labels only. No
   token, no names/phones/emails.

## Reference
- Change the tab: add script property `SHEET_NAME`.
- Start over (e.g. after wiping the sheet): delete the `STATE` script property,
  then run `setup`.
