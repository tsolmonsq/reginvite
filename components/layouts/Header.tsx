"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../ui/buttons/Button";
import { UserCircle2, LogOut } from "lucide-react"; // Import LogOut icon from lucide-react
import { useCookies } from "react-cookie"; // Import useCookies hook

interface HeaderProps {
  isProtected?: boolean; 
}

const Header = ({ isProtected = false }: HeaderProps) => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]); // Access cookies to handle logout

  const handleLogout = () => {
    removeCookie("token");
    router.push("/");
  };

  return (
    <header className="bg-white w-full px-6 py-4 shadow-sm">
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
            <Button variant="ghost" onClick={() => router.push("/login")}>Нэвтрэх</Button>
            <Button onClick={() => router.push("/signup")}>Бүртгүүлэх</Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
