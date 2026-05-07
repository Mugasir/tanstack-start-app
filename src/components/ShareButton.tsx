import { Share2 } from "lucide-react";
import { useState } from "react";
import { nativeShare, buildShareUrl } from "@/lib/media";

interface Props {
  path: string;
  title: string;
  text?: string;
  className?: string;
  variant?: "icon" | "button";
}

export function ShareButton({ path, title, text, className = "", variant = "icon" }: Props) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    const result = await nativeShare({ title, text, url: buildShareUrl(path) });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handle}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium glass-card hover:scale-105 transition-transform ${className}`}
      >
        <Share2 className="w-4 h-4" />
        {copied ? "Link copied!" : "Share"}
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      title={copied ? "Link copied!" : "Share"}
      className={`w-9 h-9 grid place-items-center rounded-full glass-card hover:scale-110 transition-transform ${className}`}
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
}
