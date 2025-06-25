import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Load the font
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SweatLab",
  description: "Transform Yourself",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}