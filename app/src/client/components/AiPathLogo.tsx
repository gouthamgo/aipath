import { cn } from "../utils";

interface AiPathLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "violet";
}

export function AiPathLogo({
  size = "md",
  showText = true,
  variant = "default",
}: AiPathLogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 40, text: "text-2xl" },
  };

  const { icon: iconSize, text: textSize } = sizes[size];

  // Color variants
  const gradientId = `logoGrad-${variant}`;
  const colors =
    variant === "violet"
      ? { from: "#8b5cf6", to: "#6366f1" } // violet to indigo
      : { from: "#f97316", to: "#eab308" }; // orange to yellow

  return (
    <div className="flex items-center gap-2.5">
      {/* Logo Mark - Abstract pathway forming "A" with milestone nodes */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
          <linearGradient
            id={`pathGrad-${variant}`}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        </defs>

        {/* Rounded rect background */}
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          fill={`url(#${gradientId})`}
        />

        {/* Path forming abstract "A" - representing the learning journey */}
        <path
          d="M12 28 L20 12 L28 28"
          stroke={`url(#pathGrad-${variant})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Horizontal connector - the crossbar */}
        <path
          d="M15 22 L25 22"
          stroke={`url(#pathGrad-${variant})`}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Milestone dots - learning checkpoints */}
        <circle cx="12" cy="28" r="2.5" fill="white" />
        <circle cx="20" cy="12" r="2.5" fill="white" />
        <circle cx="28" cy="28" r="2.5" fill="white" />
      </svg>

      {/* Logo Text */}
      {showText && (
        <span
          className={cn("font-bold tracking-tight", textSize)}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <span className="text-white">Ai</span>
          <span
            className={
              variant === "violet" ? "text-violet-400" : "text-gradient-primary"
            }
          >
            Path
          </span>
        </span>
      )}
    </div>
  );
}
