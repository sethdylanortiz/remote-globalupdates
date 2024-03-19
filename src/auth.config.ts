import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    session: {
        strategy: "jwt"
    },
    pages: {
        error: "/404",
        // make these two a page
		signIn: "/login",
		signOut: "/login",
    },
    callbacks: {
        authorized({ auth }) {
            const isAuthenticated = !!auth?.user;
            return isAuthenticated;
        }
    },
    providers: []
} satisfies NextAuthConfig;