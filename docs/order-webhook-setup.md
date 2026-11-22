# Order Webhook Setup (Google Sheets + Apps Script)

Follow these steps to automatically log every storefront order from **Bare & Bloom by Robaha** into a Google Sheet (and optionally receive an email alert) with zero backend hosting costs.

> Note: Even without a webhook configured, customers are always prompted with a **Confirm your order on WhatsApp** button containing their full order summary, and orders are queued locally on their device.

---

## Step 1: Create Your Orders Google Sheet

1. Open [Google Sheets](https://sheets.google.com) and create a new spreadsheet named **Bare & Bloom Orders**.
2. Rename the first tab to **`Orders`**.
3. Add the following column headers in **Row 1** (`A1:N1`):
   - `A1`: `Timestamp`
   - `B1`: `Order ID`
   - `C1`: `Customer Name`
   - `D1`: `Phone`
   - `E1`: `Email`
   - `F1`: `City`
   - `G1`: `Postal Code`
   - `H1`: `Street Address`
   - `I1`: `Payment Method`
   - `J1`: `Items`
   - `K1`: `Promo Code`
   - `L1`: `Subtotal (PKR)`
   - `M1`: `Discount (PKR)`
   - `N1`: `Shipping (PKR)`
   - `O1`: `Total (PKR)`

---

## Step 2: Add the Google Apps Script

1. In your Google Sheet, click **Extensions -> Apps Script**.
2. Delete any starter code in `Code.gs` and paste the complete script below:

```javascript
/**
 * Bare & Bloom by Robaha — Order Webhook Receiver
 * Appends incoming storefront orders to the "Orders" tab
 * and optionally sends an email alert to the store owner.
 */

var OWNER_EMAIL = ''; // Optional: set to 'you@example.com' for email alerts

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var order = JSON.parse(raw);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Orders') || ss.getSheets()[0];

    var itemsSummary = (order.items || [])
      .map(function (item) {
        return item.name + ' (' + item.variantLabel + ') x' + item.qty + ' @ PKR ' + item.price;
      })
      .join(' | ');

    var row = [
      order.createdAt || new Date().toISOString(),
      order.id || '',
      (order.customer && order.customer.fullName) || '',
      (order.customer && order.customer.phone) || '',
      (order.customer && order.customer.email) || '',
      (order.address && order.address.city) || '',
      (order.address && order.address.postalCode) || '',
      (order.address && order.address.streetAddress) || '',
      order.paymentMethod === 'bank' ? 'Bank/Raast/Wallet' : 'COD',
      itemsSummary,
      (order.totals && order.totals.appliedPromo) || '',
      (order.totals && order.totals.subtotal) || 0,
      (order.totals && order.totals.discount) || 0,
      (order.totals && order.totals.shipping) || 0,
      (order.totals && order.totals.total) || 0,
    ];

    sheet.appendRow(row);

    if (OWNER_EMAIL) {
      var subject = 'New Bare & Bloom Order #' + (order.id || '');
      var body =
        'Order ID: #' + (order.id || '') + '\n' +
        'Customer: ' + ((order.customer && order.customer.fullName) || '') + '\n' +
        'Phone: ' + ((order.customer && order.customer.phone) || '') + '\n' +
        'City: ' + ((order.address && order.address.city) || '') + '\n' +
        'Address: ' + ((order.address && order.address.streetAddress) || '') + '\n' +
        'Payment: ' + (order.paymentMethod === 'bank' ? 'Bank/Raast/Wallet' : 'COD') + '\n' +
        'Items: ' + itemsSummary + '\n' +
        'Total: PKR ' + ((order.totals && order.totals.total) || 0);
      MailApp.sendEmail(OWNER_EMAIL, subject, body);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (`Ctrl+S` / `Cmd+S`).

---

## Step 3: Deploy as a Web App

1. Click **Deploy -> New deployment**.
2. Click the gear icon next to *Select type* and choose **Web app**.
3. Set:
   - **Description**: `Bare & Bloom Order Webhook`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**, authorize the script permissions when prompted, and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

---

## Step 4: Connect to the Storefront

1. Open `src/config/store.js`.
2. Paste your copied URL into `ORDER_WEBHOOK_URL`:

```javascript
ORDER_WEBHOOK_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
```

3. Rebuild (`npm run build`) and redeploy `/dist`.
4. Place a test order and verify a new row appears in your Google Sheet.

> Note: The storefront sends orders using `fetch(..., { mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' } })` with an 8-second timeout so browser CORS preflight never blocks order placement.
