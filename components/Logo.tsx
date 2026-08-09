import React from "react";
import Image from "next/image";
import { SITE_IDENTITY } from "@/app/config/site_identity";

interface LogoProps {
  className?: string;
  imageWrapperClassName?: string;
  showText?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "h-11 w-11 object-contain",
  imageWrapperClassName,
  showText = true,
  light = false,
}) => {
  const textColor = light ? "#FFFFFF" : "#0F2042";

  const image = (
    <Image
      src={SITE_IDENTITY.logo.primary}
      alt={SITE_IDENTITY.name}
      width={56}
      height={56}
      className={className}
      priority
    />
  );

  return (
    <div className="flex items-center gap-3 select-none">
      {imageWrapperClassName ? (
        <span className={imageWrapperClassName}>{image}</span>
      ) : (
        image
      )}
      {showText && (
        <div className="flex flex-col min-w-0">
          <span
            className="font-display font-bold tracking-tight text-[15px] sm:text-[17px] leading-snug"
            style={{ color: textColor }}
          >
            {SITE_IDENTITY.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
