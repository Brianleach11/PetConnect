import {NextAuthOptions, Session, getServerSession} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "./supabaseDbClient";
import {SupabaseAdapter, SupabaseAdapterOptions} from "@auth/supabase-adapter"
import { Adapter } from "next-auth/adapters";

function getGoogleCredentials(){
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || clientId.length === 0)
  {
    throw new Error("Missing GOOGLE_CLIENT_ID")
  }
  if (!clientSecret || clientSecret.length === 0)
  {
    throw new Error("Missing GOOGLE_CLIENT_SECRET")
  }
  return {clientId, clientSecret}
}

function getSupabaseCredentials(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || url.length === 0)
  {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  }
  if (!secret || secret.length === 0)
  {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  }
  return {url, secret} as SupabaseAdapterOptions
}

export const authConfig: NextAuthOptions ={
  adapter: SupabaseAdapter(getSupabaseCredentials()) as Adapter,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
        clientId: getGoogleCredentials().clientId,
        clientSecret: getGoogleCredentials().clientSecret,
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "example@example.com",
          },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const user = { id: "1", name: "Admin", email: "admin@admin.com" };
          return user;
        },
    }),
  ],
  callbacks: {
    async session({token, session}){
      if(token) {
        session.user!.id = token.id
        session.user!.name = token.name
        session.user!.email = token.email
        session.user!.image = token.picture
      }
      return session
    },
    async jwt ({token, user}) {
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', token.email)
        .single();

      // Check for errors from the Supabase query
      if (error) {
        // Handle the error as needed
        console.error('Error fetching user:', error.message);
        return token; // or handle the error in a different way
      }

      // If the user exists in the database, use their ID in the token
      if (dbUser && dbUser.id) {
        token.id = dbUser.id;
      }

      return token;
    },
    redirect(){
      return '/'
    }
  },
}

export const getAuthSession = () => getServerSession(authConfig)