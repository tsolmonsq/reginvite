import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <div className="absolute top-10 left-10">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
        </Link>
      </div>
      {children}
    </div>
  );
}
