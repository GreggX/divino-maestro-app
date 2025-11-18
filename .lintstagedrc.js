module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    // 1. Run secret scanner
    'node scripts/check-secrets.js',
    // 2. Check TypeScript types
    () => 'tsc --noEmit',
    // 3. Run ESLint and auto-fix
    'eslint --fix --max-warnings=0',
    // 4. Format with Prettier
    'prettier --write',
    // 5. Run related tests
    'jest --bail --findRelatedTests --passWithNoTests',
  ],
  // JSON and Markdown files
  '*.{json,md}': ['prettier --write'],
  // CSS and SCSS files
  '*.{css,scss}': ['prettier --write'],
};
