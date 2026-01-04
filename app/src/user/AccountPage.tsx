import { useState } from "react";
import {
  getCustomerPortalUrl,
  useQuery,
  exportUserData,
  deleteUserAccount,
} from "wasp/client/operations";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { logout } from "wasp/client/auth";
import type { User } from "wasp/entities";
import {
  User as UserIcon,
  Mail,
  CreditCard,
  Zap,
  Crown,
  ChevronRight,
  Settings,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import {
  PaymentPlanId,
  SubscriptionStatus,
  parsePaymentPlanId,
  prettyPaymentPlanName,
} from "../payment/plans";

export default function AccountPage({ user }: { user: User }) {
  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-zinc-400">Manage your account and subscription</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.username || user.email?.split("@")[0] || "User"}
              </h2>
              <p className="text-zinc-400 text-sm">{user.email}</p>
            </div>
            <div className="ml-auto">
              <SubscriptionBadge
                subscriptionPlan={user.subscriptionPlan}
                subscriptionStatus={user.subscriptionStatus}
              />
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Info */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Account Info</h3>
            </div>

            <div className="space-y-4">
              <InfoRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={user.email || "Not set"}
              />
              {user.username && (
                <InfoRow
                  icon={<UserIcon className="w-4 h-4" />}
                  label="Username"
                  value={user.username}
                />
              )}
            </div>
          </div>

          {/* Subscription */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Subscription</h3>
            </div>

            <UserCurrentSubscriptionPlan
              subscriptionPlan={user.subscriptionPlan}
              subscriptionStatus={user.subscriptionStatus}
              datePaid={user.datePaid}
            />
          </div>

          {/* Credits */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Credits</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">{user.credits}</div>
                <p className="text-zinc-400 text-sm">Available credits</p>
              </div>
              <BuyMoreButton subscriptionStatus={user.subscriptionStatus} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <ActionLink
                icon={<CreditCard className="w-4 h-4" />}
                label="Manage Payment"
                subscriptionStatus={user.subscriptionStatus}
              />
              <WaspRouterLink
                to={routes.PricingPageRoute.to}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                  <span className="text-zinc-300 group-hover:text-white transition-colors">
                    Upgrade Plan
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </WaspRouterLink>
            </div>
          </div>
        </div>

        {/* Privacy & Data Section */}
        <PrivacyDataSection />
      </div>
    </div>
  );
}

function PrivacyDataSection() {
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const data = await exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aipath-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm');
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await deleteUserAccount({ confirmationText: deleteConfirmText });
      await logout();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-6 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Privacy & Data</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              {isExporting ? (
                <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition-colors" />
              )}
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                {isExporting ? "Exporting..." : "Export My Data"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-zinc-400 group-hover:text-red-400 transition-colors" />
              <span className="text-zinc-300 group-hover:text-red-400 transition-colors">
                Delete Account
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete Account</h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                  setError(null);
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-zinc-400 text-sm mb-4">
                This action is <span className="text-red-400 font-semibold">permanent and irreversible</span>.
                All your data including progress, code submissions, and files will be deleted.
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                Type <span className="text-white font-mono bg-zinc-800 px-2 py-0.5 rounded">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                  setError(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-white text-sm">{value}</span>
    </div>
  );
}

function SubscriptionBadge({
  subscriptionPlan,
  subscriptionStatus,
}: Pick<User, "subscriptionPlan" | "subscriptionStatus">) {
  if (!subscriptionPlan || subscriptionStatus !== SubscriptionStatus.Active) {
    return (
      <span className="badge-free">Free</span>
    );
  }

  return (
    <span className="badge-pro">
      {prettyPaymentPlanName(parsePaymentPlanId(subscriptionPlan))}
    </span>
  );
}

function UserCurrentSubscriptionPlan({
  subscriptionPlan,
  subscriptionStatus,
  datePaid,
}: Pick<User, "subscriptionPlan" | "subscriptionStatus" | "datePaid">) {
  if (!subscriptionPlan || !subscriptionStatus || !datePaid) {
    return (
      <div>
        <div className="text-white font-medium mb-1">Free Plan</div>
        <p className="text-zinc-400 text-sm mb-4">
          Upgrade to unlock all 85+ lessons and 17 projects.
        </p>
        <WaspRouterLink
          to={routes.PricingPageRoute.to}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </WaspRouterLink>
      </div>
    );
  }

  const statusMessage = formatSubscriptionStatusMessage(
    parsePaymentPlanId(subscriptionPlan),
    datePaid,
    subscriptionStatus as SubscriptionStatus
  );

  return (
    <div>
      <div className="text-white font-medium mb-1">
        {prettyPaymentPlanName(parsePaymentPlanId(subscriptionPlan))}
      </div>
      <p className="text-zinc-400 text-sm mb-4">{statusMessage}</p>
      <CustomerPortalButton />
    </div>
  );
}

function formatSubscriptionStatusMessage(
  subscriptionPlan: PaymentPlanId,
  datePaid: Date,
  subscriptionStatus: SubscriptionStatus
): string {
  const statusToMessage: Record<SubscriptionStatus, string> = {
    active: "Your subscription is active",
    past_due: "Payment past due. Please update your payment info.",
    cancel_at_period_end: `Active until ${prettyPrintEndOfBillingPeriod(datePaid)}`,
    deleted: "Subscription canceled",
  };

  return statusToMessage[subscriptionStatus] || "Unknown status";
}

function prettyPrintEndOfBillingPeriod(date: Date) {
  const oneMonthFromNow = new Date(date);
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  return oneMonthFromNow.toLocaleDateString();
}

function CustomerPortalButton() {
  const { data: customerPortalUrl, isLoading } = useQuery(getCustomerPortalUrl);

  if (!customerPortalUrl) {
    return null;
  }

  return (
    <a
      href={customerPortalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
    >
      <CreditCard className="w-4 h-4" />
      {isLoading ? "Loading..." : "Manage Subscription"}
    </a>
  );
}

function ActionLink({
  icon,
  label,
  subscriptionStatus,
}: {
  icon: React.ReactNode;
  label: string;
  subscriptionStatus: User["subscriptionStatus"];
}) {
  const { data: customerPortalUrl } = useQuery(getCustomerPortalUrl);

  if (!customerPortalUrl) {
    return null;
  }

  return (
    <a
      href={customerPortalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="text-zinc-400 group-hover:text-violet-400 transition-colors">
          {icon}
        </span>
        <span className="text-zinc-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
    </a>
  );
}

function BuyMoreButton({
  subscriptionStatus,
}: Pick<User, "subscriptionStatus">) {
  if (
    subscriptionStatus === SubscriptionStatus.Active ||
    subscriptionStatus === SubscriptionStatus.CancelAtPeriodEnd
  ) {
    return null;
  }

  return (
    <WaspRouterLink
      to={routes.PricingPageRoute.to}
      className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
    >
      <Zap className="w-4 h-4" />
      Get More
    </WaspRouterLink>
  );
}
