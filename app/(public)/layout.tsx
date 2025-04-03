import '../globals.css'
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: LayoutProps) {

  return (
    <html lang="en">
      <body>
          <Header/>
            <main>{children}</main>
          <Footer />
      </body>
    </html>
  );
}
