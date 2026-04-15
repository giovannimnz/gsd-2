module.exports = {
  apps: [
    {
      name: 'gsd-web',
      script: 'start-gsd-web.sh',
      cwd: __dirname,
      interpreter: 'bash',
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        HOSTNAME: 'localhost',
        PORT: '34000',
        GSD_WEB_DAEMON_MODE: '1',
        GSD_WEB_PACKAGE_ROOT: process.env.GSD_WEB_PACKAGE_ROOT || process.cwd(),
        GSD_WEB_ALLOWED_ORIGINS: process.env.GSD_WEB_ALLOWED_ORIGINS || 'https://gsd.atius.com.br',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      max_restarts: 50,
      min_uptime: '10s',
      restart_delay: 4000,
    },
  ],
}
