#!/usr/bin/env node

/**
 * Release script — builds, bumps version, publishes to npm, and creates GitHub release.
 *
 * Usage:
 *   node scripts/release.mjs              # full release (build + bump + npm publish + gh release)
 *   node scripts/release.mjs --npm-only   # only bump version + npm publish
 *   node scripts/release.mjs --gh-only    # only create GitHub release from current version
 *   node scripts/release.mjs --dry-run    # show what would happen without doing anything
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const REPO_ROOT = join(__dirname, '..')
const PKG_PATH = join(REPO_ROOT, 'package.json')
const UPSTREAM_PACKAGE = 'gsd-2'
const UPSTREAM_SCOPE = '@gsd-build'

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: REPO_ROOT, stdio: 'pipe', ...opts }).toString().trim()
}

function getPackageInfo() {
  return JSON.parse(readFileSync(PKG_PATH, 'utf-8'))
}

function parseForkVersion(version) {
  const parts = version.split('.')
  if (parts.length === 4) {
    return { base: `${parts[0]}.${parts[1]}.${parts[2]}`, suffix: parseInt(parts[3], 10) }
  }
  return { base: version, suffix: 0 }
}

function getUpstreamVersion() {
  try {
    const result = execSync(`npm view ${UPSTREAM_SCOPE}/${UPSTREAM_PACKAGE} version`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return result.trim()
  } catch {
    // Fallback: try fetching from git upstream
  }

  try {
    const pkgRaw = execSync(
      'git show upstream:package.json 2>/dev/null || git show upstream/main:package.json 2>/dev/null',
      { encoding: 'utf-8', cwd: REPO_ROOT, stdio: ['pipe', 'pipe', 'pipe'] }
    )
    const upstreamPkg = JSON.parse(pkgRaw)
    if (upstreamPkg.version) return upstreamPkg.version
  } catch {
    // ignore
  }

  throw new Error('Unable to determine upstream version')
}

function bumpVersion() {
  const pkg = getPackageInfo()
  const currentVersion = pkg.version
  let upstreamVersion

  try {
    upstreamVersion = getUpstreamVersion()
  } catch {
    console.error('Warning: Could not fetch upstream version, using current as baseline')
    upstreamVersion = parseForkVersion(currentVersion).base
  }

  const { base: currentBase, suffix: currentSuffix } = parseForkVersion(currentVersion)

  let newSuffix
  if (currentBase !== upstreamVersion) {
    newSuffix = 1
    console.log(`Upstream base changed: ${currentBase} -> ${upstreamVersion}`)
  } else {
    newSuffix = currentSuffix + 1
    console.log(`Upstream base unchanged: ${upstreamVersion}`)
  }

  const newVersion = `${upstreamVersion}.${newSuffix}`
  pkg.version = newVersion
  writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n')

  console.log(`Version bumped: ${currentVersion} -> ${newVersion}`)
  return newVersion
}

function npmPublish(version, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] Would publish ${version} to npm`)
    return
  }
  console.log(`Publishing ${version} to npm...`)
  try {
    const output = run(`npm publish --access public 2>&1`)
    console.log(output)
  } catch (err) {
    console.error(`npm publish failed: ${err.message}`)
    throw err
  }
}

function createGitTag(version, dryRun) {
  const tagName = `v${version}`
  if (dryRun) {
    console.log(`[dry-run] Would create tag ${tagName}`)
    return
  }
  // Check if tag already exists
  try {
    const existing = run(`git tag -l ${tagName}`)
    if (existing) {
      console.log(`Tag ${tagName} already exists, skipping`)
      return
    }
  } catch {
    // ignore
  }

  run(`git tag -a ${tagName} -m "Release ${version}"`)
  run(`git push origin ${tagName}`)
  console.log(`Created and pushed tag ${tagName}`)
}

function createGitHubRelease(version, dryRun) {
  const tagName = `v${version}`
  if (dryRun) {
    console.log(`[dry-run] Would create GitHub release ${tagName}`)
    return
  }

  try {
    // Check if release already exists
    run(`gh release view ${tagName} 2>&1`)
    console.log(`Release ${tagName} already exists, skipping`)
    return
  } catch {
    // Release doesn't exist, create it
  }

  console.log(`Creating GitHub release ${tagName}...`)
  run(`gh release create ${tagName} --title "GSD-2 ${version}" --generate-notes`)
  console.log(`Created GitHub release ${tagName}`)
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const npmOnly = args.includes('--npm-only')
  const ghOnly = args.includes('--gh-only')

  if (ghOnly) {
    const pkg = getPackageInfo()
    createGitHubRelease(pkg.version, dryRun)
    return
  }

  // Step 1: Build
  if (!npmOnly) {
    console.log('Building...')
    if (!dryRun) {
      run(`npm run build`, { stdio: 'inherit' })
    } else {
      console.log('[dry-run] Would build')
    }
  }

  // Step 2: Bump version
  console.log('Bumping version...')
  const newVersion = bumpVersion()

  // Step 3: Commit version bump
  if (!dryRun) {
    run(`git add package.json`)
    try {
      run(`git commit -m "chore: bump version to ${newVersion}"`)
    } catch {
      console.log('Nothing to commit or commit failed')
    }
  } else {
    console.log(`[dry-run] Would commit version bump`)
  }

  // Step 4: Publish to npm
  npmPublish(newVersion, dryRun)

  // Step 5: Create git tag and GitHub release
  createGitTag(newVersion, dryRun)
  createGitHubRelease(newVersion, dryRun)

  console.log(dryRun ? '\n(dry run complete — no changes made)' : `\nRelease ${newVersion} complete!`)
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
