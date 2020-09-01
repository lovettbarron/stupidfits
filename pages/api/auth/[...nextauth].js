import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";
import { session } from "next-auth/client";

// const prisma = new PrismaClient();

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

const options = {
  site: process.env.HOST,
  debug: false,
  providers: [
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      scope: "email instagram_basic",
      profile: (_profile) => {
        console.log("PROFILE!", _profile);
        return {
          id: _profile.id,
          name: _profile.name,
          email: _profile.email,
        };
      },
    }),
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.SECRET,
  session: {
    jwt: false,
    maxAge: 90 * 24 * 60 * 60,
  },
  // jwt: {
  //   // A secret to use for key generation (you should set this explicitly)
  //   secret: process.env.SECRET,
  //   encryption: true,
  // },
  pages: {
    // signIn: "/api/auth/signin", // Displays signin buttons
    // signOut: '/api/auth/signout', // Displays form with sign out button
    error: "/api/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    newUser: "/me", // If set, new users will be directed here on first sign in
  },
  callbacks: {
    signIn: async (user, account, profile) => {
      // console.log("Signed in", user, account, profile);
      return Promise.resolve(true);
    },
    redirect: async (url, baseUrl) => {
      return Promise.resolve(baseUrl);
    },
    session: async (session, token) => {
      // console.log("sesh", session, user);
      // console.log("Session", token, session);
      if (!session?.user || !token?.account) {
        return Promise.resolve(session);
      }

      const user = await prisma.user.findOne({
        where: { email: session.user.email },
      });
      console.log("token", token);
      session.user.uid = user.uid;
      session.user.instagram = user.instagram;
      session.user.userId = token.user.id;
      session.user.id = token.user.id;
      session.accessToken = token.account.accessToken;
      console.log("Updated", session);
      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      // console.log("jwt", token, user, account, profile, isNewUser);
      const isSignIn = user ? true : false;
      if (user) {
        token.uid = user.id;
      }
      if (isSignIn) {
        token.auth_time = Math.floor(Date.now() / 1000);
      }
      return Promise.resolve(token);
    },
  },
  adapter: Adapters.Prisma.Adapter({
    prisma,
  }),
};

export default (req, res) => NextAuth(req, res, options);
