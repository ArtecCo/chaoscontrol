import type { ReactNode } from "react";

interface Props {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export default function IconButton({ label, onClick, children, active, className = "" }: Props) {
  return (
    <button
      className={`icon-button ${active ? "is-active" : ""} ${className}`}
      aria-label={label}
      title={label}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}