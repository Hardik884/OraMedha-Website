/**
 * OraMedha lead notifier.
 *
 * New row in the leads sheet -> one Telegram message to each of three people.
 * Nothing else. No server, no database, no third-party service.
 *
 * Lives inside the leads spreadsheet (Extensions -> Apps Script). Setup and
 * testing steps are in README.md next to this file.
 *
 * @OnlyCurrentDoc
 *
 * ## Why "On change" and not "On form submit"
 *
 * Leads are not Google Form responses: the website's API route appends rows
 * through the Sheets API. Form-submit triggers never see that, and neither
 * does onEdit (it ignores API writes). The installable "On change" trigger is
 * the one that does.
 *
 * ## How duplicates are prevented
 *
 * The trigger is only a wake-up call. What decides whether a lead is new is a
 * watermark — the last row number already handled — kept in Script
 * Properties. Any change event (an edit, a sort, a retry of the trigger
 * itself) just looks at rows below the watermark, so:
 *   - editing an existing row changes nothing below the watermark: no message;
 *   - a repeated trigger finds nothing below the watermark: no message;
 *   - installing for the first time sets the watermark to the current last
 *     row, so existing leads are never announced.
 *
 * Delivery is tracked per recipient. Before the first send the row is recorded
 * as "still owed to recipients 1, 2, 3"; each success removes that recipient.
 * A crash or a Telegram outage therefore leaves an exact list of what is
 * still owed, and a retry sends only that.
 *
 * ## Secrets
 *
 * BOT_TOKEN and CHAT_ID_1..3 live in Script Properties only. Nothing in this
 * file logs them, and error text is scrubbed of the token before it is logged.
 * Lead details (name, phone, email, message) are never written to the log.
 */

