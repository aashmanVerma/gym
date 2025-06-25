import config from "@/config"
import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
 
export const authClient =  createAuthClient({
    //you can pass client configuration here
    baseURL: config.auth.baseUrl
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  resetPassword,
  forgetPassword,
  changePassword,
  updateUser,
} = authClient;