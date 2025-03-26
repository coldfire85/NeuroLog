import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock user database - in a real app, this would be a database
export const MOCK_USERS = [
  {
    id: "user1",
    email: "neurosurgeon@example.com",
    password: "password123", // NEVER do this in production!
    name: "Dr. Jane Smith",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    id: "user2",
    email: "admin@neurolog.com",
    password: "admin123", // NEVER do this in production!
    name: "Admin User",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

// Ensure we have a development secret
const DEVELOPMENT_SECRET = "this-is-a-development-secret-key-change-in-production";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV !== "production",
  secret: process.env.NEXTAUTH_SECRET || DEVELOPMENT_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
  },
  callbacks: {
    // Simplified session callback
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    // Simplified token callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          // Find user in our mock database
          const user = MOCK_USERS.find(
            (user) => user.email.toLowerCase() === credentials.email.toLowerCase()
          );

          if (!user) {
            return null;
          }

          // Simple password check - NEVER do this in production!
          const isPasswordValid = user.password === credentials.password;

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
});
