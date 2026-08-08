"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { usePopup } from "../contexts/PopupContext";

const FloatingButton: React.FC = () => {
  const { openPopup } = usePopup();

  return (
    <button
      onClick={openPopup}
      className="fixed bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+4.75rem)] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-accent text-primary shadow-[0_8px_24px_rgba(241,184,45,0.4)] transition-all duration-300 hover:bg-accent-deep hover:scale-105 group"
      aria-label="Get free consultation"
    >
      <MessageCircle className="h-[28px] w-[28px]" />
      <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-[10px] bg-primary px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
        Get Guidance
      </span>
    </button>
  );
};

export default FloatingButton;
