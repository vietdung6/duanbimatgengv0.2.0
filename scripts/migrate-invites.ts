import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionParams = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'geng_fandom',
  connectionLimit: 5
};

const adapter = new PrismaMariaDb(connectionParams);
const prisma = new PrismaClient({ adapter });

async function migrate() {
  try {
    console.log("Checking invite_tokens table...");
    const columns: any[] = await prisma.$queryRaw`
      SHOW COLUMNS FROM invite_tokens LIKE 'role'
    `;

    if (columns.length > 0) {
      console.log("Column 'role' already exists.");
    } else {
      console.log("Adding 'role' column...");
      await prisma.$executeRaw`
        ALTER TABLE invite_tokens ADD COLUMN role ENUM('fan', 'staff') NOT NULL DEFAULT 'fan' AFTER used_by_user_id
      `;
      console.log("Migration successful!");
    }
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
