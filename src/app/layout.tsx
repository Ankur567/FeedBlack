"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation"; // Import usePathname

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname(); // Get the current route
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"); // Check if it's an auth page

  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {!isAuthPage && <Navbar />} {/* Hide Navbar on /auth pages */}
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
