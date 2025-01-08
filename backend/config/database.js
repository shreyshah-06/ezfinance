const Sequelize = require('sequelize')
// module.exports = new Sequelize('ezfinance','postgres','admin',{
//     host: 'localhost',
//     dialect:"postgres",
// });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);  // Stop execution if the database URL is not provided
}

module.exports = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false  // SSL support for AWS RDS
      }
    },
    logging: false,  // Disable logging if not needed
    pool: {
      max: 5, // Max number of connections
      min: 0, // Min number of connections
      acquire: 30000, // Max time (in ms) to wait for a connection
      idle: 10000 // Max time (in ms) a connection can be idle before being released
    }
  });