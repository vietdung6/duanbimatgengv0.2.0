const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function run() {
  console.log('Connecting to database...');

  try {
    console.log('Altering users table to support admin role...');
    // We use MODIFY COLUMN to change the ENUM definition
    await prisma.$executeRaw`ALTER TABLE users MODIFY COLUMN role ENUM('fan', 'staff', 'admin') DEFAULT 'fan'`;
    console.log('Table schema updated.');

    console.log('Updating "admin" user to have admin role...');
    const result = await prisma.$executeRaw`UPDATE users SET role = 'admin' WHERE username = 'admin'`;
    console.log(`Updated user.`);
    
    // Also try updating 'staff' user just in case
    // await prisma.$executeRaw`UPDATE users SET role = 'staff' WHERE username = 'staff'`;

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
    console.log('Connection closed.');
  }
}

run();
