"use server";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

import { getUserDB } from './app/lib/dynamodb';

// https://medium.com/@renanleonel/how-to-set-up-nextauth-v5-authentication-with-middleware-and-jest-configuration-in-next-js-14-ca3e64bfb7d5
// https://authjs.dev/guides/upgrade-to-v5
// https://supunawa.medium.com/implementing-protected-routing-with-nextauth-v5-ef76c7adcbca
// https://javascript.plainenglish.io/complete-authentication-guide-using-next-auth-v5-in-next-js-14-70e7630ab1c2
// https://www.youtube.com/watch?v=Rs8018RO5YQ&ab_channel=SakuraDev

const config = {
	...authConfig,

	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' },
			},
            // authorization logic here
			async authorize(credentials) {
                
                const request = await getUserDB(credentials.email as string, credentials.password as string);
                console.log("auth.ts, authorize, request.Item: "); console.log(request.Item);

                // if user is found
                if(request.Item)
                {
                    return {
                        name: credentials.email,
                        password: credentials.password
                    };
                }
                else
                    return null;
			}
		})
	]

};

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);