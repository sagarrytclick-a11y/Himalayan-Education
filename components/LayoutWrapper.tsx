"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ContactPopup from "./ContactPopup";
import FloatingButton from "./FloatingButton";
import WhatsAppButton from "./WhatsAppButton";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ContactPopup />
      <FloatingButton />
      <WhatsAppButton />
    </>
  );
}
