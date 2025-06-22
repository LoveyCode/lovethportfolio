import type { Metadata } from "next";
import {Outfit, Ovo} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";

const outfit = Outfit({
subsets: ["latin"],
weight: ["400", "500", "600", "700"]
});

const ovo = Ovo({
  subsets: ["latin"],
  weight: ["400"], 
  });

export const metadata: Metadata = {
  title: "Loveth's Portfolio",
  description: "Full-stack web developer showcasing responsive and scalable projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} ${ovo.className} antialiased`}>

         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
