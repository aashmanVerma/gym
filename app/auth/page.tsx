"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Zap,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      if (isLogin) {
        await signIn.email({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await signUp.email({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        });
      }

      router.push("/dashboard")
    } catch (err) {
      console.error(err)
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              SweatLab
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Join SweatLab"}
            </h1>
            <p className="text-gray-400 text-lg">
              {isLogin
                ? "Sign in to continue your fitness journey"
                : "Start your transformation today"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-red-500 hover:text-red-400 transition-colors text-sm"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="group w-full bg-gradient-to-r from-red-500 to-orange-500 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-red-500/25 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Switch between Login/Signup */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-500 hover:text-red-400 transition-colors font-semibold"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
