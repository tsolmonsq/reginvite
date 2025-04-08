"use client";

import Link from "next/link";
import Button from "./Button";
import { useRouter } from "next/navigation"; 

const Header = () => {
  const router = useRouter();
  
  return (
    <header className="bg-white text-white w-full h-24 px-10 py-4 ">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          <img src="/logo.svg" />
        </Link>

        <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/login")}>Нэвтрэх</Button>
              <Button onClick={() => router.push("/signup")}>Бүртгүүлэх</Button>
            </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
