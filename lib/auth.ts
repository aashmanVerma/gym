import config from "@/config";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendEmail } from "./mail";

export const auth = betterAuth({
  database: new Pool({
    connectionString: config.database.url!
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url, token}, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
})

export const updatePassword = async (newPassword: string, userId: string) => {
  const ctx = await auth.$context
  const hash = await ctx.password.hash(newPassword)

  await ctx.internalAdapter.updatePassword(userId, hash)  
}