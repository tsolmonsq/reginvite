"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/Button";
import fetch from "@/lib/api"; // ✅ fetch utility

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Нууц үг хоорондоо таарахгүй байна!");
      return;
    }

    try {
      await fetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role: "user",
        }),
      });

      alert("Бүртгэл амжилттай! Та одоо нэвтрэх боломжтой.");
    } catch (err: any) {
      alert(err.message || "Бүртгэл хийхэд алдаа гарлаа");
    }
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 p-4">
      <div className="hidden md:flex items-center justify-center">
        <img
          src="/illustrations/login_signup_decoration.svg"
          alt="Illustration"
          className="max-w-md"
        />
      </div>

      <div className="flex flex-col justify-center px-4 md:px-8">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="RegInvite" className="mx-auto h-12" />
          <h1 className="text-2xl font-semibold mt-4">Бүртгүүлэх</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Имэйл хаяг"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Овог"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Нэр"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Нууц үг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {hasMounted && (showPassword ? <EyeOff size={18} /> : <Eye size={18} />)}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Нууц үг давтах"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {hasMounted && (showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />)}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500"
          >
            Бүртгүүлэх
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full border border-blue-400 text-blue-500 py-2 rounded-md hover:bg-blue-50"
            onClick={() => (window.location.href = "/login")}
          >
            Нэвтрэх
          </Button>
        </form>
      </div>
    </div>
  );
}
