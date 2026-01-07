module.exports = {
  apps: [{
    name: 'lcci-nextjs',
    script: 'npm',
    args: 'start',
    cwd: '/root/lcci-global',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/root/lcci-global/logs/pm2-error.log',
    out_file: '/root/lcci-global/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};

