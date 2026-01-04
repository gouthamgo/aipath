import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Section, SectionHeader, Card, CheckItem } from "./shared";
import { getTotalLessons, getTotalProjects } from "../../learning/data/curriculum";

const totalLessons = getTotalLessons();
const totalProjects = getTotalProjects();

const plans = [
  {
    name: "Free",
    description: "Start your AI journey",
    price: "$0",
    period: "forever",
    color: "emerald",
    featured: false,
    features: [
      "Phase 1: Foundations (17 lessons)",
      "Real Python execution",
      "Progress tracking",
      "Community Discord access",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    description: "Full AI Engineering curriculum",
    price: "$19",
    period: "/month",
    color: "violet",
    featured: true,
    features: [
      `All ${totalLessons} lessons unlocked`,
      `All ${totalProjects} projects`,
      "API key storage for AI lessons",
      "Priority Discord support",
      "Completion certificates",
      "Interview prep content",
    ],
    cta: "Start Pro Trial",
  },
  {
    name: "Lifetime",
    description: "One-time payment, forever access",
    price: "$299",
    period: "one-time",
    color: "cyan",
    featured: false,
    features: [
      "Everything in Pro",
      "Lifetime access",
      "All future updates",
      "Priority support forever",
      "Early access to new content",
      "Private community channel",
    ],
    cta: "Get Lifetime Access",
  },
];

const colorStyles: Record<string, { border: string; button: string; check: "violet" | "cyan" | "amber" | "emerald" }> = {
  emerald: {
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
    check: "emerald",
  },
  violet: {
    border: "border-violet-500/50 hover:border-violet-500",
    button: "btn-primary",
    check: "violet",
  },
  cyan: {
    border: "border-cyan-500/30 hover:border-cyan-500/50",
    button: "bg-cyan-600 hover:bg-cyan-500 text-white",
    check: "cyan",
  },
};

export default function Pricing() {
  return (
    <Section id="pricing" size="lg">
      <SectionHeader
        badge="Simple Pricing"
        badgeColor="violet"
        title={
          <>
            Invest in your <span className="text-gradient">AI career</span>
          </>
        }
        subtitle="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
      />

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan, i) => {
          const styles = colorStyles[plan.color];
          return (
            <Card
              key={i}
              className={`p-6 sm:p-8 ${styles.border} ${plan.featured ? "lg:scale-105 ring-1 ring-violet-500/50" : ""}`}
              highlight={plan.featured}
              hover={false}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-pro px-4 py-1">Most Popular</span>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {plan.name}
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
                <p className="text-zinc-400 text-sm mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <CheckItem key={j} color={styles.check}>
                    {feature}
                  </CheckItem>
                ))}
              </ul>

              {/* CTA */}
              <WaspRouterLink
                to={routes.SignupRoute.to}
                className={`w-full py-4 rounded-xl text-base font-semibold inline-flex items-center justify-center gap-2 transition-all ${styles.button}`}
              >
                {plan.cta}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </WaspRouterLink>
            </Card>
          );
        })}
      </div>

      {/* Guarantee */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm">
            <span className="font-semibold text-white">30-day money-back guarantee.</span>
            <span className="text-zinc-400"> Not satisfied? Full refund, no questions.</span>
          </span>
        </div>
      </div>
    </Section>
  );
}