var CONFIG = {
  /** Tab the website appends to. Override with a SHEET_NAME script property. */
  SHEET_NAME: 'Demo Requests',
  /** Shown in "Received". Also set in appsscript.json. */
  TIMEZONE: 'Asia/Kolkata',
  RECIPIENT_KEYS: ['CHAT_ID_1', 'CHAT_ID_2', 'CHAT_ID_3'],
  /** Longest visitor message included in a notification. */
  MAX_MESSAGE_CHARS: 300,
  /** Give up on a recipient after this many failed retries (about a day). */
  MAX_RETRIES: 8,
  /**
   * Header names, lower case, matched against row 1. Columns are found by
   * name so that reordering or inserting a column doesn't break anything.
   */
  HEADERS: {
    receivedAt: ['submitted at'],
    name: ['name'],
    mobile: ['mobile', 'phone'],
    email: ['email'],
    message: ['message']
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Entry point (called by the installable On change trigger)
// ─────────────────────────────────────────────────────────────────────────────

function onSheetChange(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    // Another run is busy. It will see any new row itself, or the next change
    // event will: the watermark makes catching up automatic.
    log_('warn', 'Could not get the lock; skipping this event.');
    return;
  }
  try {
    processLeads_(false);
  } catch (err) {
    log_('error', 'Unexpected failure: ' + scrub_(err));
  } finally {
    lock.releaseLock();
  }
}

/** Run by hand to retry anything still owed, ignoring the retry back-off. */
function retryPending() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    processLeads_(true);
  } finally {
    lock.releaseLock();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core
// ─────────────────────────────────────────────────────────────────────────────

function processLeads_(forceRetry) {
  var sheet = getLeadSheet_();
  if (!sheet) return;

  var state = loadState_();
  if (state.lastRow === null) {
    // Never announce old rows. Until setup() has recorded where "now" is, do
    // nothing at all rather than guess.
    log_('error', 'Not set up yet: run setup() once before relying on this.');
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < state.lastRow) {
    // Rows were deleted. Pull the watermark down so a lead added next is not
    // hidden behind a row number that no longer exists.
    log_('info', 'Sheet shrank (' + state.lastRow + ' -> ' + lastRow + '); watermark lowered.');
    state.lastRow = lastRow;
    saveState_(state);
  }

  var cols = readColumns_(sheet);
  if (!cols) return;

  retryPending_(sheet, cols, state, forceRetry);

  if (lastRow <= state.lastRow) return;

  var first = state.lastRow + 1;
  var width = sheet.getLastColumn();
  var rows = sheet.getRange(first, 1, lastRow - first + 1, width).getValues();

  // A row can appear a beat before its cells are filled. Only rows up to the
  // last one with content are treated as leads; a trailing empty row stays
  // below the watermark and is picked up by the change event that fills it.
  var lastFilled = -1;
  for (var i = 0; i < rows.length; i++) {
    if (!isBlank_(rows[i], cols)) lastFilled = i;
  }

  for (var j = 0; j <= lastFilled; j++) {
    if (isBlank_(rows[j], cols)) continue;
    var rowNumber = first + j;
    var lead = toLead_(rows[j], cols);
    var entry = { key: leadKey_(lead), recipients: allRecipients_(), retries: 0, nextTry: 0 };

    // Record the debt BEFORE sending, and advance the watermark with it, so a
    // crash mid-send can never announce this row a second time.
    state.pending[rowNumber] = entry;
    state.lastRow = rowNumber;
    saveState_(state);

    deliver_(rowNumber, lead, entry, state);
  }
  if (lastFilled >= 0) {
    state.lastRow = Math.max(state.lastRow, first + lastFilled);
    saveState_(state);
  }
}

/**
 * Send to whoever in entry.recipients is still owed a message. Updates and
 * saves state as it goes: a recipient leaves the list the moment they get it.
 */
function deliver_(rowNumber, lead, entry, state) {
  var text = formatMessage_(lead);
  var owed = entry.recipients.slice();

  for (var i = 0; i < owed.length; i++) {
    var idx = owed[i];
    var outcome = sendToRecipient_(idx, text);
    if (outcome === 'sent' || outcome === 'skipped') {
      entry.recipients = entry.recipients.filter(function (r) { return r !== idx; });
      state.pending[rowNumber] = entry;
      saveState_(state);
    }
  }

  if (entry.recipients.length === 0) {
    delete state.pending[rowNumber];
    log_('info', 'Row ' + rowNumber + ': delivered to everyone.');
  } else {
    log_('warn', 'Row ' + rowNumber + ': still owed to ' + entry.recipients.map(recipientLabel_).join(', ') + '.');
    state.pending[rowNumber] = entry;
  }
  saveState_(state);
}

function retryPending_(sheet, cols, state, force) {
  var now = Date.now();
  var rows = Object.keys(state.pending);
  for (var i = 0; i < rows.length; i++) {
    var rowNumber = Number(rows[i]);
    var entry = state.pending[rowNumber];
    if (!force && entry.nextTry && entry.nextTry > now) continue;

    if (entry.retries >= CONFIG.MAX_RETRIES) {
      log_('error', 'Row ' + rowNumber + ': giving up on ' + entry.recipients.map(recipientLabel_).join(', ') + ' after ' + entry.retries + ' retries.');
      delete state.pending[rowNumber];
      saveState_(state);
      continue;
    }

    var found = findRowByKey_(sheet, cols, rowNumber, entry.key);
    if (!found) {
      log_('warn', 'Row ' + rowNumber + ': lead no longer in the sheet; dropping its pending delivery.');
      delete state.pending[rowNumber];
      saveState_(state);
      continue;
    }

    entry.retries += 1;
    // 5, 10, 15 ... minutes, capped at an hour.
    entry.nextTry = now + Math.min(60, 5 * entry.retries) * 60000;
    deliver_(rowNumber, found, entry, state);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Telegram
// ─────────────────────────────────────────────────────────────────────────────

/** @return {'sent'|'failed'|'skipped'} */
function sendToRecipient_(idx, text) {
  var props = PropertiesService.getScriptProperties();
  var chatId = props.getProperty(CONFIG.RECIPIENT_KEYS[idx]);
  var token = props.getProperty('BOT_TOKEN');
  var label = recipientLabel_(idx);

  if (!chatId) {
    log_('warn', label + ' is not set; skipping that recipient.');
    return 'skipped';
  }
  if (!token) {
    log_('error', 'BOT_TOKEN is not set; cannot send to ' + label + '.');
    return 'failed';
  }

  var url = 'https://api.telegram.org/bot' + token + '/sendMessage';
  var options = {
    method: 'post',
    contentType: 'application/json',
    muteHttpExceptions: true,
    payload: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  };

  for (var attempt = 1; attempt <= 2; attempt++) {
    try {
      var response = UrlFetchApp.fetch(url, options);
      var code = response.getResponseCode();
      if (code === 200) return 'sent';

      log_('warn', label + ': Telegram answered ' + code + ' (' + describeTelegram_(response) + ').');
      // 429 and 5xx are worth one more go. Anything else — bad chat id, bot
      // blocked, bad token — will fail the same way again.
      if (code !== 429 && code < 500) return 'failed';
    } catch (err) {
      log_('warn', label + ': request failed (' + scrub_(err) + ').');
    }
    if (attempt < 2) Utilities.sleep(1000);
  }
  return 'failed';
}

/** Telegram's own error description. It never contains the token. */
function describeTelegram_(response) {
  try {
    var body = JSON.parse(response.getContentText());
    return String(body.description || 'no description').slice(0, 120);
  } catch (err) {
    return 'unreadable response';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Message
// ─────────────────────────────────────────────────────────────────────────────

function formatMessage_(lead) {
  var lines = ['🔔 <b>NEW ORAMEDHA LEAD</b>', ''];

  addField_(lines, 'Name', lead.name);
  addField_(lines, 'Phone', lead.mobile);
  addField_(lines, 'Email', lead.email);
  addField_(lines, 'Message', truncate_(lead.message, CONFIG.MAX_MESSAGE_CHARS));

  lines.push('');
  lines.push('<b>Received:</b> ' + escapeHtml_(formatReceived_(lead.receivedAt)));
  return lines.join('\n');
}

/** A field with no value is left out entirely: no blank label, no "undefined". */
function addField_(lines, label, value) {
  var clean = clean_(value);
  if (clean) lines.push('<b>' + label + ':</b> ' + escapeHtml_(clean));
}

function formatReceived_(value) {
  var date = null;
  if (Object.prototype.toString.call(value) === '[object Date]') {
    date = value;
  } else if (value) {
    date = new Date(String(value));
  }
  if (!date || isNaN(date.getTime())) date = new Date();
  return Utilities.formatDate(date, CONFIG.TIMEZONE, 'd MMM yyyy, h:mm a');
}

/** Telegram's HTML mode needs exactly these three escaped. */
function escapeHtml_(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function clean_(value) {
  if (value === null || value === undefined) return '';
  // Control characters out; ordinary line breaks in a message are kept.
  return String(value).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

function truncate_(value, max) {
  var text = clean_(value);
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sheet access
// ─────────────────────────────────────────────────────────────────────────────

function getLeadSheet_() {
  var name = PropertiesService.getScriptProperties().getProperty('SHEET_NAME') || CONFIG.SHEET_NAME;
  var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sheet) log_('error', 'No tab called "' + name + '". Rename the tab, or set a SHEET_NAME script property.');
  return sheet;
}

/** @return {Object|null} column indexes (0-based), or null if headers are wrong. */
function readColumns_(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (h) { return String(h).trim().toLowerCase(); });

  var cols = {};
  Object.keys(CONFIG.HEADERS).forEach(function (field) {
    cols[field] = -1;
    CONFIG.HEADERS[field].forEach(function (candidate) {
      var at = headers.indexOf(candidate);
      if (cols[field] === -1 && at !== -1) cols[field] = at;
    });
  });

  if (cols.name === -1 && cols.mobile === -1 && cols.email === -1) {
    log_('error', 'Row 1 has none of the expected headers (Name / Mobile / Email); not reading rows.');
    return null;
  }
  return cols;
}

function toLead_(row, cols) {
  function at(field) { return cols[field] === -1 ? '' : row[cols[field]]; }
  return {
    receivedAt: at('receivedAt'),
    name: at('name'),
    mobile: at('mobile'),
    email: at('email'),
    message: at('message')
  };
}

function isBlank_(row, cols) {
  var lead = toLead_(row, cols);
  return !clean_(lead.name) && !clean_(lead.mobile) && !clean_(lead.email) && !clean_(lead.message);
}

/**
 * Identifies a lead without storing it: a hash of timestamp + contact
 * details. Used to find a pending lead again if rows have been re-sorted.
 */
function leadKey_(lead) {
  var raw = [clean_(lead.receivedAt), clean_(lead.mobile), clean_(lead.email), clean_(lead.name)].join('|');
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return Utilities.base64Encode(digest).slice(0, 22);
}

/** Look at the remembered row first, then anywhere below the header. */
function findRowByKey_(sheet, cols, rowNumber, key) {
  var lastRow = sheet.getLastRow();
  var width = sheet.getLastColumn();
  if (rowNumber <= lastRow) {
    var here = toLead_(sheet.getRange(rowNumber, 1, 1, width).getValues()[0], cols);
    if (leadKey_(here) === key) return here;
  }
  if (lastRow < 2) return null;
  var all = sheet.getRange(2, 1, lastRow - 1, width).getValues();
  for (var i = 0; i < all.length; i++) {
    var lead = toLead_(all[i], cols);
    if (leadKey_(lead) === key) return lead;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// State (Script Properties)
// ─────────────────────────────────────────────────────────────────────────────

function loadState_() {
  var raw = PropertiesService.getScriptProperties().getProperty('STATE');
  if (!raw) return { lastRow: null, pending: {} };
  try {
    var state = JSON.parse(raw);
    if (!state.pending) state.pending = {};
    return state;
  } catch (err) {
    log_('error', 'STATE property is unreadable; not notifying until setup() is run again.');
    return { lastRow: null, pending: {} };
  }
}

function saveState_(state) {
  PropertiesService.getScriptProperties().setProperty('STATE', JSON.stringify(state));
}

// ─────────────────────────────────────────────────────────────────────────────
// Setup and helpers you run by hand from the Apps Script editor
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run once. Records where "now" is so existing leads are never announced, then
 * installs the trigger. Safe to run again: it never moves the watermark once
 * it has been set, so re-running can't re-announce old rows or skip new ones.
 */
function setup() {
  var sheet = getLeadSheet_();
  if (!sheet) return;

  var state = loadState_();
  if (state.lastRow === null) {
    state.lastRow = Math.max(sheet.getLastRow(), 1);
    saveState_(state);
    log_('info', 'Initialised. Existing rows up to ' + state.lastRow + ' will not be announced.');
  } else {
    log_('info', 'Already initialised (watermark at row ' + state.lastRow + '); left as it is.');
  }
  installTrigger();
  checkConfig();
}

/** Creates the On change trigger, replacing any earlier copy of it. */
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'onSheetChange') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onSheetChange')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onChange()
    .create();
  log_('info', 'Trigger installed: onSheetChange (On change).');
}

/** Says which settings exist. Never prints a value. */
function checkConfig() {
  var props = PropertiesService.getScriptProperties();
  ['BOT_TOKEN'].concat(CONFIG.RECIPIENT_KEYS).forEach(function (key) {
    log_(props.getProperty(key) ? 'info' : 'warn', key + (props.getProperty(key) ? ' is set.' : ' is NOT set.'));
  });
}

/**
 * Lists the chats that have recently messaged the bot, so each person's chat
 * ID can be read from the log instead of by putting the token in a browser
 * address bar. Each person must send the bot a message first (see README).
 */
function listRecentChats() {
  var token = PropertiesService.getScriptProperties().getProperty('BOT_TOKEN');
  if (!token) { log_('error', 'Set BOT_TOKEN first.'); return; }
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/getUpdates', { muteHttpExceptions: true });
  var body;
  try { body = JSON.parse(response.getContentText()); } catch (err) { log_('error', 'Unreadable response.'); return; }
  if (!body.ok) { log_('error', 'Telegram said: ' + describeTelegram_(response)); return; }

  var seen = {};
  (body.result || []).forEach(function (update) {
    var msg = update.message || update.my_chat_member || update.channel_post;
    var chat = msg && msg.chat;
    if (!chat || seen[chat.id]) return;
    seen[chat.id] = true;
    // Setup-time only: this is the one place a person's name is logged, so
    // you can tell which chat ID is whose.
    console.log('chat_id ' + chat.id + '  (' + chat.type + ')  ' + (chat.title || chat.first_name || chat.username || ''));
  });
  if (!Object.keys(seen).length) log_('warn', 'No chats yet. Have each person send the bot a message, then run this again.');
}

/** Sends a plain test line to all three recipients, no lead involved. */
function sendTestMessages() {
  var text = '✅ <b>OraMedha lead notifier</b>\nThis is a test message. Nothing to do.';
  CONFIG.RECIPIENT_KEYS.forEach(function (key, idx) {
    log_('info', recipientLabel_(idx) + ': ' + sendToRecipient_(idx, text));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Small utilities
// ─────────────────────────────────────────────────────────────────────────────

function allRecipients_() {
  return CONFIG.RECIPIENT_KEYS.map(function (key, idx) { return idx; });
}

function recipientLabel_(idx) {
  return CONFIG.RECIPIENT_KEYS[idx];
}

/**
 * Error text with the bot token removed. UrlFetchApp errors can quote the
 * request URL, and the token is part of it.
 */
function scrub_(err) {
  var text = err && err.message ? err.message : String(err);
  var token = PropertiesService.getScriptProperties().getProperty('BOT_TOKEN');
  if (token) text = text.split(token).join('[token]');
  return text.replace(/bot\d+:[A-Za-z0-9_-]+/g, 'bot[token]').slice(0, 200);
}

/** Levelled console logging. Callers pass row numbers and labels, never PII. */
function log_(level, message) {
  var line = '[lead-notifier] ' + message;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}
