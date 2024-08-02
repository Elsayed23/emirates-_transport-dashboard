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
                return NextResponse.next();
            } else {
                return NextResponse.redirect(`${origin}/`);
            }
        }

        if (pathname.includes('/stations/add')) {
            if (decoded.role.name !== 'ADMIN') {
                return NextResponse.redirect(`${origin}/stations`);
            }
        }
        if (pathname.includes('/school/add')) {
            if (decoded.role.name !== 'ADMIN') {
                return NextResponse.redirect(`${origin}/`);
            }
        }


        if (pathname.startsWith('/stations/')) {
            // If stationId is null and the role is ADMIN or SAFETY_OFFICER, allow access to all stations
            if (!decoded.stationId && (decoded.role.name === 'ADMIN' || decoded.role.name === 'SAFETY_OFFICER') || decoded.role.name === 'SAFETY_MANAGER' || decoded.role.name === 'SAFETY_DIRECTOR') {
                return NextResponse.next(); // Allow access to all stations
            }

            // Ensure stationId exists in the token
            if (!decoded.stationId) {
                return NextResponse.redirect(`${origin}/stations`); // Redirect to /stations if token does not contain stationId
            }

            const { stationId } = decoded;

            // Check for specific station path and enforce usual checks
            const match = pathname.match(/\/stations\/([0-9a-fA-F-]+)/);
            if (match) {
                const stationIdFromUrl = match[1];

                if (stationId !== stationIdFromUrl) {
                    return NextResponse.redirect(`${origin}/stations`);
                }
            }

            return NextResponse.next();
        }

        return NextResponse.next();
    } catch (error) {
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
