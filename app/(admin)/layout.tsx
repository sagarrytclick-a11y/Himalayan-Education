import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Panel - Himalayan Education",
  description: "Admin panel for managing MBBS admission enquiries",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-50">
        {children}
      </body>
    </html>
  );
}
