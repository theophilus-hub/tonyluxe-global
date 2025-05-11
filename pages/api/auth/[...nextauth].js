import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

// In a production environment, you would store hashed passwords in a database
// For this example, we're using environment variables for simplicity
export const authOptions = {
  // Disable debug mode
  debug: false,
  // Use consistent secret key
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-for-testing-only",
  // Ensure the URL is correctly set for token validation
  trustHost: true,
  // Configure session to use JWT
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
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
        const managerPasswordHash = process.env.MANAGER_PASSWORD_HASH || '$2b$10$7LWzBlNsnkAL5S3SOvvFtuGI08N6eJ9MPdKKspi6b0yosmmTz8Hjq';
        
        // Auth logging removed
        
        // Check if the credentials match the admin user
        if (credentials.username === adminUsername) {
          const isAdminPasswordValid = await compare(credentials.password, adminPasswordHash);
          
          if (isAdminPasswordValid) {
            return { 
              id: '1', 
              name: 'Admin', 
              email: 'admin@tonyluxe.com',
              role: 'admin'
            };
          }
        }
        
        // Check if the credentials match the manager user
        if (credentials.username === managerUsername) {
          const isManagerPasswordValid = await compare(credentials.password, managerPasswordHash);
          
          if (isManagerPasswordValid) {
            return { 
              id: '2', 
              name: 'Manager', 
              email: 'manager@tonyluxe.com',
              role: 'manager'
            };
          }
        }
        
        // If credentials don't match, return null
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Add role and other user data to JWT token if user is defined (on sign in)
      if (user) {
        // JWT logging removed
        
        // Preserve all user properties in the token
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      
      // Token logging removed
      
      return token;
    },
    async session({ session, token }) {
      // Add user data to session from JWT token
      // Session token logging removed
      
      // Make sure all user properties are copied from token to session
      if (!session.user) {
        session.user = {};
      }
      
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      
      // Session data logging removed
      
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
};

export default NextAuth(authOptions);
