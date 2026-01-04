import { ReactNode } from "react";

// ============================================
// CONTAINER - Responsive width container
// ============================================
interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl 2xl:max-w-[1600px]",
  full: "max-w-[1400px] 2xl:max-w-[1800px]",
};

export function Container({ children, className = "", size = "xl" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${containerSizes[size]} ${className}`}>
      {children}
    </div>
  );
}

// ============================================
// SECTION - Page section with padding
// ============================================
interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Section({ children, id, className = "", size = "xl" }: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 xl:py-32 relative ${className}`}>
      <Container size={size}>{children}</Container>
    </section>
  );
}

// Legacy support
export function SectionWrapper({
  children,
  id,
  className = "",
  size = "default",
  maxWidth
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  size?: "default" | "wide" | "full";
  maxWidth?: string;
}) {
  const sizeMap = {
    default: "xl" as const,
    wide: "full" as const,
    full: "full" as const,
  };
  return <Section id={id} className={className} size={sizeMap[size]}>{children}</Section>;
}

// ============================================
// SECTION HEADER - Title and subtitle
// ============================================
interface SectionHeaderProps {
  badge?: string;
  badgeColor?: "violet" | "amber" | "cyan" | "emerald";
  title: ReactNode;
  subtitle?: string;
  centered?: boolean;
}

const badgeStyles = {
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function SectionHeader({
  badge,
  badgeColor = "violet",
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 sm:mb-16 lg:mb-20 ${centered ? "text-center" : ""}`}>
      {badge && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-6 ${badgeStyles[badgeColor]}`}
        >
          {badge}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-zinc-400 text-base sm:text-lg lg:text-xl leading-relaxed ${centered ? "max-w-3xl mx-auto" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============================================
// CARD - Base card component
// ============================================
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  highlight?: boolean;
}

export function Card({ children, className = "", hover = true, highlight = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border transition-all duration-300
        ${highlight
          ? "bg-violet-500/5 border-violet-500/20"
          : "bg-white/[0.02] border-white/[0.06]"
        }
        ${hover ? "hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Legacy support
export function SectionCard({
  children,
  className = "",
  hover = true,
  accentColor
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  accentColor?: string;
}) {
  return <Card className={className} hover={hover}>{children}</Card>;
}

// ============================================
// FEATURE ICON - Icon container
// ============================================
interface FeatureIconProps {
  children: ReactNode;
  color?: "violet" | "cyan" | "amber" | "emerald";
  size?: "sm" | "md" | "lg";
}

const iconColors = {
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const iconSizes = {
  sm: "w-10 h-10 rounded-lg",
  md: "w-12 h-12 rounded-xl",
  lg: "w-14 h-14 rounded-xl",
};

export function FeatureIcon({ children, color = "violet", size = "md" }: FeatureIconProps) {
  return (
    <div className={`inline-flex items-center justify-center border ${iconColors[color]} ${iconSizes[size]}`}>
      {children}
    </div>
  );
}

// ============================================
// STAT - Statistic display
// ============================================
interface StatProps {
  value: string;
  label: string;
  className?: string;
}

export function Stat({ value, label, className = "" }: StatProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-1">
        {value}
      </div>
      <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

// Legacy support
export function StatCard({ value, label, index }: { value: string; label: string; index?: number }) {
  return (
    <Card className="p-6 text-center" hover={false}>
      <Stat value={value} label={label} />
    </Card>
  );
}

// ============================================
// CHECK ITEM - List item with check
// ============================================
interface CheckItemProps {
  children: ReactNode;
  color?: "violet" | "cyan" | "amber" | "emerald";
}

const checkColors = {
  violet: "text-violet-400",
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
};

export function CheckItem({ children, color = "emerald" }: CheckItemProps) {
  return (
    <li className="flex items-start gap-3">
      <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${checkColors[color]}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-zinc-300 text-sm sm:text-base">{children}</span>
    </li>
  );
}

// ============================================
// BADGE - Status/label badge
// ============================================
interface BadgeProps {
  children: ReactNode;
  variant?: "solid" | "outline" | "free" | "pro";
  color?: "violet" | "cyan" | "amber" | "emerald";
  className?: string;
}

const solidBadgeColors = {
  violet: "bg-violet-500 text-white",
  cyan: "bg-cyan-500 text-white",
  amber: "bg-amber-500 text-zinc-900",
  emerald: "bg-emerald-500 text-white",
};

export function Badge({ children, variant = "solid", color = "violet", className = "" }: BadgeProps) {
  if (variant === "free") {
    return <span className={`badge-free ${className}`}>{children}</span>;
  }
  if (variant === "pro") {
    return <span className={`badge-pro ${className}`}>{children}</span>;
  }
  if (variant === "outline") {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20 text-white/80 ${className}`}>
        {children}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${solidBadgeColors[color]} ${className}`}>
      {children}
    </span>
  );
}

// ============================================
// GRADIENT TEXT - Styled text spans
// ============================================
interface GradientTextProps {
  children: ReactNode;
  variant?: "primary" | "warm" | "cool";
}

export function GradientText({ children, variant = "primary" }: GradientTextProps) {
  const classes = {
    primary: "text-gradient",
    warm: "text-gradient-warm",
    cool: "text-gradient-cool",
  };
  return <span className={classes[variant]}>{children}</span>;
}

// ============================================
// BUTTON - Action button
// ============================================
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "cta";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  onClick?: () => void;
}

const buttonVariants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  cta: "btn-cta",
};

const buttonSizes = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export function Button({ children, variant = "primary", size = "md", className = "", href, onClick }: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-semibold ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;

  if (href) {
    return <a href={href} className={classes}>{children}</a>;
  }

  return <button onClick={onClick} className={classes}>{children}</button>;
}

// ============================================
// DIVIDER - Section divider
// ============================================
export function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent ${className}`} />;
}
