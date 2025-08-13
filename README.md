
# YagoutPay JavaScript SDK

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/badge/npm-v1.0.0-orange.svg)](https://www.npmjs.com/package/yagoutpay-sdk-js)

A lightweight, production-ready Node.js SDK for integrating with the **YagoutPay Aggregator Hosted (Non-Seamless)** payment gateway. This SDK implements AES-256-CBC encryption and SHA-256 hash verification for secure payment processing.

## 🚀 Features

- **🔐 Secure Encryption**: AES-256-CBC encryption with PKCS#7 padding
- **🛡️ Hash Verification**: SHA-256 hash with additional encryption layer
- **📦 Lightweight**: Zero external dependencies for core functionality
- **🎯 TypeScript Ready**: Full TypeScript support with JSDoc comments
- **📖 Comprehensive Demo**: Complete Express.js demo with UI
- **🌍 Production Ready**: Battle-tested in production environments

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- YagoutPay merchant account

## 🛠️ Installation

```bash
npm install yagoutpay-sdk-js
```

Or clone the repository:

```bash
git clone https://github.com/yourusername/yagoutpay-sdk-js.git
cd yagoutpay-sdk-js
npm install
```

## ⚡ Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
MERCHANT_ID=your_merchant_id_here
MERCHANT_KEY=your_base64_encoded_merchant_key_here
YAGOUT_UAT_URL=https://uatcheckout.yagoutpay.com/ms-transaction-core-1-0/paymentRedirection/checksumGatewayPage
BASE_URL=http://localhost:3000
```

### 2. Basic Integration

```javascript
import { buildEncryptedRequest, buildEncryptedHash } from 'yagoutpay-sdk-js';

// Build the encrypted request
const { me_id, merchant_request } = buildEncryptedRequest({
  merchantId: process.env.MERCHANT_ID,
  merchantKey: process.env.MERCHANT_KEY,
  txnDetails: {
    ag_id: 'yagout',
    me_id: process.env.MERCHANT_ID,
    order_no: 'ORDER_123',
    amount: '10.00',
    country: 'ETH',
    currency: 'ETB',
    txn_type: 'SALE',
    success_url: 'https://yourapp.com/success',
    failure_url: 'https://yourapp.com/failure',
    channel: 'WEB'
  },
  custDetails: {
    cust_name: 'John Doe',
    email_id: 'john@example.com',
    mobile_no: '0912345678',
    unique_id: '',
    is_logged_in: 'Y'
  }
});

// Build the encrypted hash
const { hash } = buildEncryptedHash({
  merchantId: process.env.MERCHANT_ID,
  merchantKey: process.env.MERCHANT_KEY,
  order_no: 'ORDER_123',
  amount: '10.00',
  currencyFrom: 'ETH',
  currencyTo: 'ETB'
});

// Redirect to YagoutPay gateway
const formData = new URLSearchParams({
  me_id,
  merchant_request,
  hash
});

// POST to YagoutPay UAT URL
fetch(process.env.YAGOUT_UAT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: formData
});
```

## 🎮 Demo Application

Run the included demo application to see the SDK in action:

```bash
npm run start:demo
```

Then visit `http://localhost:3000` to explore:
- ✅ Product selection interface
- 💳 Secure checkout flow
- 📄 Success/failure handling
- 📊 Transaction receipt generation

## 📚 API Reference

### `buildEncryptedRequest(options)`

Builds and encrypts the complete merchant request payload.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchantId` | `string` | ✅ | Your YagoutPay merchant ID |
| `merchantKey` | `string` | ✅ | Base64-encoded merchant key |
| `txnDetails` | `object` | ✅ | Transaction details |
| `custDetails` | `object` | ❌ | Customer information |
| `billDetails` | `object` | ❌ | Billing address |
| `shipDetails` | `object` | ❌ | Shipping address |

#### Returns

```javascript
{
  me_id: string,           // Merchant ID (plain text)
  merchant_request: string, // Encrypted request payload
  full_message: string     // Original unencrypted message (for debugging)
}
```

### `buildEncryptedHash(options)`

Generates the encrypted hash for request verification.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchantId` | `string` | ✅ | Your YagoutPay merchant ID |
| `merchantKey` | `string` | ✅ | Base64-encoded merchant key |
| `order_no` | `string` | ✅ | Unique order identifier |
| `amount` | `string` | ✅ | Transaction amount |
| `currencyFrom` | `string` | ❌ | Source currency (default: 'ETH') |
| `currencyTo` | `string` | ❌ | Target currency (default: 'ETB') |

#### Returns

```javascript
{
  hash: string,        // Encrypted hash
  hash_input: string,  // Original hash input string
  sha256: string       // SHA-256 hash (for debugging)
}
```

## 🔧 Configuration

### Transaction Details Schema

```javascript
const txnDetails = {
  ag_id: 'yagout',                    // Aggregator ID (fixed)
  me_id: 'your_merchant_id',          // Your merchant ID
  order_no: 'ORDER_123',              // Unique order number
  amount: '10.00',                    // Transaction amount
  country: 'ETH',                     // Country code
  currency: 'ETB',                    // Currency code
  txn_type: 'SALE',                   // Transaction type
  success_url: 'https://...',         // Success callback URL
  failure_url: 'https://...',         // Failure callback URL
  channel: 'WEB'                      // Channel type
};
```

### Customer Details Schema

```javascript
const custDetails = {
  cust_name: 'John Doe',              // Customer name
  email_id: 'john@example.com',       // Customer email
  mobile_no: '0912345678',            // Customer mobile
  unique_id: '',                      // Unique customer ID
  is_logged_in: 'Y'                   // Login status
};
```

## 🔒 Security Considerations

⚠️ **Important Security Notes:**

1. **Never expose your merchant key** in frontend code
2. Always generate `merchant_request` and `hash` on your server
3. Use HTTPS in production environments
4. Validate all callback data from YagoutPay
5. Store sensitive configuration in environment variables

## 🧪 Testing

The SDK includes comprehensive test coverage. Run tests with:

```bash
npm test
```

## 📦 Build

Build the SDK for production:

```bash
npm run build
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@yagoutpay.com
- 📖 Documentation: [YagoutPay API Docs](https://docs.yagoutpay.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/yagoutpay-sdk-js/issues)

## 🙏 Acknowledgments

- YagoutPay team for the integration documentation
- Node.js crypto module for encryption utilities
- Express.js for the demo application framework

---

**Made with ❤️ for the Ethiopian fintech community**

