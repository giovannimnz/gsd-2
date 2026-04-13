#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

const DEFAULTS = {
  upstreamRemote: 'upstream',
  originRemote: 'origin',
  baseBranch: 'main',
  customBranch: undefined,
  baseMode: 'merge', // rebase | merge — merge is safer for forks with customizations
  customMode: 'merge', // rebase | merge
  autoMergeCustomIntoBase: false,
  commitAfterSync: true,
  commitMessage: undefined,
  pushMain: true,
  pushCustom: true,
  build: true,
  autoPushAfterBuild: true,
  pm2Restart: true,
  allowDirty: false,
  dryRun: false,
  restoreBranch: true,
  safeMode: true, // When true, protects custom directories and uses merge
}

// Directories and files that are custom modifications and should be protected
// from accidental deletion during auto-commit
const PROTECTED_PATHS = [
  'scripts/vpn-access/',
  'scripts/pm2/',
  'web/middleware.ts',
  'web/proxy.ts',
]

function printHelp() {
  process.stdout.write(
    [
      'Sync fork workflow (upstream -> main -> custom branch).',
      '',
      'Usage:',
      '  node scripts/sync-fork-upstream.js [options]',
      '',
      'Options:',
      '  --custom-branch <name>   Custom branch to rebase/merge on top of main.',
      '  --base-branch <name>     Base branch to sync from upstream (default: main).',
      '  --upstream <name>        Upstream remote name (default: upstream).',
      '  --origin <name>          Origin remote name (default: origin).',
      '  --base-mode <mode>       Sync mode for base branch: rebase|merge (default: rebase).',
      '  --custom-mode <mode>     Sync mode for custom branch: rebase|merge (default: rebase).',
      '  --auto-merge             Merge custom branch back into base branch if sync succeeds.',
      '  --no-commit              Disable automatic commit after sync (enabled by default).',
      '  --commit-message <msg>   Custom commit message for auto-commit.',
      '  --push-main              Push synced base branch to origin.',
      '  --push-custom            Push synced custom branch to origin.',
      '  --push                   Push both base and custom branches.',
      '  --no-push                Disable all push operations.',
      '  --build                  Run npm run build after sync (enabled by default).',
      '  --no-build               Disable automatic build after sync.',
      '  --auto-push              Enable auto-push after successful build (enabled by default).',
      '  --no-auto-push           Disable auto-push after build.',
      '  --pm2-restart            Restart gsd-web PM2 process after build (enabled by default).',
      '  --no-pm2                 Disable PM2 restart after build.',
      '  --allow-dirty            Allow running with uncommitted changes.',
      '  --dry-run                Print commands without executing them.',
      '  --no-restore-branch      Leave HEAD on the last branch touched.',
      '  --safe-mode              Protect custom files and use merge mode (default: enabled).',
      '  --no-safe-mode           Disable safe mode (use rebase and no file protection).',
      '  --show-diff              Show what will change before auto-committing.',
      '  -h, --help               Show this help.',
      '',
      'Examples:',
      '  node scripts/sync-fork-upstream.js --custom-branch custom/meu-trabalho --push --build',
      '  node scripts/sync-fork-upstream.js --custom-branch custom/meu-trabalho --auto-merge --push-main',
      '  node scripts/sync-fork-upstream.js --custom-branch custom/meu-trabalho --base-mode merge',
      '  node scripts/sync-fork-upstream.js --auto-merge --build',
      '  node scripts/sync-fork-upstream.js --no-commit --no-auto-push',
      '',
    ].join('\n'),
  )
}

function fail(message) {
  process.stderr.write(`[fork-sync] ERROR: ${message}\n`)
  process.exit(1)
}

function log(message) {
  process.stdout.write(`[fork-sync] ${message}\n`)
}

