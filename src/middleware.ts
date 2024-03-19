import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { ROOT, DEFAULT_REDIRECT, PUBLIC_ROUTES } from "./app/lib/auth_routes";

const { auth } = NextAuth(authConfig);

export default auth((request) => {

    const { nextUrl } = request;

    const isAuthenticated = !!request.auth;
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

    if (isPublicRoute && isAuthenticated)
    {
        return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }
    // todo: edit this? more cases
    if (!isAuthenticated && !isPublicRoute)
    {
        return Response.redirect(new URL(ROOT, nextUrl));
    }
});

// Optionally, don't invoke Middleware on some paths
// https://authjs.dev/guides/upgrade-to-v5
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};