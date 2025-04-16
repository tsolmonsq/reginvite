import { AlertProvider } from '@/context/AlertProvider';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AlertProvider>
      </body>
    </html>
  );
}