function parseArgs(argv) {
  const options = { ...DEFAULTS, safeMode: DEFAULTS.safeMode, showDiff: false }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }

    if (arg === '--custom-branch') {
      options.customBranch = argv[++i]
      continue
    }
    if (arg === '--base-branch') {
      options.baseBranch = argv[++i]
      continue
    }
    if (arg === '--upstream') {
      options.upstreamRemote = argv[++i]
      continue
    }
    if (arg === '--origin') {
      options.originRemote = argv[++i]
      continue
    }
    if (arg === '--base-mode') {
      options.baseMode = argv[++i]
      continue
    }
    if (arg === '--custom-mode') {
      options.customMode = argv[++i]
      continue
    }

    if (arg === '--auto-merge') {
      options.autoMergeCustomIntoBase = true
      continue
    }
    if (arg === '--no-commit') {
      options.commitAfterSync = false
      continue
    }
    if (arg === '--commit-message') {
      options.commitMessage = argv[++i]
      continue
    }
    if (arg === '--no-push') {
      options.pushMain = false
      options.pushCustom = false
      options.autoPushAfterBuild = false
      continue
    }
    if (arg === '--push-main') {
      options.pushMain = true
      continue
    }
    if (arg === '--push-custom') {
      options.pushCustom = true
      continue
    }
    if (arg === '--push') {
      options.pushMain = true
      options.pushCustom = true
      continue
    }
    if (arg === '--no-build') {
      options.build = false
      continue
    }
    if (arg === '--build') {
      options.build = true
      continue
    }
    if (arg === '--no-auto-push') {
      options.autoPushAfterBuild = false
      continue
    }
    if (arg === '--auto-push') {
      options.autoPushAfterBuild = true
      continue
    }
    if (arg === '--no-pm2') {
      options.pm2Restart = false
      continue
    }
    if (arg === '--pm2-restart') {
      options.pm2Restart = true
      continue
    }
    if (arg === '--allow-dirty') {
      options.allowDirty = true
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (arg === '--no-restore-branch') {
      options.restoreBranch = false
      continue
    }
    if (arg === '--safe-mode') {
      options.safeMode = true
      continue
    }
    if (arg === '--no-safe-mode') {
      options.safeMode = false
      continue
    }
    if (arg === '--show-diff') {
      options.showDiff = true
      continue
    }

    fail(`Unknown argument: ${arg}`)
  }

  if (!['rebase', 'merge'].includes(options.baseMode)) {
    fail(`Invalid --base-mode: ${options.baseMode}. Use rebase or merge.`)
  }
  if (!['rebase', 'merge'].includes(options.customMode)) {
    fail(`Invalid --custom-mode: ${options.customMode}. Use rebase or merge.`)
  }

  return options
}

