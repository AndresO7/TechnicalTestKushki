import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetShop - Tu tienda de mascotas online",
  description: "Encuentra tu compañero perfecto en nuestra tienda de mascotas online",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-secondary-50`}>
        <Navbar />
        <main className="pt-6">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
