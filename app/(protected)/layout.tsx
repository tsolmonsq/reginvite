import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isProtected />
        <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
