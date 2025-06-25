import config from "@/config";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendEmail } from "./mail";
import { headers } from "next/headers";

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

// Utility function to get authenticated user in API routes
export const getAuthenticatedUser = async () => {
  try {
    const resolvedHeaders = await headers();
    const session = await auth.api.getSession({
      headers: resolvedHeaders,
    });

    if (!session || !session.user) {
      throw new Error('User not authenticated');
    }

    return session.user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
}