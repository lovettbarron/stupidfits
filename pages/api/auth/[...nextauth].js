import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";

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
  debug: true,
  providers: [
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      scope: "email instagram_basic",
    }),
    // Providers.Email({
    //   server: process.env.MAIL_SERVER,
    //   from: "<hej@stupidfits.com>",
    // }),
  ],
  secret: process.env.SECRET,
  session: {
    jwt: true,
    maxAge: 90 * 24 * 60 * 60,
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET,
    encryption: true,
  },
  pages: {
    // signIn: "/api/auth/signin", // Displays signin buttons
    // signOut: '/api/auth/signout', // Displays form with sign out button
    error: "/api/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },
  callbacks: {
    signIn: async (user, account, profile) => {
      return Promise.resolve(true);
    },
    redirect: async (url, baseUrl) => {
      console.log("Redirect callback trigger");
      return Promise.resolve(baseUrl);
    },
    session: async (session, user) => {
      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      return Promise.resolve(token);
    },
  },
  adapter: Adapters.Prisma.Adapter({
    prisma,
  }),
};

export default (req, res) => NextAuth(req, res, options);
