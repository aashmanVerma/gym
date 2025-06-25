import dotenv from 'dotenv'

dotenv.config()

const config = {
  auth: {
    secret: process.env.BETTER_AUTH_SECRET,
    baseUrl: process.env.BETTER_AUTH_URL
  },
  database: {
    url: process.env.DATABASE_URL
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.SENDER
  },
  exerciseAPI: {
    key: process.env.API_KEY,
    host: process.env.API_HOST
  }
}

export default config