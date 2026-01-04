import { ForgotPasswordForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "../AuthPageLayout";
import { KeyRound } from "lucide-react";

export function RequestPasswordResetPage() {
  return (
    <AuthPageLayout
      title="Reset your password"
      subtitle="Enter your email to receive a reset link"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <KeyRound className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      <ForgotPasswordForm />

      <div className="mt-6 text-center">
        <p className="text-zinc-400 text-sm">
          Remember your password?{" "}
          <WaspRouterLink
            to={routes.LoginRoute.to}
            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Back to sign in
          </WaspRouterLink>
        </p>
      </div>
    </AuthPageLayout>
  );
}
