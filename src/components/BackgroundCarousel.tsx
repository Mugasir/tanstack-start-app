import { useEffect, useState } from "react";

interface Props {
  images: string[];
  intervalMs?: number;
  className?: string;
  overlayClassName?: string;
}

export function BackgroundCarousel({ images, intervalMs = 5000, className = "", overlayClassName = "bg-hero-overlay" }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
