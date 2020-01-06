module.exports = {
  apps : [{
    name: 'EPA_MAIN',
    script: 'bin/main.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '54.238.248.160',
      key:`${process.env.HOME}/.ssh/ENV.pem`,
      ref  : 'origin/master',
      repo : 'git@github.com:MerMerLtd/EnvDashboard.git',
      path : '/etc/EnvDashboard',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
