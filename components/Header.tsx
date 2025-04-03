"use client";

import Link from "next/link";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Icon for avatar
import Button from "./Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white text-white w-full h-24 px-10 py-4 ">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          <img src="/logo.svg" />
        </Link>

        <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost">Нэвтрэх</Button>
              <Button>Бүртгүүлэх</Button>
            </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
