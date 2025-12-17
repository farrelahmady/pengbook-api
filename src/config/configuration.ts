export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  log: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
});
