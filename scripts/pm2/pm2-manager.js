#!/usr/bin/env node

/**
 * PM2 Manager for GSD
 * Verifies if PM2 is installed, installs if needed,
 * and manages the gsd-web process
 */

import { spawnSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

function run(cmd, args, options = {}) {
  const rendered = [cmd, ...args].join(' ')
  process.stdout.write(`[pm2-manager] ${rendered}\n`)
  
  const result = spawnSync(cmd, args, {
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
    cwd: options.cwd || process.cwd(),
    env: { ...process.env, ...options.env },
  })

  if (result.status !== 0 && !options.ignoreError) {
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

function checkPm2Installed() {
  try {
    const result = run('which', ['pm2'], { capture: true, ignoreError: true })
    return result.status === 0
  } catch {
    return false
  }
}

function installPm2() {
  process.stdout.write('[pm2-manager] PM2 not found. Installing globally...\n')
  run('npm', ['install', '-g', 'pm2'])
  process.stdout.write('[pm2-manager] PM2 installed successfully.\n')
}

function ensurePm2() {
  if (checkPm2Installed()) {
    process.stdout.write('[pm2-manager] PM2 is installed.\n')
    return true
  }
  installPm2()
  return true
}

function generateEcosystemFile() {
  const nodeBin = process.execPath
  const standaloneDir = join(PROJECT_ROOT, 'dist/web/standalone')
  const logsDir = join(homedir(), '.pm2/logs')
  const pidsDir = join(homedir(), '.pm2/pids')

  return {
    apps: [
      {
        name: 'gsd-web',
        script: 'start-gsd-web.sh',
        cwd: join(PROJECT_ROOT, 'scripts/pm2'),
        interpreter: 'bash',
        exec_mode: 'fork',
        env: {
          NODE_ENV: 'production',
          HOSTNAME: '127.0.0.1',
          PORT: '1027',
          GSD_WEB_DAEMON_MODE: '1',
          GSD_WEB_PACKAGE_ROOT: PROJECT_ROOT,
          GSD_WEB_ALLOWED_ORIGINS: process.env.GSD_WEB_ALLOWED_ORIGINS || 'https://gsd.atius.com.br',
          NODE_BIN: nodeBin,
        },
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        error_file: join(logsDir, 'gsd-web-error.log'),
        out_file: join(logsDir, 'gsd-web-out.log'),
        pid_file: join(pidsDir, 'gsd-web.pid'),
        merge_logs: true,
        max_restarts: 50,
        min_uptime: '10s',
        restart_delay: 4000,
      },
    ],
  }
}

function createPm2Script() {
  const pm2Dir = join(PROJECT_ROOT, 'scripts/pm2')
  const scriptPath = join(pm2Dir, 'start-gsd-web.sh')

  if (existsSync(scriptPath)) {
    process.stdout.write('[pm2-manager] PM2 startup script already exists.\n')
    return scriptPath
  }

  const nodeBin = process.execPath
  const ecosystem = generateEcosystemFile()

  writeFileSync(
    join(pm2Dir, 'ecosystem.config.js'),
    `module.exports = ${JSON.stringify(ecosystem, null, 2)}\n`,
  )

  const startupScript = `#!/usr/bin/env bash
set -Eeuo pipefail

NODE_BIN=${nodeBin}
PACKAGE_ROOT=${PROJECT_ROOT}
STANDALONE_DIR="$PACKAGE_ROOT/dist/web/standalone"

export NODE_ENV=production
export HOSTNAME=127.0.0.1
export PORT=1027
export GSD_WEB_DAEMON_MODE=1
export GSD_WEB_PACKAGE_ROOT="$PACKAGE_ROOT"
export GSD_WEB_ALLOWED_ORIGINS="\${GSD_WEB_ALLOWED_ORIGINS:-https://gsd.atius.com.br}"
export GSD_VERSION="$($NODE_BIN -p "require('$PACKAGE_ROOT/package.json').version")"

cd "$STANDALONE_DIR"
printf '%s\\n' "$$" > /home/ubuntu/.gsd/web-server.pid
printf 'GSD version: v%s\\n' "$GSD_VERSION"
exec "$NODE_BIN" server.js
`

  writeFileSync(scriptPath, startupScript, { mode: 0o755 })
  process.stdout.write(`[pm2-manager] Created PM2 startup script at ${scriptPath}\n`)
  return scriptPath
}

function isPm2ProcessRunning(processName) {
  try {
    const result = run('pm2', ['jlist'], { capture: true, ignoreError: true })
    if (result.status !== 0) return false

    const processes = JSON.parse(result.stdout)
    return processes.some(p => p.name === processName && p.pm2_env?.status === 'online')
  } catch {
    return false
  }
}

function getPm2ProcessVersion(processName) {
  try {
    const result = run('pm2', ['describe', processName], { capture: true, ignoreError: true })
    if (result.status !== 0) return null

    const match = result.stdout.match(/version\s*│\s*(.+)/)
    return match ? match[1].trim() : null
  } catch {
    return null
  }
}

function startPm2Process() {
  const processName = 'gsd-web'
  
  if (isPm2ProcessRunning(processName)) {
    process.stdout.write(`[pm2-manager] Process '${processName}' is already running.\n`)
    return true
  }

  process.stdout.write(`[pm2-manager] Starting process '${processName}'...\n`)
  createPm2Script()
  run('pm2', ['start', 'scripts/pm2/ecosystem.config.js'])
  process.stdout.write(`[pm2-manager] Process '${processName}' started.\n`)
  return true
}

function restartPm2Process() {
  const processName = 'gsd-web'
  
  if (!isPm2ProcessRunning(processName)) {
    process.stdout.write(`[pm2-manager] Process '${processName}' not running. Starting...\n`)
    return startPm2Process()
  }

  process.stdout.write(`[pm2-manager] Restarting process '${processName}'...\n`)
  run('pm2', ['restart', processName])
  process.stdout.write(`[pm2-manager] Process '${processName}' restarted.\n`)
  return true
}

function waitForProcessOnline(processName, timeoutMs = 30000) {
  process.stdout.write(`[pm2-manager] Waiting for '${processName}' to be online...\n`)
  const start = Date.now()
  
  while (Date.now() - start < timeoutMs) {
    if (isPm2ProcessRunning(processName)) {
      const version = getPm2ProcessVersion(processName)
      process.stdout.write(`[pm2-manager] Process '${processName}' is online. Version: ${version}\n`)
      return true
    }
    spawnSync('sleep', ['1'])
  }
  
  throw new Error(`Timeout waiting for process '${processName}' to be online`)
}

export {
  ensurePm2,
  startPm2Process,
  restartPm2Process,
  waitForProcessOnline,
  isPm2ProcessRunning,
  getPm2ProcessVersion,
  checkPm2Installed,
  installPm2,
}

// CLI mode
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv[2] || 'status'

  try {
    switch (command) {
      case 'ensure':
        ensurePm2()
        break

      case 'start':
        ensurePm2()
        startPm2Process()
        waitForProcessOnline('gsd-web')
        break

      case 'restart':
        ensurePm2()
        restartPm2Process()
        waitForProcessOnline('gsd-web')
        break

      case 'status':
        ensurePm2()
        run('pm2', ['list'])
        break

      case 'stop':
        run('pm2', ['stop', 'gsd-web'])
        break

      case 'delete':
        run('pm2', ['delete', 'gsd-web'])
        break

      default:
        process.stdout.write(`[pm2-manager] Unknown command: ${command}\n`)
        process.stdout.write('Usage: node pm2-manager.js [ensure|start|restart|status|stop|delete]\n')
        process.exit(1)
    }
  } catch (error) {
    process.stderr.write(`[pm2-manager] ERROR: ${error.message}\n`)
    process.exit(1)
  }
}
