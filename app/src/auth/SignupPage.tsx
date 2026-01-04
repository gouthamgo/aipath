import { SignupForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "./AuthPageLayout";
import { Check } from "lucide-react";

export function Signup() {
  return (
    <AuthPageLayout
      title="Start learning for free"
      subtitle="Create your account and begin your AI journey"
    >
      {/* Benefits */}
      <div className="mb-6 space-y-2">
        {[
          "Access to Phase 1: Foundations (22 lessons)",
          "Real Python code execution",
          "Track your progress",
        ].map((benefit, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <SignupForm />

      <div className="mt-6 text-center">
        <p className="text-zinc-400 text-sm">
          Already have an account?{" "}
          <WaspRouterLink
            to={routes.LoginRoute.to}
            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Sign in
          </WaspRouterLink>
        </p>
      </div>
    </AuthPageLayout>
  );
}
