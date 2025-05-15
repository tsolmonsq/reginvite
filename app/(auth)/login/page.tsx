"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { CircularProgress } from '@mui/material';
import Button from "@/components/ui/buttons/Button";
import apiFetch from "@/lib/api";

export default function LoginPage() {
  const [cookies, setCookie] = useCookies(["token"]);
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setloading(true); 
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
  
      setCookie("token", data.access_token, {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });
  
      router.push("/events");
    } catch (err: any) {
      alert("Error when login: " + err.message);
    } finally {
      setloading(false); 
    }
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 p-4">
      {loading && (
        <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex justify-center items-center">
          <CircularProgress color="primary" size={40} thickness={5} />
        </div>
      )}
    
      <div className={`hidden md:flex items-center justify-center ${loading ? 'blur-sm pointer-events-none' : ''}`}>
        <img
          src="/illustrations/login_signup_decoration.svg"
          alt="Illustration"
          className="max-w-md"
        />
      </div>
      <div className={`flex flex-col justify-center px-4 md:px-8 ${loading ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="RegInvite" className="mx-auto h-12" />
          <h1 className="text-2xl font-semibold mt-4">Нэвтрэх</h1>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Имэйл хаяг"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
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
          <Button
            type="submit"
            variant="primary"
            className="w-full bg-blue-400 text-white py-2 rounded-md"
          >
            Нэвтрэх
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => (window.location.href = "/signup")}
            className="w-full border border-blue-400 text-blue-500 py-2 rounded-md"
          >
            Бүртгүүлэх
          </Button>
        </form>
      </div>
    </div>
  );
}
