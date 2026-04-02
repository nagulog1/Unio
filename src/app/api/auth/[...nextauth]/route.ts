import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { setDocData, getDocById } from "@/lib/firebase/db";
import { createUserDocument, getUserDocument } from "@/lib/firebase/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in Firestore
        const existingUser = await getDocById("users", user.id || user.email || "");
        
        if (!existingUser) {
          // Create new user document in Firestore
          const userId = user.id || user.email || "";
          await createUserDocument(
            userId,
            user.email || "",
            user.name || "Anonymous",
            user.image
          );

          // Store OAuth account info
          await setDocData("accounts", `${userId}-${account?.provider}`, {
            userId,
            type: account?.type,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
            refresh_token: account?.refresh_token,
            access_token: account?.access_token,
            expires_at: account?.expires_at,
            token_type: account?.token_type,
            scope: account?.scope,
            id_token: account?.id_token,
            session_state: account?.session_state,
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
