import logo from "@/assets/logo.png";

interface Props {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 44 }: Props) {
  return (
    <img
      src={logo}
      alt="KMI logo"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
