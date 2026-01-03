const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
require('dotenv').config(); // Fallback to .env

// Create Prisma client instance
const createPrismaClient = () => {
  const connectionParams = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'geng_fandom',
    connectionLimit: 5
  }
  const adapter = new PrismaMariaDb(connectionParams)
  return new PrismaClient({ adapter })
}

const prisma = createPrismaClient();

async function migrate() {
  try {
    console.log('Creating user_history table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS user_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('point', 'admin', 'notification') NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        points_change INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log('Table user_history created successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
