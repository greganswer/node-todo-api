const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  // The file below is NOT required in production
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
