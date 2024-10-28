import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        const { email, password } = credentials;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        try {
          const response = await axios.post(`${baseUrl}/login`, {
            email,
            password,
          });
          
          if (response.status === 200) {
            return {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              token: response.data.token,
            };
          }
          return null;
        } catch (error) {
          throw new Error(error.response?.data?.error || "Login failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.token = token.token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
});
