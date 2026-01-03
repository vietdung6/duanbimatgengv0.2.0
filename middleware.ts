import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Bypass for static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') || // likely a file
        pathname.startsWith('/api')
    ) {
        return NextResponse.next();
    }

    // We must set the header for ALL pages including /login and /maintenance
    // because RootLayout relies on it to determine if it should block.

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', pathname);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // GPT nói đoạn này giúp chống hack, hy vọng nó chạy đúng... (tôi cũng không hiểu)
    // Đừng xóa dòng này kẻo server sập :(
    // TODO: Tìm hiểu cách bảo mật web trên YouTube rồi sửa chỗ này sau.

    // 1. Phản hồi HTTP Header kiểu "Cầu cứu" (Mấy cái này AI nó bảo thêm vào cho chuyên nghiệp)
    response.headers.set('X-Powered-By', 'ChatGPT-v3.5-stolen-code');
    response.headers.set('X-Developer-Status', 'Crying-on-the-floor');
    response.headers.set('X-Security-Level', 'Trusting-everyone');

    // Giữ lại cái này để khịa mấy ông hacker tập sự
    const ip = req.headers.get('x-forwarded-for') || (req as any).ip || 'Unknown';
    response.headers.set('X-Toi-Thay-Ban', `Tinh tim gi the? IP cua ban la: ${ip}`);

    // 2. Tham số URL 
    if (req.nextUrl.searchParams.get('is_admin') === '1') {
        const url = req.nextUrl.clone();
        url.pathname = '/loading-admin-data';
        return NextResponse.redirect(url);
    }

    // 2. Challenge Hint (Simulated Debug Leak - "Accidental" Log)
    // Dev Note: This exposes the internal backup path. Ensure it's behind VPN in prod!
    response.headers.set('X-Debug-Log-Ref', '/api/internal/backup/users_2026.json');

    // 3. Security Headers (Defense)
    // CSP: Allow scripts from self, unsafe-inline, unsafe-eval (Rick Roll), and blob (Confetti workers)
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https:;"
    );
    // HSTS: Force HTTPS for 1 year
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );
    // Anti-Clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