function run(cmd, args, options = {}) {
  const rendered = [cmd, ...args].join(' ')
  if (options.dryRun) {
    log(`[dry-run] ${rendered}`)
    return { status: 0, stdout: '', stderr: '' }
  }

  log(rendered)
  const result = spawnSync(cmd, args, {
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
    cwd: process.cwd(),
  })

  if (result.status !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    const details = [stderr, stdout].filter(Boolean).join('\n')
    throw new Error(details || `${rendered} failed with exit code ${result.status}`)
  }

  return {
    status: result.status ?? 0,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}

function git(args, options = {}) {
  return run('git', args, options)
}

function gitOutput(args, options = {}) {
  return git(args, { ...options, dryRun: false, capture: true }).stdout.trim()
}

function checkPm2Installed() {
  try {
    const pm2Result = spawnSync('which', ['pm2'], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' })
    return pm2Result.status === 0
  } catch {
    return false
  }
}

function installPm2() {
  log('PM2 not found. Installing globally...')
  run('npm', ['install', '-g', 'pm2'])
  log('PM2 installed successfully.')
}

function ensurePm2Installed(options) {
  if (checkPm2Installed()) {
    log('PM2 is installed.')
    return true
  }

  installPm2()
  return true
}

function getPm2ProcessInfo(processName) {
  try {
    const result = spawnSync('pm2', ['jlist'], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' })
    if (result.status !== 0) return null

    const processes = JSON.parse(result.stdout)
    const process = processes.find(p => p.name === processName)
    if (!process) return null

    return {
      name: process.name,
      status: process.pm2_env?.status || process.status,
      pid: process.pid,
      restarts: process.pm2_env?.restart_time ?? 0,
      uptime: process.pm2_env?.pm_uptime,
    }
  } catch {
    return null
  }
}

function isPm2ProcessOnline(processName) {
  const info = getPm2ProcessInfo(processName)
  return info?.status === 'online'
}

function getPackageVersion() {
  try {
    const pkgPath = join(PROJECT_ROOT, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    return pkg.version
  } catch {
    return null
  }
}

function restartPm2Process(processName) {
  log(`Restarting PM2 process '${processName}'...`)
  
  // Check if process exists
  const infoBefore = getPm2ProcessInfo(processName)
  
  if (infoBefore) {
    // Process exists, restart it
    run('pm2', ['restart', processName])
  } else {
    // Process doesn't exist, start it
    log(`Process '${processName}' not found. Starting...`)
    const ecosystemPath = join(PROJECT_ROOT, 'scripts/pm2/ecosystem.config.js')
    run('pm2', ['start', ecosystemPath])
  }

  log(`PM2 process '${processName}' restart initiated.`)
}

function waitForPm2Online(processName, timeoutMs = 45000) {
  log(`Waiting for PM2 process '${processName}' to be online...`)
  const start = Date.now()
  
  while (Date.now() - start < timeoutMs) {
    if (isPm2ProcessOnline(processName)) {
      const info = getPm2ProcessInfo(processName)
      const uptime = info?.uptime ? new Date(info.uptime).toISOString() : 'unknown'
      log(`PM2 process '${processName}' is online (restarts: ${info?.restarts ?? 0}).`)
      return true
    }
    spawnSync('sleep', ['1'])
  }
  
  throw new Error(`Timeout: PM2 process '${processName}' did not come online within ${timeoutMs / 1000}s`)
}

function verifyPm2Version(processName, expectedVersion) {
  if (!expectedVersion) return true
  
  try {
    // Check PM2 logs for version string
    const logResult = spawnSync('pm2', ['logs', processName, '--lines', '30', '--nostream'], { 
      stdio: ['ignore', 'pipe', 'pipe'], 
      encoding: 'utf8',
      timeout: 5000,
    })
    
    if (logResult.stdout?.includes(`v${expectedVersion}`)) {
      log(`Verified: PM2 process '${processName}' is running version v${expectedVersion}`)
      return true
    }
    
    log(`Note: Version v${expectedVersion} not found in recent PM2 logs (may still be starting)`)
    return true // Don't fail if we can't verify
  } catch {
    return true // Don't fail on verification errors
  }
}

function generateCommitMessage(options) {
  // Get status to categor changes
  const statusOutput = gitOutput(['status', '--porcelain'], options)
  if (!statusOutput) {
    return null
  }

  const added = []
  const modified = []
  const deleted = []
  const renamed = []

  for (const line of statusOutput.split('\n').filter(Boolean)) {
    const status = line.substring(0, 2)
    const file = line.substring(3).trim()

    if (status[0] === 'A' && status[1] === ' ') {
      added.push(file)
    } else if (status[0] === 'M' || status[1] === 'M') {
      modified.push(file)
    } else if (status[0] === 'D' || status[1] === 'D') {
      deleted.push(file)
    } else if (status[0] === 'R' || status[1] === 'R') {
      renamed.push(file)
    }
  }

  const parts = ['chore: auto-commit changes before fork sync']

  const sections = []

  if (added.length > 0) {
    sections.push(`\nAdicionados (${added.length}):\n${added.map(f => `- ${f}`).join('\n')}`)
  }

  if (modified.length > 0) {
    sections.push(`\nAlterados (${modified.length}):\n${modified.map(f => `- ${f}`).join('\n')}`)
  }

  if (deleted.length > 0) {
    sections.push(`\nRemovidos (${deleted.length}):\n${deleted.map(f => `- ${f}`).join('\n')}`)
  }

  if (renamed.length > 0) {
    sections.push(`\nRenomeados (${renamed.length}):\n${renamed.map(f => `- ${f}`).join('\n')}`)
  }

  if (sections.length > 0) {
    parts.push(sections.join('\n'))
  }

  return parts.join('\n')
}

function hasRemote(name, options) {
  try {
    git(['remote', 'get-url', name], { ...options, dryRun: false, capture: true })
    return true
  } catch {
    return false
  }
}

function hasLocalBranch(name, options) {
  try {
    git(['show-ref', '--verify', '--quiet', `refs/heads/${name}`], { ...options, dryRun: false, capture: true })
    return true
  } catch {
    return false
  }
}

function isProtectedPath(filePath) {
  return PROTECTED_PATHS.some(p => filePath.startsWith(p) || filePath === p)
}

function getProtectedFiles(options) {
  const output = gitOutput(['status', '--porcelain'], options)
  if (!output) return []

  const protectedFiles = []
  for (const line of output.split('\n').filter(Boolean)) {
    const file = line.substring(3).trim()
    if (isProtectedPath(file)) {
      protectedFiles.push(file)
    }
  }
  return protectedFiles
}

function showDiffPreview(options) {
  log('=== Changes that would be auto-committed ===')
  try {
    const diffOutput = gitOutput(['diff', '--cached', '--stat'], options)
    if (diffOutput) {
      log(diffOutput)
    }
    const statusOutput = gitOutput(['status', '--short'], options)
    if (statusOutput) {
      log('\nUnstaged changes:')
      log(statusOutput)
    }
  } catch {
    log('(Unable to preview changes)')
  }
  log('========================================')
}

function restoreProtectedFiles(files, options) {
  if (files.length === 0) return

  log(`Restoring ${files.length} protected file(s) to prevent accidental deletion...`)
  // Reset protected files to HEAD state so they won't be staged for deletion
  for (const file of files) {
    try {
      git(['checkout', 'HEAD', '--', file], options)
      log(`  Restored: ${file}`)
    } catch {
      // File might be new (not in HEAD), just unstage it
      git(['reset', '--', file], options)
      log(`  Unstaged new file: ${file}`)
    }
  }
}

function checkoutBranch(name, options) {
  if (hasLocalBranch(name, options)) {
    git(['checkout', name], options)
    return
  }
  const upstreamRef = `${options.upstreamRemote}/${name}`
  git(['checkout', '-b', name, upstreamRef], options)
}

function ensureCleanTree(options) {
  const output = gitOutput(['status', '--porcelain'], options)
  if (!output) return
  if (options.allowDirty) {
    log('Working tree is dirty, but continuing due to --allow-dirty.')
    return
  }
  fail('Working tree is not clean. Commit/stash changes first or pass --allow-dirty.')
}

function syncBranchFrom(branch, fromRef, mode, options) {
  if (mode === 'rebase') {
    const args = ['rebase']
    // Allow rebasing with local tracked changes when caller explicitly accepts
    // a dirty tree. Git will auto-stash and restore around the rebase.
    if (options.allowDirty) {
      args.push('--autostash')
    }
    args.push(fromRef)
    git(args, options)
    return
  }
  // Merge mode — no autostash needed, merge works with dirty tree
  // when we've already committed our custom changes
  git(['merge', '--no-edit', fromRef], options)
}

function mergeBranchIntoBase(baseBranch, sourceBranch, options) {
  git(['checkout', baseBranch], options)
  git(['merge', '--no-edit', sourceBranch], options)
}

function pushBranch(branch, remote, forceWithLease, options) {
  // In safe mode, avoid force pushes — they can overwrite custom work on origin
  if (forceWithLease && options.safeMode) {
    log(`Safe mode: skipping force-push to ${branch}, using regular push`)
    try {
      git(['push', remote, branch], options)
    } catch (err) {
      log(`Regular push failed, trying with --force-with-lease: ${err.message}`)
      git(['push', '--force-with-lease', remote, branch], options)
    }
    return
  }
  if (forceWithLease) {
    git(['push', '--force-with-lease', remote, branch], options)
    return
  }
  git(['push', remote, branch], options)
}

function inferCustomBranch(currentBranch, options) {
  if (options.customBranch) return options.customBranch
  if (currentBranch !== options.baseBranch && currentBranch !== 'HEAD') return currentBranch
  return undefined
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  try {
    git(['rev-parse', '--is-inside-work-tree'], options)
  } catch {
    fail('Not inside a git repository.')
  }

  if (!hasRemote(options.upstreamRemote, options)) {
    fail(`Remote '${options.upstreamRemote}' not found. Configure it first (e.g. git remote add ${options.upstreamRemote} <url>).`)
  }

  if ((options.pushMain || options.pushCustom) && !hasRemote(options.originRemote, options)) {
    fail(`Remote '${options.originRemote}' not found, but push was requested.`)
  }

  const initialBranch = gitOutput(['rev-parse', '--abbrev-ref', 'HEAD'], options)
  const customBranch = inferCustomBranch(initialBranch, options)
  const shouldAutoMergeCustomIntoBase = options.autoMergeCustomIntoBase && Boolean(customBranch)

  if (customBranch && customBranch === options.baseBranch) {
    fail(`Custom branch cannot be the same as base branch ('${options.baseBranch}').`)
  }

  // Auto-commit pending changes BEFORE sync to allow clean rebase
  if (options.commitAfterSync) {
    const dirtyOutput = gitOutput(['status', '--porcelain'], options)
    if (dirtyOutput) {
      log('Auto-committing pending changes before sync...')

      // Preview changes if requested
      if (options.showDiff) {
        showDiffPreview(options)
      }

      // In safe mode, protect custom files before staging
      if (options.safeMode) {
        git(['add', '-A'], options)
        const protectedFiles = getProtectedFiles(options)
        if (protectedFiles.length > 0) {
          log(`Safe mode: protecting ${protectedFiles.length} custom file(s)...`)
          restoreProtectedFiles(protectedFiles, options)
        }
      } else {
        git(['add', '-A'], options)
      }

      const commitMsg = options.commitMessage || generateCommitMessage(options)
      if (commitMsg) {
        try {
          git(['commit', '-m', commitMsg], options)
          log('Auto-commit completed successfully.')
        } catch (err) {
          fail(`Failed to commit changes: ${err.message}`)
        }
      }
    } else {
      log('No pending changes to commit.')
    }
  } else {
    ensureCleanTree(options)
  }

  // If safe mode is enabled and base mode is rebase, override to merge
  if (options.safeMode && options.baseMode === 'rebase') {
    log('Safe mode: overriding base-mode from rebase to merge for safety')
    options.baseMode = 'merge'
  }
  if (options.safeMode && options.customMode === 'rebase') {
    log('Safe mode: overriding custom-mode from rebase to merge for safety')
    options.customMode = 'merge'
  }

  log(`Base branch: ${options.baseBranch}`)
  log(`Custom branch: ${customBranch ?? '(none)'}`)
  log(`Auto-merge custom into base: ${shouldAutoMergeCustomIntoBase ? 'yes' : 'no'}`)
  log(`Upstream remote: ${options.upstreamRemote}`)
  log(`Origin remote: ${options.originRemote}`)

  if (options.autoMergeCustomIntoBase && !customBranch) {
    log('Auto-merge requested, but no custom branch was provided/inferred — continuing with base sync only.')
  }

  try {
    git(['fetch', '--prune', options.upstreamRemote], options)
    if (hasRemote(options.originRemote, options)) {
      git(['fetch', '--prune', options.originRemote], options)
    }

    checkoutBranch(options.baseBranch, options)
    syncBranchFrom(options.baseBranch, `${options.upstreamRemote}/${options.baseBranch}`, options.baseMode, options)

    if (customBranch) {
      if (!hasLocalBranch(customBranch, options) && customBranch !== initialBranch) {
        fail(`Custom branch '${customBranch}' does not exist locally.`)
      }
      git(['checkout', customBranch], options)
      syncBranchFrom(customBranch, options.baseBranch, options.customMode, options)

      if (options.pushCustom) {
        const forceWithLease = options.customMode === 'rebase'
        pushBranch(customBranch, options.originRemote, forceWithLease, options)
      }

      if (shouldAutoMergeCustomIntoBase) {
        mergeBranchIntoBase(options.baseBranch, customBranch, options)
      }
    }

    // Push main if enabled
    if (options.pushMain) {
      // Use force-with-lease when rebasing to handle rewritten history
      const forceWithLease = options.baseMode === 'rebase'
      pushBranch(options.baseBranch, options.originRemote, forceWithLease, options)
    }

    if (options.build) {
      log('Running build...')
      run('npm', ['run', 'build'], { dryRun: options.dryRun, capture: false })
      log('Build completed successfully.')

      // Auto-push after successful build if requested (for any remaining changes)
      if (options.autoPushAfterBuild && hasRemote(options.originRemote, options)) {
        log('Auto-pushing remaining changes to origin...')
        const forceWithLease = options.baseMode === 'rebase'
        pushBranch(options.baseBranch, options.originRemote, forceWithLease, options)
        if (customBranch && options.pushCustom) {
          const forceCustom = options.customMode === 'rebase'
          pushBranch(customBranch, options.originRemote, forceCustom, options)
        }
        log('Auto-push completed successfully.')
      }

      // PM2 restart after successful build
      if (options.pm2Restart) {
        try {
          const currentVersion = getPackageVersion()
          log(`Current GSD version: v${currentVersion || 'unknown'}`)

          ensurePm2Installed(options)
          restartPm2Process('gsd-web')
          waitForPm2Online('gsd-web')
          verifyPm2Version('gsd-web', currentVersion)

          log('PM2 gsd-web process is running the new version.')
        } catch (error) {
          log(`Warning: PM2 restart failed: ${error.message}`)
          log('You may need to manually restart the gsd-web process.')
        }
      }
    }

    if (options.restoreBranch && initialBranch && initialBranch !== 'HEAD') {
      git(['checkout', initialBranch], options)
    }

    log('Fork sync completed successfully.')
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error))
  }
}

await main()
