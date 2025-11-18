#!/usr/bin/env node

/**
 * Secret Scanner for Git Commits
 * Prevents committing sensitive data like API keys, tokens, passwords, etc.
 */

const fs = require('fs');
const path = require('path');

// Patterns to detect secrets
const SECRET_PATTERNS = [
  // API Keys and Tokens
  { pattern: /['"]?[A-Z_]*API[_KEY|_TOKEN]['"]?\s*[:=]\s*['"][A-Za-z0-9-_]{20,}['"]/, name: 'API Key' },
  { pattern: /['"]?[A-Z_]*SECRET['"]?\s*[:=]\s*['"][A-Za-z0-9-_]{20,}['"]/, name: 'Secret Key' },
  { pattern: /['"]?[A-Z_]*TOKEN['"]?\s*[:=]\s*['"][A-Za-z0-9-_]{20,}['"]/, name: 'Access Token' },

  // AWS Keys
  { pattern: /AKIA[0-9A-Z]{16}/, name: 'AWS Access Key ID' },
  { pattern: /aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}/, name: 'AWS Secret Access Key' },

  // Private Keys
  { pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/, name: 'Private Key' },

  // Database URLs with passwords
  { pattern: /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/, name: 'MongoDB URL with credentials' },
  { pattern: /postgres:\/\/[^:]+:[^@]+@/, name: 'PostgreSQL URL with credentials' },
  { pattern: /mysql:\/\/[^:]+:[^@]+@/, name: 'MySQL URL with credentials' },

  // Generic passwords
  { pattern: /['"]?password['"]?\s*[:=]\s*['"][^'"]{8,}['"]/, name: 'Hardcoded Password' },

  // JWT tokens
  { pattern: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/, name: 'JWT Token' },
];

// Files to always block
const BLOCKED_FILES = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  'credentials.json',
  'service-account.json',
  'private-key.pem',
];

// Get files to check from command line arguments
const filesToCheck = process.argv.slice(2);

let foundSecrets = false;

// Check for blocked files
for (const file of filesToCheck) {
  const filename = path.basename(file);

  if (BLOCKED_FILES.includes(filename)) {
    console.error(`\n❌ ERROR: Attempting to commit sensitive file: ${file}`);
    console.error('   This file should never be committed to version control.');
    console.error('   Add it to .gitignore instead.\n');
    foundSecrets = true;
    continue;
  }

  // Skip if file doesn't exist or is not a text file
  if (!fs.existsSync(file)) continue;

  const ext = path.extname(file);
  const textExtensions = ['.js', '.ts', '.tsx', '.jsx', '.json', '.env', '.txt', '.md', '.yml', '.yaml', '.toml'];
  if (!textExtensions.includes(ext) && ext !== '') continue;

  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    // Check each line for secret patterns
    lines.forEach((line, index) => {
      for (const { pattern, name } of SECRET_PATTERNS) {
        if (pattern.test(line)) {
          console.error(`\n❌ SECURITY: Potential ${name} detected!`);
          console.error(`   File: ${file}:${index + 1}`);
          console.error(`   Line: ${line.trim().substring(0, 80)}...`);
          console.error(`   \n   Please remove sensitive data before committing.\n`);
          foundSecrets = true;
        }
      }
    });
  } catch (error) {
    // Skip binary files or files that can't be read
    continue;
  }
}

if (foundSecrets) {
  console.error('🔒 Secret scanning failed! Commit blocked for security reasons.\n');
  process.exit(1);
}

console.log('✅ Secret scanning passed');
process.exit(0);
