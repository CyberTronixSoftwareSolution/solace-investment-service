module.exports = {
    apps: [
      {
        name: 'solace-service',
        script: 'dist/src/app.js',
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      }
    ]
  };
  