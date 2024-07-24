import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Function to parse JWT
function parseJwt(token) {
    if (!token) { return; }
    const decoded = jwtDecode(token);

    return decoded;
}


export async function middleware(req) {
    const url = req.nextUrl;
    const { pathname, origin } = url;

    // Skip middleware for static files and API routes
    if (pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Correctly access the cookie
    const token = req.cookies.get('__session')?.value; // Use the correct cookie name
    if (!token) {
        console.log('No token found');
        if (pathname !== '/login') {
            return NextResponse.redirect(`${origin}/login`); // Redirect to login page if no token
        } else {
            return NextResponse.next(); // Allow access to the login page
        }
    }

    try {
        const decoded = parseJwt(token);

        if (!decoded) {
            console.log('Invalid token');
            if (pathname !== '/login') {
                return NextResponse.redirect(`${origin}/login`); // Redirect to login page if token is invalid
            } else {
                return NextResponse.next(); // Allow access to the login page
            }
        }

        if (pathname.startsWith('/users')) {
            if (decoded.role.name === 'ADMIN') {
                return NextResponse.next(); // Allow access to all stations
            } else {
                return NextResponse.redirect(`${origin}/`);
            }

        }

        if (pathname.startsWith('/stations/')) {
            // If stationId is null and the role is ADMIN or SAFETY_OFFICER, allow access to all stations
            if (!decoded.stationId && (decoded.role.name === 'ADMIN' || decoded.role.name === 'SAFETY_OFFICER')) {
                return NextResponse.next(); // Allow access to all stations
            }

            // Ensure stationId exists in the token
            if (!decoded.stationId) {
                console.log('Token does not contain stationId');
                return NextResponse.redirect(`${origin}/stations`); // Redirect to /stations if token does not contain stationId
            }

            const { stationId } = decoded;

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
            }

            return NextResponse.next();
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Token parsing failed:', error);
        if (pathname !== '/login') {
            return NextResponse.redirect(`${origin}/login`); // Redirect to login page if token parsing fails
        } else {
            return NextResponse.next(); // Allow access to the login page
        }
    }
}

export const config = {
    matcher: ['/:path*'],
};
