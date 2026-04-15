#!/usr/bin/env node

/**
 * GSD-2 - Primeira Instalação (Tudo no Git Clone)
 * 
 * Script interativo para primeira configuração do GSD-2.
 * TUDO fica dentro da pasta do git clone - não cria nada em ~/.gsd/ ou fora.
 * 
 * Fluxo:
 * - Login/senha para o frontend web (salvo em .env.local no git clone)
 * - Instala dependências
 * - Faz build
 * - Configura PM2 (usa scripts/pm2/ diretamente)
 * - Inicia o serviço
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Clack prompts (já está nas dependências)
let p, pc

try {
  p = await import('@clack/prompts')
  pc = (await import('picocolors')).default
} catch {
  console.log('⚠️  Instalando dependências de prompt...')
  spawnSync('npm', ['install', '@clack/prompts', 'picocolors'], { stdio: 'inherit' })
  p = await import('@clack/prompts')
  pc = (await import('picocolors')).default
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')
const PM2_DIR = join(PROJECT_ROOT, 'scripts', 'pm2')

// Banner
console.clear()
console.log(pc.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))
console.log(pc.cyan('  GSD-2 — Instalação Interativa'))
console.log(pc.cyan('  (Tudo fica no Git Clone)'))
console.log(pc.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))
console.log()

// Verificar se já tem .env.local (indica instalação anterior)
const hasEnvFile = existsSync(join(PROJECT_ROOT, '.env.local'))

if (hasEnvFile) {
  console.log(pc.yellow('⚠️  GSD-2 já parece estar configurado nesta pasta.'))
  console.log(pc.gray('   Use: npm run update  (para atualizar)'))
  console.log(pc.gray('   Ou delete .env.local e rode novamente para reinstalar.'))
  console.log()
  process.exit(0)
}

// Função utilitária para rodar comandos
function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    stdio: options.silent ? 'pipe' : 'inherit',
    cwd: options.cwd || PROJECT_ROOT,
    env: { ...process.env, ...options.env },
  })
  return result.status === 0
}

// 1. Instalar dependências
const installDeps = await p.confirm({
  message: 'Instalar dependências do projeto?',
  initialValue: true,
})

if (p.isCancel(installDeps)) process.exit(0)

if (installDeps) {
  const s = p.spinner()
  s.start('Instalando dependências...')
  
  const success = run('npm', ['install'], { silent: true })
  
  if (success) {
    s.stop(pc.green('✓ Dependências instaladas'))
  } else {
    s.stop(pc.red('✗ Falha ao instalar dependências'))
    process.exit(1)
  }
}

// 2. Configurar login do web
console.log()
console.log(pc.cyan('┌─ Configuração do Web Login'))
console.log(pc.cyan('│'))

const webUsername = await p.text({
  message: 'Usuário para login no frontend:',
  placeholder: 'admin',
  defaultValue: 'admin',
})

if (p.isCancel(webUsername)) process.exit(0)

const webPassword = await p.password({
  message: 'Senha para login no frontend:',
  validate: (value) => {
    if (value.length < 4) return 'Senha deve ter pelo menos 4 caracteres'
  },
})

if (p.isCancel(webPassword)) process.exit(0)

// 3. Configurações opcionais
console.log()
console.log(pc.cyan('┌─ Configurações Opcionais'))
console.log(pc.cyan('│'))

const configurePM2 = await p.confirm({
  message: 'Configurar PM2 (process manager)?',
  initialValue: true,
})

if (p.isCancel(configurePM2)) process.exit(0)

// 4. Salvar configurações em .env.local (dentro do git clone)
const envContent = `# GSD-2 Web Login (configurado em ${new Date().toISOString().split('T')[0]})
# Este arquivo fica no git clone - não é commitado
GSD_WEB_LOGIN_USERNAME=${webUsername}
GSD_WEB_LOGIN_PASSWORD=${webPassword}
`

const s2 = p.spinner()
s2.start('Salvando configurações...')

try {
  // Salvar .env.local no PROJECT_ROOT (dentro do git clone)
  writeFileSync(join(PROJECT_ROOT, '.env.local'), envContent)
  
  // Adicionar .env.local ao .gitignore se não estiver
  const gitignorePath = join(PROJECT_ROOT, '.gitignore')
  if (existsSync(gitignorePath)) {
    const gitignoreContent = readFileSync(gitignorePath, 'utf-8')
    if (!gitignoreContent.includes('.env.local')) {
      writeFileSync(gitignorePath, gitignoreContent + '\n# Local environment\n.env.local\n')
    }
  }
  
  s2.stop(pc.green('✓ Configurações salvas em .env.local'))
} catch (err) {
  s2.stop(pc.red('✗ Erro ao salvar configurações'))
  console.error(err)
  process.exit(1)
}

// 5. Build
console.log()
const doBuild = await p.confirm({
  message: 'Fazer build do projeto?',
  initialValue: true,
})

if (p.isCancel(doBuild)) process.exit(0)

if (doBuild) {
  const s3 = p.spinner()
  s3.start('Fazendo build... (isso pode levar alguns minutos)')
  
  const buildSuccess = run('npm', ['run', 'build'], { silent: true })
  
  if (buildSuccess) {
    s3.stop(pc.green('✓ Build concluído'))
  } else {
    s3.stop(pc.red('✗ Build falhou'))
    console.log(pc.yellow('   Tente rodar manualmente: npm run build'))
    process.exit(1)
  }
}

// 6. Configurar PM2 (usa scripts direto do git clone)
if (configurePM2) {
  console.log()
  const s4 = p.spinner()
  s4.start('Configurando PM2...')
  
  try {
    // Verificar se PM2 está instalado
    const pm2Check = spawnSync('which', ['pm2'], { encoding: 'utf-8' })
    
    if (pm2Check.status !== 0) {
      s4.stop(pc.yellow('⚠ PM2 não encontrado, instalando...'))
      run('npm', ['install', '-g', 'pm2'])
    }
    
    // Tornar o script executável (no próprio git clone)
    spawnSync('chmod', ['+x', join(PM2_DIR, 'start-gsd-web.sh')])
    
    s4.stop(pc.green('✓ PM2 configurado'))
    
    // Iniciar o processo
    console.log()
    const startPM2 = await p.confirm({
      message: 'Iniciar o serviço web agora?',
      initialValue: true,
    })
    
    if (startPM2) {
      const s5 = p.spinner()
      s5.start('Iniciando serviço...')
      
      // Parar se já estiver rodando
      spawnSync('pm2', ['delete', 'gsd-web'], { stdio: 'pipe' })
      
      // Iniciar DIRETO do git clone
      const startResult = spawnSync('pm2', ['start', join(PM2_DIR, 'ecosystem.config.js')], {
        encoding: 'utf-8',
        cwd: PROJECT_ROOT,
        env: { ...process.env, GSD_WEB_PACKAGE_ROOT: PROJECT_ROOT }
      })
      
      if (startResult.status === 0) {
        s5.stop(pc.green('✓ Serviço iniciado'))
        
        // Salvar config do PM2
        spawnSync('pm2', ['save'], { stdio: 'pipe' })
      } else {
        s5.stop(pc.red('✗ Falha ao iniciar serviço'))
        console.log(pc.yellow(`   Tente manualmente: pm2 start ${join(PM2_DIR, 'ecosystem.config.js')}`))
      }
    }
  } catch (err) {
    s4.stop(pc.red('✗ Erro ao configurar PM2'))
    console.error(err)
  }
}

// 7. Finalização
console.log()
console.log(pc.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))
console.log(pc.green('  ✅ Instalação Concluída!'))
console.log(pc.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))
console.log()
console.log(pc.cyan('📌 Acesse o GSD Web em:'))
console.log(pc.white('   http://localhost:34000'))
console.log()
console.log(pc.gray('Login configurado:'))
console.log(pc.gray(`   Usuário: ${webUsername}`))
console.log(pc.gray(`   Senha: ${'*'.repeat(webPassword.length)}`))
console.log()
console.log(pc.cyan('📁 Tudo fica no Git Clone:'))
console.log(pc.gray(`   ${PROJECT_ROOT}`))
console.log(pc.gray('   Código, config, build, node_modules — tudo aqui!'))
console.log()
console.log(pc.yellow('💡 Comandos úteis:'))
console.log(pc.gray('   pm2 status           # Ver status do serviço'))
console.log(pc.gray('   pm2 logs gsd-web     # Ver logs'))
console.log(pc.gray('   npm run update       # Atualizar o GSD'))
console.log(pc.gray('   rm -rf .env.local    # Resetar config de login'))
console.log()
console.log(pc.red('🗑️  Para desinstalar completamente:'))
console.log(pc.gray('   pm2 delete gsd-web   # Parar serviço'))
console.log(pc.gray('   cd .. && rm -rf gsd-2  # Deletar pasta'))
console.log()
