"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { forgetPassword, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function page() {
  const router = useRouter()

  const [form, setForm] = useState<{
    name: null | string,
    email: null | string,
    password: null | string
  }>({
    name: null,
    email: null,
    password: null
  })

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    [key: string]: string | undefined;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const submit = async () => {
    try {
      await signIn.email({
        email: form.email ?? '',
        password: form.password ?? ''
      })

      router.push("/dashboard")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={submit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}