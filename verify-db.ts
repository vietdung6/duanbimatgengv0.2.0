
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    try {
        const count = await prisma.systemConfig.count()
        console.log(`SystemConfig count: ${count}`)
    } catch (e) {
        console.error("Error:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
