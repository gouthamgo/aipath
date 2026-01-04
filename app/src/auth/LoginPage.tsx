import { LoginForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "./AuthPageLayout";

export default function Login() {
  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning journey"
    >
      <LoginForm />

      <div className="mt-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-zinc-500">or</span>
          </div>
        </div>

        <div className="space-y-3 text-center">
          <p className="text-zinc-400 text-sm">
            Don't have an account?{" "}
            <WaspRouterLink
              to={routes.SignupRoute.to}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign up for free
            </WaspRouterLink>
          </p>
          <p className="text-zinc-500 text-sm">
            Forgot your password?{" "}
            <WaspRouterLink
              to={routes.RequestPasswordResetRoute.to}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Reset it
            </WaspRouterLink>
          </p>
        </div>
      </div>
    </AuthPageLayout>
  );
}
