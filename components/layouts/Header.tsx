"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../ui/buttons/Button";
import { UserCircle2, LogOut } from "lucide-react"; 
import { useCookies } from "react-cookie";
import { useState } from "react";
import dynamic from "next/dynamic";

const CircularBackdrop = dynamic(() => import("../ui/assets/CircularBackdrop"), {
  ssr: false,
});

interface HeaderProps {
  isProtected?: boolean;
}

const Header = ({ isProtected = false }: HeaderProps) => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    removeCookie("token");
    router.push("/");
  };

  const handleNavigate = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      router.push(path);
    }, 1000); // simulate loading
  };

  return (
    <header className="bg-white w-full px-6 py-4 shadow-sm relative">
      {loading && <CircularBackdrop />}
      <nav className="container mx-auto flex justify-between items-center">
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.svg" alt="RegInvite logo" className="h-10" />
        </Link>

        {isProtected ? (
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/profile")}>
              <UserCircle2 className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              Гарах
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => handleNavigate("/login")}>Нэвтрэх</Button>
            <Button onClick={() => handleNavigate("/signup")}>Бүртгүүлэх</Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
