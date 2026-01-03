const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const hash = await bcrypt.hash('Admin@123', 10);

        const user = await prisma.user.create({
            data: {
                email: 'admin@gengfandom.fun',
                username: 'genadmin',
                display_name: 'Gen Admin',
                password_hash: hash,
                role: 'admin'
            }
        });

        console.log('✅ Admin account created successfully!');
        console.log('Email:', user.email);
        console.log('Username:', user.username);
        console.log('Password: Admin@123');
    } catch (error) {
        if (error.code === 'P2002') {
            console.log('⚠️ User already exists, updating role to admin...');
            await prisma.user.update({
                where: { email: 'admin@gengfandom.fun' },
                data: { role: 'admin' }
            });
            console.log('✅ Role updated to admin!');
        } else {
            throw error;
        }
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
