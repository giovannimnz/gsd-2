#!/usr/bin/env node
/**
 * Test script to verify installer works without interactive prompts
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

console.log('Testing installer components...\n')

// 1. Check Node version
console.log('1. Node.js version:', process.version)
const nodeVersion = process.version.replace('v', '').split('.').map(Number)
if (nodeVersion[0] < 22) {
  console.log('   ⚠️  Warning: Node.js < 22.0.0 may have issues with top-level await')
} else {
  console.log('   ✓ Node.js version OK')
}

// 2. Check @clack/prompts dependency
console.log('\n2. Checking @clack/prompts...')
try {
  const packageJson = JSON.parse(readFileSync(join(PROJECT_ROOT, 'package.json'), 'utf-8'))
  if (packageJson.dependencies?.['@clack/prompts']) {
    console.log('   ✓ @clack/prompts in package.json:', packageJson.dependencies['@clack/prompts'])
  } else {
    console.log('   ✗ @clack/prompts not in dependencies')
  }
} catch (err) {
  console.log('   ✗ Error reading package.json:', err.message)
}

// 3. Check if @clack/prompts can be imported
console.log('\n3. Testing @clack/prompts import...')
try {
  const p = await import('@clack/prompts')
  console.log('   ✓ @clack/prompts imported successfully')
} catch (err) {
  console.log('   ✗ Failed to import @clack/prompts:', err.message)
  console.log('   This is the ERROR users are encountering!')
}

// 4. Check first-install.mjs syntax
console.log('\n4. Checking first-install.mjs syntax...')
try {
  const result = spawnSync('node', ['--check', join(PROJECT_ROOT, 'scripts', 'first-install.mjs')], {
    stdio: 'pipe',
    encoding: 'utf-8'
  })
  if (result.status === 0) {
    console.log('   ✓ first-install.mjs syntax OK')
  } else {
    console.log('   ✗ Syntax error:', result.stderr)
  }
} catch (err) {
  console.log('   ✗ Error checking syntax:', err.message)
}

// 5. Test npm install (dry run)
console.log('\n5. Testing npm install --dry-run...')
const npmResult = spawnSync('npm', ['install', '--dry-run'], {
  stdio: 'pipe',
  cwd: PROJECT_ROOT,
  encoding: 'utf-8'
})
if (npmResult.status === 0) {
  console.log('   ✓ npm install --dry-run OK')
} else {
  console.log('   ✗ npm install --dry-run failed:', npmResult.stderr)
}

// 6. Check .env.local
console.log('\n6. Checking .env.local...')
if (existsSync(join(PROJECT_ROOT, '.env.local'))) {
  console.log('   ✓ .env.local exists')
  const content = readFileSync(join(PROJECT_ROOT, '.env.local'), 'utf-8')
  console.log('   Content:', content.trim())
} else {
  console.log('   .env.local does not exist (expected for fresh clone)')
}

// 7. Check .gitignore
console.log('\n7. Checking .gitignore for .env.local...')
if (existsSync(join(PROJECT_ROOT, '.gitignore'))) {
  const gitignore = readFileSync(join(PROJECT_ROOT, '.gitignore'), 'utf-8')
  if (gitignore.includes('.env.local')) {
    console.log('   ✓ .env.local is in .gitignore')
  } else {
    console.log('   ⚠️  .env.local NOT in .gitignore (should be added)')
  }
} else {
  console.log('   ✗ .gitignore not found')
}

console.log('\n=== Test Complete ===')