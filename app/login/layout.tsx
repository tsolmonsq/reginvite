import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
