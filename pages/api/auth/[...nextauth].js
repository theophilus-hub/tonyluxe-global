import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare, hash } from 'bcryptjs';

// In a production environment, you would store hashed passwords in a database
// For this example, we're using environment variables for simplicity
export const authOptions = {
    // Only enable debug in development environment
  debug: process.env.NODE_ENV === 'development',
  // Use consistent secret key
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-for-testing-only",
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Get credentials from environment variables
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '$2b$10$C25celpJegyHCLYzzm0vcOdUCJ2Jq9QtBWKz3TIuEJQWc0y4o0Mgm';
        const managerUsername = process.env.MANAGER_USERNAME || 'manager';
        const managerPasswordHash = process.env.MANAGER_PASSWORD_HASH || '$2b$10$7LWzBlNsnkAL5S3SOvvFtuGI08N6eJ9MPdKKspi6b0yosmmTz8Hjq'
        
        // Check if the credentials match the admin user
        if (credentials.username === adminUsername && 
            await compare(credentials.password, adminPasswordHash)) {
          return { 
            id: '1', 
            name: 'Admin', 
            email: 'admin@tonyluxe.com',
            role: 'admin'
          };
        }
        
        // Check if the credentials match the manager user
        if (credentials.username === managerUsername && 
            await compare(credentials.password, managerPasswordHash)) {
          return { 
            id: '2', 
            name: 'Manager', 
            email: 'manager@tonyluxe.com',
            role: 'manager'
          };
        }
        
        // If credentials don't match, return null
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT token if user is defined (on sign in)
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session from JWT token
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  // Configure cookies for cross-environment support
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
