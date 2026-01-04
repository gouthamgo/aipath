import { ResetPasswordForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "../AuthPageLayout";
import { ShieldCheck } from "lucide-react";

export function PasswordResetPage() {
  return (
    <AuthPageLayout
      title="Create new password"
      subtitle="Enter a strong password for your account"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      <ResetPasswordForm />

      <div className="mt-6 text-center">
        <p className="text-zinc-400 text-sm">
          Password reset successful?{" "}
          <WaspRouterLink
            to={routes.LoginRoute.to}
            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Sign in to your account
          </WaspRouterLink>
        </p>
      </div>
    </AuthPageLayout>
  );
}
