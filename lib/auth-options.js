import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getDb } from '@/lib/mongodb';
import { comparePassword } from '@/lib/auth';

// Demo fallback customer for testing when MongoDB Atlas is offline or not yet connected
const FALLBACK_CUSTOMER = {
  id: 'customer_demo_001',
  email: 'customer@urbanfit.style',
  name: 'Streetwear Member',
  role: 'customer',
};

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'urban_fit_nextauth_fallback_secret_32bytes_long',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'customer@urbanfit.style' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        try {
          const db = await getDb();
          const user = await db.collection('users').findOne({ email });

          if (user && user.password) {
            const isValid = await comparePassword(password, user.password);
            if (!isValid) {
              throw new Error('Invalid email or password');
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name || 'Streetwear Member',
              role: user.role || 'customer',
              image: user.image || null,
            };
          }
        } catch (dbError) {
          console.warn('MongoDB query in NextAuth authorize failed, falling back:', dbError.message);
        }

        // Demo test credentials fallback (accessible even without active MongoDB)
        if (
          (email === 'customer@urbanfit.style' || email === 'customer@urbanfit.local') &&
          password === 'customer123'
        ) {
          return {
            id: FALLBACK_CUSTOMER.id,
            email: credentials.email,
            name: FALLBACK_CUSTOMER.name,
            role: FALLBACK_CUSTOMER.role,
          };
        }

        throw new Error('Invalid email or password');
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
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.email) {
        try {
          const db = await getDb();
          await db.collection('users').updateOne(
            { email: user.email.toLowerCase() },
            {
              $set: {
                email: user.email.toLowerCase(),
                name: user.name || 'Streetwear Member',
                image: user.image || null,
                role: 'customer',
                updatedAt: new Date(),
              },
              $setOnInsert: {
                createdAt: new Date(),
                orders: [],
                addresses: [],
              },
            },
            { upsert: true }
          );
        } catch (e) {
          console.warn('Could not sync Google user to MongoDB:', e.message);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user._id?.toString() || token.sub;
        token.role = user.role || 'customer';
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role || 'customer';
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export default authOptions;
