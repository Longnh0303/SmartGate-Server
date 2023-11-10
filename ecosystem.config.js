module.exports = {
    apps: [
      {
        name: 'SmartGate-Server',
        script: './src/index.js',
        instances: 'max',
        autorestart: true,
        exec_mode: 'cluster',
        watch: false,
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        combine_logs: true,
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        max_memory_restart: '1500M',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  