"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

const ContactPopup = dynamic(() => import("./ContactPopup"), { ssr: false });
const FloatingButton = dynamic(() => import("./FloatingButton"), { ssr: false });
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), { ssr: false });

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
