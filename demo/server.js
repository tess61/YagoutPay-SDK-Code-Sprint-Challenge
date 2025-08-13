// demo/server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { buildEncryptedRequest, buildEncryptedHash } from '../src/yagoutpay.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MERCHANT_ID = process.env.MERCHANT_ID;
const MERCHANT_KEY = process.env.MERCHANT_KEY;
const YAGOUT_UAT_URL = process.env.YAGOUT_UAT_URL || 'https://uatcheckout.yagoutpay.com/ms-transaction-core-1-0/paymentRedirection/checksumGatewayPage';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Home → Login
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

// Fake login
app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email && password) {
    return res.redirect('/products');
  }
  res.redirect('/');
});

// Products
app.get('/products', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'products.html'));
});

// Pay
app.post('/pay', (req, res) => {
  const {
    product_id = 'pro1',
    product_name = 'Cloud Backup – Starter',
    amount = '149',
    email_id,
    mobile_no
  } = req.body || {};

  const order_no = `ORDER_${Date.now()}`;
  const success_url = `${BASE_URL}/success?order_no=${order_no}&product_name=${encodeURIComponent(product_name)}&amount=${amount}`;
  const failure_url = `${BASE_URL}/failure?order_no=${order_no}&reason=payment_failed`;

  const { me_id, merchant_request } = buildEncryptedRequest({
    merchantId: MERCHANT_ID,
    merchantKey: MERCHANT_KEY,
    txnDetails: {
      ag_id: 'yagout',
      me_id: MERCHANT_ID,
      order_no,
      amount: String(amount),
      country: 'ETH',
      currency: 'ETB',
      txn_type: 'SALE',
      success_url,
      failure_url,
      channel: 'WEB'
    },
    custDetails: { cust_name: '', email_id: email_id || '', mobile_no: mobile_no || '', unique_id: '', is_logged_in: 'Y' },
  });

  const { hash } = buildEncryptedHash({
    merchantId: MERCHANT_ID,
    merchantKey: MERCHANT_KEY,
    order_no,
    amount: String(amount),
    currencyFrom: 'ETH',
    currencyTo: 'ETB'
  });

  res.set('Content-Type', 'text/html');
  res.send(`
<!doctype html>
<html>
  <body>
    <form id="gatewayForm" method="POST" action="${YAGOUT_UAT_URL}">
      <input type="hidden" name="me_id" value="${me_id}" />
      <input type="hidden" name="merchant_request" value="${merchant_request}" />
      <input type="hidden" name="hash" value="${hash}" />
      <noscript><button type="submit">Continue</button></noscript>
    </form>
    <script>document.getElementById('gatewayForm').submit();</script>
  </body>
</html>
  `);
});

// Success page (works for GET & POST)
app.all('/success', (req, res) => {
  const order_no = req.query.order_no || req.body.order_no;
  const product_name = req.query.product_name || req.body.product_name;
  const amount = req.query.amount || req.body.amount;

  // Redirect to success page with query params if they came in POST
  if (req.method === 'POST' && !req.query.order_no) {
    const params = new URLSearchParams({
      order_no: order_no || '',
      product_name: product_name || '',
      amount: amount || ''
    });
    return res.redirect(`/success?${params.toString()}`);
  }

  res.sendFile(path.join(__dirname, 'public', 'views', 'success.html'));
});

// Failure page (works for GET & POST)
app.all('/failure', (req, res) => {
  const order_no = req.query.order_no || req.body.order_no;
  const reason = req.query.reason || req.body.reason || 'Payment failed';

  if (req.method === 'POST' && !req.query.reason) {
    const params = new URLSearchParams({
      order_no: order_no || '',
      reason: reason
    });
    return res.redirect(`/failure?${params.toString()}`);
  }

  res.sendFile(path.join(__dirname, 'public', 'views', 'failure.html'));
});

// PDF download
app.get('/receipt.pdf', (req, res) => {
  const { order_no, product_name, amount } = req.query;
  if (!order_no || !product_name || !amount) return res.redirect('/products');

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="receipt_${order_no}.pdf"`);
  doc.pipe(res);

  // Header
  doc.rect(0, 0, 612, 80).fill('#0b1220');
  doc.fillColor('white').fontSize(20).text('YagoutPay Demo Shop', 50, 30);

  // Body
  doc.fillColor('#111').fontSize(24).text('Payment Receipt', 50, 120);
  doc.moveDown();
  doc.fontSize(12).fillColor('#333')
    .text(`Order No: ${order_no}`)
    .text(`Product: ${product_name}`)
    .text(`Amount: ${amount} ETB`)
    .text(`Currency: ETB`)
    .text(`Status: SUCCESS`);

  doc.end();
});

const port = 3000;
app.listen(port, () => console.log(`Demo running on http://localhost:${port}`));
