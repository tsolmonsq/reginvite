"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 p-4">
      {/* Illustration */}
      <div className="hidden md:flex items-center justify-center">
        <img src="/illustrations/login_signup_decoration.svg" alt="Illustration" className="max-w-md" />
      </div>

      {/* Login Form */}
      <div className="flex flex-col justify-center px-4 md:px-8">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="RegInvite" className="mx-auto h-12" />
          <h1 className="text-2xl font-semibold mt-4">Нэвтрэх</h1>
        </div>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Имэйл хаяг"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Нууц үг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Намайг сана</span>
            </label>
            <a href="#" className="hover:underline">
              Нууц үг сэргээх?
            </a>
          </div>
          <Button type="submit" variant="primary" className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500">
            Нэвтрэх
          </Button>
          <Button type="submit" variant="ghost" className="w-full bg-blue-400 text-primary py-2 rounded-md hover:bg-blue-500">
            Бүртгүүлэх
          </Button>
        </form>
      </div>
    </div>
  );
}
