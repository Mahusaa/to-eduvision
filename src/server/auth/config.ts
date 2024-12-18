import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { DefaultSession, NextAuthConfig, } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";
import { users, accounts, sessions, verificationTokens } from "~/server/db/schema";
import { getUserByEmail } from "../queries";
import { verifyPassword } from "~/lib/auth-utils";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "abcd@gmail.com"
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password"
        }
      },
      async authorize(credentials) {
        const email = credentials?.email as string | null
        const password = credentials?.password as string | null;


        if (!email || !password) {
          console.log("Email or password is missing");
          return null;
        }
        const user = await getUserByEmail(email)
        if (!user) {
          console.log("User not found");
          return null;
        }
        const isPasswordValid = await verifyPassword(password, user.password!);
        if (isPasswordValid) {
          return user;
        } else {
          console.log("Invalid password");
          return null;
        }
      }
    })
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-expect-error: my User token.role doesnt define in my User
        token.role = user.role
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        return session
      }
      return session;
    },
  },
  session: {
    strategy: "jwt"
  },
} satisfies NextAuthConfig;

