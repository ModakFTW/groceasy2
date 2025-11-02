const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const migrationDir = path.join(__dirname, 'migrations');

// MariaDB connection details from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Function to run a SQL file
function runSqlFile(filePath) {
  return new Promise((resolve, reject) => {
    const mysqlPath = process.env.MYSQL_PATH || 'mysql';
    const command = `"${mysqlPath}" -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user}${dbConfig.password ? ` -p${dbConfig.password}` : ''} ${dbConfig.database} < "${filePath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${path.basename(filePath)}:`, error);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`Warnings from ${path.basename(filePath)}:`, stderr);
      }
      console.log(`Successfully executed ${path.basename(filePath)}`);
      resolve(stdout);
    });
  });
}

// Run migrations
async function runMigrations() {
  try {
    // Get all SQL files from migrations directory
    const files = fs.readdirSync(migrationDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensures files are run in order

    // Run each migration file
    for (const file of files) {
      const filePath = path.join(migrationDir, file);
      console.log(`Running migration: ${file}`);
      await runSqlFile(filePath);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();