// app/layout.tsx


import "./globals.css";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { AlertProvider } from "@/features/alert/alert-store";
import { ApiInitializer } from "@/features/api/ApiInitializer";
import { Header } from "@/widgets/header/Header";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", montserrat.variable)}
    >
      <body suppressHydrationWarning>
        <AlertProvider>
          <ApiInitializer>
            <AuthProvider>
              <Header/>
              {children}
            </AuthProvider>
          </ApiInitializer>
        </AlertProvider>
      </body>
    </html>
  );
}