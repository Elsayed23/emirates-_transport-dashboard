import { NextResponse } from 'next/server';

// Function to parse JWT
function parseJwt(token) {
    if (!token) {
        return null;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
}

export async function middleware(req) {
    const url = req.nextUrl;
    const { pathname, origin } = url;

    console.log('Request URL:', url);

    // Correctly access the cookie
    const token = req.cookies.get('__session')?.value; // Use the correct cookie name
    if (!token) {
        console.log('No token found');
        return NextResponse.redirect(`${origin}/stations`);
    }

    try {
        const decoded = parseJwt(token);
        console.log('Decoded token:', decoded);

        if (!decoded || !decoded.stationId) {
            console.log('Token does not contain stationId');
            return NextResponse.redirect(`${origin}/stations`);
        }

        const { stationId } = decoded;
        console.log('Station ID from token:', stationId);

        // Special case: If stationId is 10, allow access to view all stations
        if (stationId === 10) {
            console.log('Station ID is 10, allowing access to all stations');
            return NextResponse.next();
        }

        // Check for specific station path and enforce usual checks
        const match = pathname.match(/\/stations\/(\d+)/);
        if (match) {
            const stationIdFromUrl = parseInt(match[1], 10);
            console.log('Extracted stationId from URL:', stationIdFromUrl);

            if (stationId !== stationIdFromUrl) {
                console.log(`Station ID mismatch: token station ID (${stationId}) does not match URL station ID (${stationIdFromUrl})`);
                return NextResponse.redirect(`${origin}/stations`);
            }

            console.log('Station ID match');
            return NextResponse.next();
        }

        console.log('No stationId in URL');
        return NextResponse.next();
    } catch (error) {
        console.error('Token parsing failed:', error);
        return NextResponse.redirect(`${origin}/stations`);
    }
}

export const config = {
    matcher: ['/stations/:path*'],
};
