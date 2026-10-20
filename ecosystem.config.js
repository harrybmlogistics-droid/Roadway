// ecosystem.config.js - PM2 configuration for Hostinger VPS & Cloud Servers
module.exports = {
  apps: [
    {
      name: 'rlg-backend',
      script: './backend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
