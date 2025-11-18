# Git Hooks Setup

This document describes the git hooks configuration for automated code quality checks.

## Overview

The project uses **Husky v9** with **lint-staged** and **commitlint** to ensure code quality and consistency before commits and pushes.

## Tools Used

- **Husky v9**: Modern git hooks manager (2kB, zero dependencies)
- **lint-staged**: Run linters and formatters on staged files only
- **commitlint**: Enforce conventional commit message format
- **Custom secret scanner**: Prevent committing sensitive data

## Git Hooks

### Pre-Commit Hook

Runs automatically before every commit. Checks **only staged files** for maximum performance.

**Checks performed:**
1. 🔒 **Secret scanning** - Detects API keys, tokens, passwords, private keys
2. ✅ **TypeScript type checking** - Ensures no type errors (`tsc --noEmit`)
3. 🎨 **ESLint** - Lints code and auto-fixes issues
4. 💅 **Prettier** - Auto-formats code
5. 🧪 **Unit tests** - Runs tests related to changed files only

**Files checked:**
- TypeScript/JavaScript: `*.{ts,tsx,js,jsx}`
- JSON/Markdown: `*.{json,md}`
- CSS/SCSS: `*.{css,scss}`

**Location**: `.husky/pre-commit`

### Commit Message Hook

Validates commit message format using conventional commits standard.

**Required format:**
```
<type>: <subject>

<optional body>

<optional footer>
```

**Allowed types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes (dependencies, etc.)
- `revert`: Revert previous commit

**Examples:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for auth service"
```

**Location**: `.husky/commit-msg`

### Pre-Push Hook

Runs automatically before pushing to remote. Performs comprehensive checks that are too slow for pre-commit.

**Checks performed:**
1. 🧪 **E2E tests** - Full end-to-end test suite
2. 🔒 **Security audit** - `npm audit` for vulnerable dependencies

**Location**: `.husky/pre-push`

## Secret Scanner

Custom Node.js script that prevents committing sensitive data.

**Detects:**
- API keys and tokens
- AWS access keys and secrets
- Private keys (RSA, EC, DSA)
- Database URLs with credentials
- Hardcoded passwords
- JWT tokens

**Blocked files:**
- `.env`, `.env.local`, `.env.production`, `.env.development`
- `credentials.json`, `service-account.json`
- `private-key.pem`

**Location**: `scripts/check-secrets.js`

## Configuration Files

### `.lintstagedrc.js`
Defines which checks run on which file types.

```javascript
module.exports = {
  '*.{ts,tsx,js,jsx}': [
    'node scripts/check-secrets.js',
    () => 'tsc --noEmit',
    'eslint --fix --max-warnings=0',
    'prettier --write',
    'jest --bail --findRelatedTests --passWithNoTests',
  ],
  '*.{json,md}': ['prettier --write'],
  '*.{css,scss}': ['prettier --write'],
};
```

### `commitlint.config.js`
Defines commit message rules.

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', ...]],
    'subject-case': [2, 'never', ['upper-case']],
    'header-max-length': [2, 'always', 100],
  },
};
```

## Usage

### Installation

Hooks are automatically installed when running:
```bash
npm install
```

The `prepare` script in `package.json` initializes Husky.

### Manual Hook Execution

```bash
# Run lint-staged manually
npm run lint-staged

# Test commit message format
npx commitlint --edit <commit-msg-file>

# Run secret scanner on specific files
node scripts/check-secrets.js path/to/file.ts
```

### Bypassing Hooks (Not Recommended)

In rare cases where you need to bypass hooks:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

**⚠️ Warning**: Only bypass hooks in emergencies. All checks will still run in CI/CD.

## Troubleshooting

### Hook not running

1. Ensure hooks are executable:
   ```bash
   chmod +x .husky/pre-commit .husky/commit-msg .husky/pre-push
   ```

2. Verify Husky is installed:
   ```bash
   npm run prepare
   ```

### TypeScript errors in pre-commit

Fix type errors before committing:
```bash
npm run typecheck
```

### ESLint failures

Auto-fix ESLint issues:
```bash
npm run lint:fix
```

### Commit message rejected

Follow conventional commit format:
```bash
# Bad
git commit -m "Fixed bug"

# Good
git commit -m "fix: resolve authentication bug"
```

### Secret scanner false positive

If the scanner incorrectly flags code:
1. Review the flagged content
2. If it's not actually a secret, modify the pattern in `scripts/check-secrets.js`
3. Consider using environment variables instead of hardcoded values

### E2E tests failing on push

Run E2E tests locally before pushing:
```bash
npm run test:e2e
```

Fix failing tests before pushing to remote.

## Performance Optimization

### Staged Files Only

lint-staged only checks files you're committing, not the entire codebase. This keeps commits fast.

### Parallel Execution

Multiple checks run in parallel where possible (formatting, linting).

### Smart Test Selection

Jest only runs tests related to changed files using `--findRelatedTests`.

### Skip Slow Checks in Pre-Commit

E2E tests and security audits run in pre-push, not pre-commit, to keep commits fast.

## CI/CD Integration

While git hooks provide client-side checks, CI/CD pipelines should run the same checks:

```yaml
# Example GitHub Actions workflow
- run: npm run typecheck
- run: npm run lint
- run: npm test
- run: npm run test:e2e
- run: npm audit
```

This ensures code quality even if hooks are bypassed.

## Best Practices

1. **Never bypass hooks** without good reason
2. **Commit frequently** - Small commits are faster to check
3. **Fix issues immediately** - Don't let lint/type errors accumulate
4. **Use conventional commits** - Helps with changelog generation
5. **Keep secrets in .env** - Never hardcode sensitive data
6. **Run tests locally** before pushing

## Customization

### Adding New Checks

Edit `.lintstagedrc.js` to add new checks:

```javascript
'*.{ts,tsx}': [
  'node scripts/check-secrets.js',
  () => 'tsc --noEmit',
  'eslint --fix --max-warnings=0',
  'prettier --write',
  'jest --bail --findRelatedTests --passWithNoTests',
  'your-custom-check', // Add your check here
],
```

### Modifying Secret Patterns

Edit `scripts/check-secrets.js` to add or modify patterns:

```javascript
const SECRET_PATTERNS = [
  { pattern: /your-pattern-here/, name: 'Your Secret Type' },
  // ... existing patterns
];
```

### Changing Commit Message Rules

Edit `commitlint.config.js` to customize rules:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 120], // Change max length
    // Add custom rules
  },
};
```

## Migration from Old Setup

If upgrading from an older git hooks setup:

1. Remove old hooks:
   ```bash
   rm -rf .git/hooks/*
   ```

2. Reinstall dependencies:
   ```bash
   npm install
   ```

3. Run prepare script:
   ```bash
   npm run prepare
   ```

## Support

For issues with git hooks:
1. Check this documentation
2. Review hook output for specific errors
3. Ensure all dependencies are installed (`npm install`)
4. Verify Node.js version (≥22.0.0)

---

**Last Updated**: 2025-01-17
