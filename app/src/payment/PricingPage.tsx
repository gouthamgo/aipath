import { Check, Crown, Zap, Sparkles, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import {
  generateCheckoutSession,
  getCustomerPortalUrl,
  useQuery,
} from "wasp/client/operations";
import { cn } from "../client/utils";
import {
  PaymentPlanId,
  paymentPlans,
  prettyPaymentPlanName,
  SubscriptionStatus,
} from "./plans";

const bestDealPaymentPlanId: PaymentPlanId = PaymentPlanId.Pro;

interface PaymentPlanCard {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: "emerald" | "violet" | "cyan";
}

export const paymentPlanCards: Record<PaymentPlanId, PaymentPlanCard> = {
  [PaymentPlanId.Hobby]: {
    name: "Starter",
    price: "$9.99",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "Access to Phase 1 & 2",
      "Basic projects",
      "Community support",
      "Progress tracking",
    ],
    icon: <Zap className="w-6 h-6" />,
    color: "emerald",
  },
  [PaymentPlanId.Pro]: {
    name: "Pro",
    price: "$19.99",
    period: "/month",
    description: "Full AI Engineering curriculum",
    features: [
      "All 85+ lessons unlocked",
      "All 17 projects",
      "API key storage",
      "Priority support",
      "Completion certificates",
      "Interview prep content",
    ],
    icon: <Crown className="w-6 h-6" />,
    color: "violet",
  },
  [PaymentPlanId.Credits10]: {
    name: "Credits Pack",
    price: "$9.99",
    period: "one-time",
    description: "10 credits for AI features",
    features: [
      "10 API credits",
      "Use for AI lessons",
      "No expiration",
      "Works with any plan",
    ],
    icon: <Sparkles className="w-6 h-6" />,
    color: "cyan",
  },
};

const colorStyles = {
  emerald: {
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
    check: "text-emerald-400",
  },
  violet: {
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    button: "btn-primary",
    check: "text-violet-400",
  },
  cyan: {
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    button: "bg-cyan-600 hover:bg-cyan-500 text-white",
    check: "text-cyan-400",
  },
};

const PricingPage = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: user } = useAuth();
  const isUserSubscribed =
    !!user &&
    !!user.subscriptionStatus &&
    user.subscriptionStatus !== SubscriptionStatus.Deleted;

  const {
    data: customerPortalUrl,
    isLoading: isCustomerPortalUrlLoading,
    error: customerPortalUrlError,
  } = useQuery(getCustomerPortalUrl, { enabled: isUserSubscribed });

  const navigate = useNavigate();

  async function handleBuyNowClick(paymentPlanId: PaymentPlanId) {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setIsPaymentLoading(true);

      const checkoutResults = await generateCheckoutSession(paymentPlanId);

      if (checkoutResults?.sessionUrl) {
        window.open(checkoutResults.sessionUrl, "_self");
      } else {
        throw new Error("Error generating checkout session URL");
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Error processing payment. Please try again later.");
      }
      setIsPaymentLoading(false);
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (customerPortalUrlError) {
      setErrorMessage("Error fetching Customer Portal URL");
      return;
    }

    if (!customerPortalUrl) {
      setErrorMessage(`Customer Portal does not exist for user ${user.id}`);
      return;
    }

    window.open(customerPortalUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Simple Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Invest in your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400">
                AI career
              </span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {Object.values(PaymentPlanId).map((planId) => {
              const plan = paymentPlanCards[planId];
              const styles = colorStyles[plan.color];
              const isFeatured = planId === bestDealPaymentPlanId;

              return (
                <div
                  key={planId}
                  className={cn(
                    "relative glass-card rounded-2xl p-6 sm:p-8 transition-all duration-300",
                    isFeatured
                      ? "border-violet-500/50 lg:scale-105 ring-1 ring-violet-500/50"
                      : "hover:border-white/10"
                  )}
                >
                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="badge-pro px-4 py-1">Most Popular</span>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl border flex items-center justify-center mb-6",
                      styles.iconBg
                    )}
                  >
                    <span className={styles.iconColor}>{plan.icon}</span>
                  </div>

                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-zinc-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl sm:text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-zinc-500">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check
                          className={cn("w-5 h-5 flex-shrink-0 mt-0.5", styles.check)}
                        />
                        <span className="text-zinc-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {isUserSubscribed ? (
                    <button
                      onClick={handleCustomerPortalClick}
                      disabled={isCustomerPortalUrlLoading}
                      className={cn(
                        "w-full py-4 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2",
                        styles.button
                      )}
                    >
                      Manage Subscription
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyNowClick(planId)}
                      disabled={isPaymentLoading}
                      className={cn(
                        "w-full py-4 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2",
                        styles.button
                      )}
                    >
                      {user ? "Get Started" : "Log in to purchase"}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">
                <span className="font-semibold text-white">
                  30-day money-back guarantee.
                </span>
                <span className="text-zinc-400">
                  {" "}
                  Not satisfied? Full refund, no questions.
                </span>
              </span>
            </div>
          </div>

          {/* Test Card Info */}
          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              Test with card:{" "}
              <code className="bg-white/5 px-2 py-1 rounded text-zinc-400 font-mono text-xs">
                4242 4242 4242 4242
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
