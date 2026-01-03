
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Past Matches (History) - 2024
  const pastMatches = [
    {
      home_team_name: 'Samsung Ozone',
      home_team_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ca/Samsung_Ozone_2013logo_square.png',
      opponent_name: 'SKT T1 #2',
      match_date: new Date('2013-06-15T08:00:00Z'),
      tournament: 'Champions Summer 2013',
      stage: 'Group Stage',
      match_status: 'finished',
      score_gen: 1,
      score_opp: 1,
      match_result: 'draw',
      match_type: 'BO2',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/77/T1logo_square.png'
    },
    {
      home_team_name: 'Samsung Blue',
      home_team_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/1a/Samsung_Bluelogo_square.png',
      opponent_name: 'KT Arrows',
      match_date: new Date('2014-08-16T09:00:00Z'),
      tournament: 'Champions Summer 2014',
      stage: 'Playoffs',
      round_name: 'Grand Finals',
      match_status: 'finished',
      score_gen: 2,
      score_opp: 3,
      match_result: 'loss',
      match_type: 'BO5',
      mvp: 'KaKAO', // KT KaKAO was MVP
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f8/KT_Rolsterlogo_square.png'
    },
    {
      home_team_name: 'Samsung Blue',
      home_team_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/1a/Samsung_Bluelogo_square.png',
      opponent_name: 'Samsung White',
      match_date: new Date('2014-10-11T08:00:00Z'),
      tournament: 'Worlds 2014',
      stage: 'Knockout Stage',
      round_name: 'Semifinals',
      match_status: 'finished',
      score_gen: 0,
      score_opp: 3,
      match_result: 'loss',
      match_type: 'BO5',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e5/Samsung_Whitelogo_square.png'
    },
    {
      opponent_name: 'T1',
      match_date: new Date('2024-04-14T08:00:00Z'), // 17:00 KST
      tournament: 'LCK Spring 2024',
      stage: 'Playoffs',
      round_name: 'Finals',
      match_status: 'finished',
      score_gen: 3,
      score_opp: 2,
      match_result: 'win',
      match_type: 'BO5',
      mvp: 'Kiin',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/77/T1logo_square.png'
    },
    {
      opponent_name: 'BLG',
      match_date: new Date('2024-05-19T09:00:00Z'), // 18:00 KST
      tournament: 'MSI 2024',
      stage: 'Bracket Stage',
      round_name: 'Grand Finals',
      match_status: 'finished',
      score_gen: 3,
      score_opp: 1,
      match_result: 'win',
      match_type: 'BO5',
      mvp: 'Lehends',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8c/Bilibili_Gaminglogo_square.png'
    },
    {
      opponent_name: 'HLE',
      match_date: new Date('2024-09-08T08:00:00Z'),
      tournament: 'LCK Summer 2024',
      stage: 'Playoffs',
      round_name: 'Finals',
      match_status: 'finished',
      score_gen: 2,
      score_opp: 3,
      match_result: 'loss',
      match_type: 'BO5',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9b/Hanwha_Life_Esportslogo_square.png'
    },
    {
      opponent_name: 'DK',
      match_date: new Date('2024-08-15T10:00:00Z'),
      tournament: 'LCK Summer 2024',
      stage: 'Regular Season',
      match_status: 'finished',
      score_gen: 2,
      score_opp: 0,
      match_result: 'win',
      match_type: 'BO3',
      mvp: 'Chovy',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/52/Dplus_KIAlogo_square.png'
    },
    {
      opponent_name: 'KT',
      match_date: new Date('2024-07-20T10:00:00Z'),
      tournament: 'LCK Summer 2024',
      stage: 'Regular Season',
      match_status: 'finished',
      score_gen: 2,
      score_opp: 1,
      match_result: 'win',
      match_type: 'BO3',
      mvp: 'Canyon',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f8/KT_Rolsterlogo_square.png'
    }
  ]

  // Future Matches (Schedule) - 2025
  const futureMatches = [
    {
      opponent_name: 'DK',
      match_date: new Date('2025-01-22T10:00:00Z'),
      tournament: 'LCK Spring 2025',
      stage: 'Regular Season',
      match_status: 'scheduled',
      match_type: 'BO3',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/52/Dplus_KIAlogo_square.png'
    },
    {
      opponent_name: 'KT',
      match_date: new Date('2025-01-25T08:00:00Z'),
      tournament: 'LCK Spring 2025',
      stage: 'Regular Season',
      match_status: 'scheduled',
      match_type: 'BO3',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f8/KT_Rolsterlogo_square.png'
    },
    {
      opponent_name: 'FOX',
      match_date: new Date('2025-01-29T10:00:00Z'),
      tournament: 'LCK Spring 2025',
      stage: 'Regular Season',
      match_status: 'scheduled',
      match_type: 'BO3',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a2/FearXlogo_square.png'
    },
    {
      opponent_name: 'DRX',
      match_date: new Date('2025-02-01T08:00:00Z'),
      tournament: 'LCK Spring 2025',
      stage: 'Regular Season',
      match_status: 'scheduled',
      match_type: 'BO3',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/DRXlogo_square.png'
    },
    {
      opponent_name: 'NS',
      match_date: new Date('2025-02-05T10:00:00Z'),
      tournament: 'LCK Spring 2025',
      stage: 'Regular Season',
      match_status: 'scheduled',
      match_type: 'BO3',
      opponent_logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a6/Nongshim_RedForcelogo_square.png'
    }
  ]

  console.log('Adding Past Matches...')
  for (const match of pastMatches) {
    await prisma.match.create({ data: match })
  }

  console.log('Adding Future Matches...')
  for (const match of futureMatches) {
    await prisma.match.create({ data: match })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
