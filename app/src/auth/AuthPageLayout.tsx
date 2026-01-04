import { ReactNode } from "react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AiPathLogo } from "../client/components/AiPathLogo";

interface AuthPageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthPageLayout({ children, title, subtitle }: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#09090b] flex relative overflow-hidden">
      {/* Global Background - matches landing page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary gradient - top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] opacity-50" />

        {/* Secondary gradient - bottom right */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[100px] opacity-40" />

        {/* Accent gradient - left */}
        <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[80px] opacity-30" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Additional local effects for left panel */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <WaspRouterLink to={routes.LandingPageRoute.to} className="group-hover:scale-105 transition-transform">
            <AiPathLogo size="lg" />
          </WaspRouterLink>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                <span className="text-white">Master AI Engineering</span>
                <br />
                <span className="text-gradient">One Lesson at a Time</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-md">
                Join thousands of developers learning to build production AI systems with hands-on projects.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-white">85+</div>
                <div className="text-sm text-zinc-500">Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">17</div>
                <div className="text-sm text-zinc-500">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-sm text-zinc-500">Phases</div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="glass-card rounded-2xl p-6 max-w-md">
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
              "AI Path transformed my career. I went from basic Python to building production RAG systems in just 3 months."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold text-sm">
                SK
              </div>
              <div>
                <div className="text-white font-medium text-sm">Sarah Kim</div>
                <div className="text-zinc-500 text-xs">ML Engineer at Stripe</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <WaspRouterLink to={routes.LandingPageRoute.to}>
              <AiPathLogo size="lg" />
            </WaspRouterLink>
          </div>

          {/* Title */}
          {title && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
              {subtitle && <p className="text-zinc-400 text-lg">{subtitle}</p>}
            </div>
          )}

          {/* Form Container */}
          <div className="glass-card rounded-2xl p-8">
            {children}
          </div>

          {/* Footer */}
          <p className="text-center text-zinc-500 text-sm mt-8">
            By continuing, you agree to our{" "}
            <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
