import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers } from "@/contexts/Providers";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "InstallNGo Admin Portal",
  description: "Web admin dashboard for InstallNGo management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <Providers>
          <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}