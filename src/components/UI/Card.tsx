import type {
  HTMLAttributes,
  ReactNode,
} from "react";

type CardPadding =
  | "none"
  | "small"
  | "medium"
  | "large";

type CardShadow =
  | "none"
  | "small"
  | "medium";

interface CardProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: CardPadding;
  shadow?: CardShadow;
  bordered?: boolean;
}

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  small: "p-4",
  medium: "p-6",
  large: "p-8",
};

const shadowClasses: Record<CardShadow, string> = {
  none: "",
  small: "shadow-sm",
  medium: "shadow-lg",
};

export default function Card({
  children,
  padding = "medium",
  shadow = "small",
  bordered = true,
  className = "",
  ...cardProps
}: CardProps) {
  const cardClasses = [
    "rounded-2xl bg-white",
    bordered ? "border border-slate-200" : "",
    paddingClasses[padding],
    shadowClasses[shadow],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClasses}
      {...cardProps}
    >
      {children}
    </div>
  );
}