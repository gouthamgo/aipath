import { Link } from "wasp/client/router";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="text-violet-400 hover:text-violet-300 mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account,
              make a purchase, or contact us for support.
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>Account information (email, name)</li>
              <li>Payment information (processed securely via Stripe)</li>
              <li>Usage data (lessons completed, code submissions)</li>
              <li>API keys you provide (stored encrypted)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>To provide and maintain our service</li>
              <li>To process payments and send related information</li>
              <li>To send you technical notices and support messages</li>
              <li>To track your learning progress</li>
              <li>To improve our curriculum and platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties.
              We may share information with trusted service providers who assist us in operating our
              platform (e.g., payment processing, email delivery).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information.
              API keys are encrypted at rest. Payment information is handled by Stripe and never
              stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
            <p>
              We use cookies to maintain your session and preferences. You can control cookies
              through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@aipath.dev" className="text-violet-400 hover:text-violet-300">
                privacy@aipath.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
