import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// Get configuration from environment variables
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// Configuration for NextAuth
export const authOptions = {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
          recipesCreated: 0,
          createdAt: new Date().toISOString(),
          subscriptionTier: 'free',
          subscriptionStatus: 'trial',
          chefRank: 'Novice Chef',
          rankLevel: 1,
          preferredCuisines: [],
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your custom login logic here
        // This is a placeholder for your actual authentication
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          // This is where you would normally check your database
          // For now we just provide a mock user as a placeholder
          const user = {
            id: 'mock-user-id',
            name: 'Test User',
            email: credentials.email,
            image: 'https://example.com/avatar.jpg',
            firstName: 'Test',
            lastName: 'User',
            recipesCreated: 0,
            createdAt: new Date().toISOString(),
            subscriptionTier: 'free',
            subscriptionStatus: 'trial',
            chefRank: 'Novice Chef',
            rankLevel: 1,
            preferredCuisines: [],
          };
          
          return user;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.recipesCreated = user.recipesCreated;
        token.createdAt = user.createdAt;
        token.subscriptionTier = user.subscriptionTier;
        token.subscriptionStatus = user.subscriptionStatus;
        token.chefRank = user.chefRank;
        token.rankLevel = user.rankLevel;
        token.preferredCuisines = user.preferredCuisines;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.recipesCreated = token.recipesCreated;
        session.user.createdAt = token.createdAt;
        session.user.subscriptionTier = token.subscriptionTier;
        session.user.subscriptionStatus = token.subscriptionStatus;
        session.user.chefRank = token.chefRank;
        session.user.rankLevel = token.rankLevel;
        session.user.preferredCuisines = token.preferredCuisines;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', 
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-default-secret-dont-use-this-in-production',
};

// Export the NextAuth handler
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Export GET and POST handlers
export const GET = handlers.GET;
export const POST = handlers.POST;
