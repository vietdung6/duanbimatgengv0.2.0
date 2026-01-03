
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const password = '123456'
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    // Update admin
    await prisma.user.update({
      where: { email: 'admin@geng.gg' },
      data: { password_hash: hashedPassword }
    })
    console.log('Updated admin password')

    // Update fan
    await prisma.user.update({
      where: { email: 'fan@geng.gg' },
      data: { password_hash: hashedPassword }
    })
    console.log('Updated fan password')
    
    console.log('All passwords set to: 123456')
  } catch (error) {
    console.error('Error updating passwords:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
