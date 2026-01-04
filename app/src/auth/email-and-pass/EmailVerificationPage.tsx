import { VerifyEmailForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "../AuthPageLayout";
import { Mail } from "lucide-react";

export function EmailVerificationPage() {
  return (
    <AuthPageLayout
      title="Verify your email"
      subtitle="Almost there! Just one more step"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Mail className="w-8 h-8 text-violet-400" />
        </div>
      </div>

      <VerifyEmailForm />

      <div className="mt-6 text-center">
        <p className="text-zinc-400 text-sm">
          Email verified?{" "}
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
