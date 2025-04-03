"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember me:", rememberMe);
  };

  return (
      <div className="w-full flex item-center justify-center max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* SVG Image Section */}
        <div className="hidden md:flex items-center justify-center bg-white p-6">
          <Image
            src="/illustrations/login_signup_decoration.svg" // Зургийг public дотроо байрлуулсан байх
            alt="Login Illustration"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Login Form Section */}
        <div className="flex flex-col justify-center p-10">
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.svg" alt="RegInvite Logo" width={100} height={100} />
            <h2 className="text-2xl font-bold mt-4">Нэвтрэх</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Имэйл хаяг"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Нууц үг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Намайг сана
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Нууц үг сэргээх?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-700"
            >
              Нэвтрэх
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            Бүртгэлгүй юу?{' '}
            <Link href="/register" className="text-sky-600 font-medium hover:underline">
              Бүртгүүлэх
            </Link>
          </div>
        </div>
      </div>
  );
}
