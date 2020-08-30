import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    // OAuth authentication providers
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    })
    // Sign in with passwordless email link
    Providers.Email({
      server: process.env.MAIL_SERVER,
      from: '<no-reply@example.com>'
    }),
  ],
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL
}

export default (req, res) => NextAuth(req, res, options)
