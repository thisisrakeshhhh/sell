import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "JerseyFlow — WhatsApp-First Custom Jersey Store",
  description: "Order premium, customizable sports jerseys directly on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[#10b981] selection:text-black">
        {children}
      </body>
    </html>
  );
}
