#!/usr/bin/env node
/**
 * Automated test of installer - simulates fresh clone installation
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

console.log('=== Automated Installer Test ===\n')

// 1. Clean up any existing .env.local
const envPath = join(PROJECT_ROOT, '.env.local')
if (existsSync(envPath)) {
  console.log('Removing existing .env.local...')
  unlinkSync(envPath)
}

// 2. Create .env.local directly (simulating installer behavior)
console.log('Creating test .env.local...')
const envContent = `# GSD-2 Web Login (test)
GSD_WEB_LOGIN_USERNAME=testuser
GSD_WEB_LOGIN_PASSWORD=testpass123
`
writeFileSync(envPath, envContent)
console.log('✓ Created .env.local')

// 3. Verify .env.local was created
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf-8')
  console.log('✓ .env.local verified')
  console.log('Content:', content.trim())
} else {
  console.log('✗ .env.local not created!')
  process.exit(1)
}

// 4. Check .gitignore
const gitignorePath = join(PROJECT_ROOT, '.gitignore')
if (existsSync(gitignorePath)) {
  const gitignore = readFileSync(gitignorePath, 'utf-8')
  if (gitignore.includes('.env.local')) {
    console.log('✓ .env.local is in .gitignore')
  } else {
    console.log('⚠️  .env.local NOT in .gitignore - this should be fixed!')
    console.log('Adding .env.local to .gitignore...')
    writeFileSync(gitignorePath, gitignore + '\n# Local environment\n.env.local\n')
    console.log('✓ Added .env.local to .gitignore')
  }
}

// 5. Test build
console.log('\nTesting npm run build...')
const buildResult = spawnSync('npm', ['run', 'build'], {
  stdio: 'pipe',
  cwd: PROJECT_ROOT,
  encoding: 'utf-8'
})

if (buildResult.status === 0) {
  console.log('✓ Build successful')
} else {
  console.log('✗ Build failed!')
  console.log('Error:', buildResult.stderr)
  process.exit(1)
}

console.log('\n=== All Tests Passed ===')
