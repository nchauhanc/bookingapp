import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { comparePassword } from "./hash";
import type { Role } from "@/types";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await comparePassword(credentials.password, user.password);
        if (!isValid) return null;

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role as Role,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // ── First sign-in (user object is present) ──────────────────────────────
      if (user) {
        token.role = (user as { role: Role }).role;
        token.sub = user.id;

        // Detect brand-new Google users: PrismaAdapter creates the row just
        // before this callback fires, so createdAt will be within a few seconds.
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { createdAt: true },
          });
          const ageMs = dbUser ? Date.now() - dbUser.createdAt.getTime() : Infinity;
          if (ageMs < 30_000) {
            // New user — send them to onboarding to pick Professional / Customer
            token.needsOnboarding = true;
          }
        }
      }

      // ── Session update (called after updateSession() on the client) ─────────
      // Clears the onboarding flag and refreshes role once they've chosen.
      if (trigger === "update") {
        token.needsOnboarding = false;
        // Re-read role from DB to pick up the change made by /api/onboarding
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role as Role;
        return token;
      }

      // ── Refresh role on every request if missing ────────────────────────────
      if (!token.role && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role as Role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};
