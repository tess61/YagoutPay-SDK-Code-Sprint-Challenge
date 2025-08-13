
// src/yagoutpay.js
import crypto from 'crypto';
import { stringifySection } from './utils.js';

/**
 * AES-256-CBC (base64 key) with PKCS#7 padding, static IV "0123456789abcdef"
 * @param {string} plaintext - utf8 string to encrypt
 * @param {string} base64Key - base64-encoded 32-byte key
 * @returns {string} base64 ciphertext
 */
export function aesEncryptBase64(plaintext, base64Key) {
  const key = Buffer.from(base64Key, 'base64');
  if (key.length !== 32) {
    throw new Error(`Invalid key length: expected 32 bytes after base64 decode, got ${key.length}`);
  }
  const iv = Buffer.from('0123456789abcdef', 'utf8'); // 16 bytes
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return enc.toString('base64');
}

export function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Build full merchant_request (sections joined by '~') and encrypt it.
 * Only me_id is sent in plain text separately.
 */
export function buildEncryptedRequest({
  merchantId,
  merchantKey,
  txnDetails,
  pgDetails = {},
  cardDetails = {},
  custDetails = {},
  billDetails = {},
  shipDetails = {},
  itemDetails = {},
  upiDetails = {},
  otherDetails = {}
}) {
  // Defaults per docs; keep strict order of fields within each section
  const txn_defaults = {
    ag_id: 'yagout',
    me_id: merchantId,
    order_no: '',
    amount: '',
    country: 'ETH',
    currency: 'ETB',
    txn_type: 'SALE',
    success_url: '',
    failure_url: '',
    channel: 'WEB',
  };

  const pg_defaults = { pg_id: '', paymode: '', scheme: '', wallet_type: '' };

  const card_defaults = { card_no: '', exp_month: '', exp_year: '', cvv: '', card_name: '' };

  const cust_defaults = { cust_name: '', email_id: '', mobile_no: '', unique_id: '', is_logged_in: 'Y' };

  const bill_defaults = { bill_address: '', bill_city: '', bill_state: '', bill_country: '', bill_zip: '' };

  const ship_defaults = { ship_address: '', ship_city: '', ship_state: '', ship_country: '', ship_zip: '', ship_days: '', address_count: '' };

  const item_defaults = { item_count: '', item_value: '', item_category: '' };

  // UPI details not specified in the guide we have; send blank section
  const upi_defaults = {};

  const other_defaults = { udf_1: '', udf_2: '', udf_3: '', udf_4: '', udf_5: '' };

  const txn = { ...txn_defaults, ...txnDetails };
  const pg = { ...pg_defaults, ...pgDetails };
  const card = { ...card_defaults, ...cardDetails };
  const cust = { ...cust_defaults, ...custDetails };
  const bill = { ...bill_defaults, ...billDetails };
  const ship = { ...ship_defaults, ...shipDetails };
  const item = { ...item_defaults, ...itemDetails };
  const upi = { ...upi_defaults, ...upiDetails };
  const other = { ...other_defaults, ...otherDetails };

  // Build section strings in documented order (fields pipe-delimited)
  const txn_str = stringifySection(txn, [
    'ag_id','me_id','order_no','amount','country','currency','txn_type','success_url','failure_url','channel'
  ]);
  const pg_str = stringifySection(pg, ['pg_id','paymode','scheme','wallet_type']);
  const card_str = stringifySection(card, ['card_no','exp_month','exp_year','cvv','card_name']);
  const cust_str = stringifySection(cust, ['cust_name','email_id','mobile_no','unique_id','is_logged_in']);
  const bill_str = stringifySection(bill, ['bill_address','bill_city','bill_state','bill_country','bill_zip']);
  const ship_str = stringifySection(ship, ['ship_address','ship_city','ship_state','ship_country','ship_zip','ship_days','address_count']);
  const item_str = stringifySection(item, ['item_count','item_value','item_category']);
  // UPI details (unspecified): send empty string to keep section placeholder
  const upi_str = stringifySection(upi, []);
  const other_str = stringifySection(other, ['udf_1','udf_2','udf_3','udf_4','udf_5']);

  const full_message = [
    txn_str, pg_str, card_str, cust_str, bill_str, ship_str, item_str, upi_str, other_str
  ].join('~');

  const merchant_request = aesEncryptBase64(full_message, merchantKey);

  return { me_id: merchantId, merchant_request, full_message };
}

/**
 * Build encrypted hash according to instructions:
 * sha256Hex(`${merchantId}~${order_no}~${amount}~${currencyFrom}~${currencyTo}`) then AES encrypt.
 */
export function buildEncryptedHash({ merchantId, merchantKey, order_no, amount, currencyFrom='ETH', currencyTo='ETB' }) {
  const hash_input = `${merchantId}~${order_no}~${amount}~${currencyFrom}~${currencyTo}`;
  const sha = sha256Hex(hash_input);
  const encrypted_hash = aesEncryptBase64(sha, merchantKey);
  return { hash: encrypted_hash, hash_input, sha256: sha };
}
