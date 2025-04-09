"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { UserCircle2 } from "lucide-react";

interface HeaderProps {
  isProtected?: boolean; // default false
}

const Header = ({ isProtected = false }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="bg-white w-full px-6 py-4 shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.svg" alt="RegInvite logo" className="h-10" />
        </Link>

        {isProtected ? (
          // 👉 Protected layout
          <button onClick={() => router.push("/profile")}>
            <UserCircle2 className="w-6 h-6 text-gray-700 hover:text-gray-900" />
          </button>
        ) : (
          // 👉 Public layout
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/login")}>Нэвтрэх</Button>
            <Button onClick={() => router.push("/signup")}>Бүртгүүлэх</Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
