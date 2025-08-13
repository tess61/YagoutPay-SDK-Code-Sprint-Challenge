# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Core encryption functionality
- Demo application
- Comprehensive documentation

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [1.0.0] - 2024-12-19

### Added
- **Core SDK functionality**
  - `buildEncryptedRequest()` function for creating encrypted payment requests
  - `buildEncryptedHash()` function for generating encrypted hash verification
  - `aesEncryptBase64()` utility for AES-256-CBC encryption
  - `sha256Hex()` utility for SHA-256 hash generation
  - `stringifySection()` utility for formatting request sections

- **Demo Application**
  - Complete Express.js demo server
  - Professional UI with modern design
  - Product selection interface
  - Payment flow simulation
  - Success/failure handling
  - PDF receipt generation
  - Responsive design for mobile devices

- **Documentation**
  - Comprehensive README with installation and usage instructions
  - API reference with parameter documentation
  - Security considerations and best practices
  - Contributing guidelines
  - MIT License

- **Project Structure**
  - Modular code organization
  - Environment variable configuration
  - Professional project setup
  - Git ignore rules
  - Package.json with proper metadata

### Technical Details
- **Encryption**: AES-256-CBC with PKCS#7 padding, static IV
- **Hash**: SHA-256 with additional AES encryption layer
- **Compatibility**: Node.js 18+
- **Dependencies**: Zero external dependencies for core functionality
- **Demo Dependencies**: Express.js, dotenv, pdfkit, express-session

### Security Features
- Server-side encryption only (no client-side key exposure)
- Environment variable configuration
- Input validation and sanitization
- Secure hash verification
- HTTPS enforcement recommendations

---

## Version History

- **1.0.0**: Initial release with core SDK functionality and demo application

## Release Notes

### Version 1.0.0
This is the initial release of the YagoutPay JavaScript SDK. The SDK provides a complete solution for integrating with the YagoutPay Aggregator Hosted payment gateway, including:

- Secure encryption and hash generation
- Comprehensive demo application
- Professional documentation
- Production-ready code quality

The SDK is designed to be lightweight, secure, and easy to integrate into existing Node.js applications.
