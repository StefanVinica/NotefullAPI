module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN || 'secret',
    DB_URL: process.env.DB_URL,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://stefan@localhost/Notefull',
  }