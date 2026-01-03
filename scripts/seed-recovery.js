
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Seed Users
  const users = [
    {
      email: 'admin@geng.gg',
      username: 'admin',
      password_hash: '$2b$10$YourHashedPasswordHere', // Bạn nên dùng hash thật nếu có
      role: 'admin',
      points: 1000,
      display_name: 'Admin Gen.G'
    },
    {
      email: 'fan@geng.gg',
      username: 'fan1',
      password_hash: '$2b$10$YourHashedPasswordHere',
      role: 'fan',
      points: 100,
      display_name: 'Gen.G Fan'
    }
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        username: u.username,
        password_hash: u.password_hash,
        role: u.role,
        points: u.points,
        display_name: u.display_name
      }
    })
  }
  console.log('Seeded Users')

  // Seed Matches
  const matches = [
    {
      opponent_name: 'T1',
      match_date: new Date('2025-01-15T17:00:00Z'),
      tournament: 'LCK',
      match_status: 'scheduled',
      home_team_name: 'Gen.G'
    },
    {
      opponent_name: 'HLE',
      match_date: new Date('2025-01-18T17:00:00Z'),
      tournament: 'LCK',
      match_status: 'scheduled',
      home_team_name: 'Gen.G'
    }
  ]

  for (const m of matches) {
    await prisma.match.create({
      data: m
    })
  }
  console.log('Seeded Matches')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
