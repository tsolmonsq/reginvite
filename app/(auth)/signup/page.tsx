"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/buttons/Button";
import apiFetch from "@/lib/api";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState("Individual"); 
  const [organizationName, setOrganizationName] = useState(""); 

  useEffect(() => setHasMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Нууц үг хоорондоо таарахгүй байна!");
      return;
    }

    try {
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          organization_name: tab === "Organization" ? organizationName : undefined, 
          is_organization: tab === "Organization", 
        }),
      });

      alert("Бүртгэл амжилттай!");
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

        {/* Tab Navigation with Rounded Borders and Active Tab Style */}
        <div className="mb-6 flex justify-center space-x-4">
          <button
            className={`px-6 py-2 text-lg font-medium rounded-full transition duration-300 ${
              tab === "Individual" ? "bg-primary0 text-white" : "bg-white text-primary"
            } border-2 border-primary`}
            onClick={() => setTab("Individual")}
          >
            Хувь хүн
          </button>
          <button
            className={`px-6 py-2 text-lg font-medium rounded-full transition duration-300 ${
              tab === "Organization" ? "bg-primary text-white" : "bg-white text-primary"
            } border-2 border-primary`}
            onClick={() => setTab("Organization")}
          >
            Байгууллага
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Conditional Rendering Based on Tab */}
          {tab === "Individual" ? (
            <>
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
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Байгууллагын нэр"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <input
                type="text"
                placeholder="Имэйл хаяг"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </>
          )}

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
