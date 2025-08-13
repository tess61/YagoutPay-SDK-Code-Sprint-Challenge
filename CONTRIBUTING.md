# Contributing to YagoutPay SDK

Thank you for your interest in contributing to the YagoutPay JavaScript SDK! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

We welcome contributions from the community! Here are the main ways you can help:

### 🐛 Reporting Bugs

- Use the [GitHub Issues](https://github.com/yourusername/yagoutpay-sdk-js/issues) page
- Include a clear description of the problem
- Provide steps to reproduce the issue
- Include your Node.js version and operating system
- Add error messages and stack traces if applicable

### 💡 Suggesting Enhancements

- Use the [GitHub Issues](https://github.com/yourusername/yagoutpay-sdk-js/issues) page
- Clearly describe the feature you'd like to see
- Explain why this feature would be useful
- Include any relevant use cases

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the coding standards below
4. **Test your changes**:
   ```bash
   npm test
   npm run start:demo
   ```
5. **Commit your changes** with clear commit messages
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## 📋 Development Setup

1. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/yagoutpay-sdk-js.git
   cd yagoutpay-sdk-js
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your test credentials
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Start demo**:
   ```bash
   npm run start:demo
   ```

## 📝 Coding Standards

### JavaScript/Node.js

- Use **ES6+** features
- Follow **ESLint** configuration
- Use **JSDoc** comments for all public functions
- Prefer **const** and **let** over **var**
- Use **async/await** over callbacks when possible
- Keep functions small and focused

### Code Style

```javascript
/**
 * Example function with JSDoc
 * @param {string} param1 - Description of parameter
 * @param {Object} options - Options object
 * @param {string} options.key - Option key
 * @returns {Promise<string>} Description of return value
 */
export async function exampleFunction(param1, options = {}) {
  const { key = 'default' } = options;
  
  try {
    // Implementation
    return result;
  } catch (error) {
    throw new Error(`Failed to process: ${error.message}`);
  }
}
```

### File Naming

- Use **kebab-case** for file names: `my-feature.js`
- Use **PascalCase** for classes: `MyClass`
- Use **camelCase** for functions and variables: `myFunction`

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat: add new encryption method`
- `fix(utils): resolve string encoding issue`
- `docs: update API documentation`
- `test: add unit tests for hash generation`

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Use **Jest** as the testing framework
- Place test files next to source files: `src/feature.js` → `src/feature.test.js`
- Test both success and error cases
- Mock external dependencies
- Aim for >90% code coverage

Example test:

```javascript
import { buildEncryptedRequest } from '../src/yagoutpay.js';

describe('buildEncryptedRequest', () => {
  it('should encrypt request with valid parameters', () => {
    const result = buildEncryptedRequest({
      merchantId: 'test123',
      merchantKey: 'testKey',
      txnDetails: {
        order_no: 'ORDER_123',
        amount: '10.00'
      }
    });
    
    expect(result.me_id).toBe('test123');
    expect(result.merchant_request).toBeDefined();
  });
});
```

## 📚 Documentation

### Code Documentation

- Use **JSDoc** for all public functions
- Include parameter types and descriptions
- Document return values and exceptions
- Provide usage examples

### README Updates

- Update README.md when adding new features
- Include code examples
- Update API documentation
- Add new sections as needed

## 🔒 Security

### Security Guidelines

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all input parameters
- Follow security best practices
- Report security issues privately

### Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do not** create a public GitHub issue
2. Email security details to: security@yagoutpay.com
3. Include "SECURITY VULNERABILITY" in the subject line
4. Provide detailed information about the issue

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/) (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

Before releasing:

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped in package.json
- [ ] Demo application works correctly
- [ ] Security review completed

## 🎯 Areas for Contribution

### High Priority

- [ ] Add TypeScript definitions
- [ ] Improve error handling
- [ ] Add more comprehensive tests
- [ ] Performance optimizations
- [ ] Additional payment methods

### Medium Priority

- [ ] Add more examples
- [ ] Improve documentation
- [ ] Add integration tests
- [ ] Code coverage improvements
- [ ] Performance benchmarking

### Low Priority

- [ ] UI/UX improvements for demo
- [ ] Additional language support
- [ ] More payment gateway integrations
- [ ] Community examples

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: support@yagoutpay.com for urgent issues

## 🙏 Recognition

Contributors will be recognized in:

- GitHub contributors list
- README.md acknowledgments
- Release notes
- Project documentation

Thank you for contributing to the YagoutPay SDK! 🚀
