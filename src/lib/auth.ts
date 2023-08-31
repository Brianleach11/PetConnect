import {NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authConfig: NextAuthOptions ={
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
}