import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/static/',
                    // Easter Eggs for curious bots/users checking robots.txt
                    '/t1-fan-club/',
                    '/why-gen-g-is-better/',
                    '/chovy-cs-hack/',
                    '/secret-base/',
                    '/how-to-beat-geng-tutorial-404/',
                    '/faker-secret-fanpage/',
                    '/dev-confession.html', // <--- You found it!
                    '/geng-worlds-2025-script/', // Easter Egg #4 Hint: robots.txt is the map itself!
                    '/ruler-comeback-confirmation/',
                    '/dont-waste-your-time-here/',
                ],
            },
            {
                userAgent: 'T1-Spy-Bot',
                disallow: ['/'],
                // Crawl delay: 9999 years
            },
        ],
        sitemap: 'https://geng-fandom.vercel.app/sitemap.xml', // Update with real domain later
    };
}
