import { Link } from "wasp/client/router";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="text-violet-400 hover:text-violet-300 mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AI Path, you accept and agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p>
              AI Path is an educational platform that provides interactive lessons, coding exercises,
              and projects for learning AI engineering. We provide access to learning content,
              a code execution environment, and progress tracking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must not share your account with others</li>
              <li>You must be at least 13 years old to use this service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Submit malicious code or attempt to exploit our code execution environment</li>
              <li>Share or redistribute course content without permission</li>
              <li>Use the service to train competing AI products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Payment and Refunds</h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>Paid plans are billed according to the plan you select</li>
              <li>We offer a 30-day money-back guarantee for Pro and Lifetime plans</li>
              <li>Refund requests should be sent to support@aipath.dev</li>
              <li>Prices may change with notice to existing subscribers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
            <p>
              All content on AI Path, including lessons, code examples, and projects, is owned by
              AI Path or its licensors. You may not reproduce, distribute, or create derivative
              works without our permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. API Keys</h2>
            <p>
              If you provide your own API keys (OpenAI, Anthropic, etc.), you are responsible for
              any charges incurred through their use. We store your keys securely but recommend
              using keys with appropriate usage limits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without warranties of any kind. We do not guarantee
              that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <p>
              AI Path shall not be liable for any indirect, incidental, special, or consequential
              damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. We will notify you of significant changes
              via email or through the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@aipath.dev" className="text-violet-400 hover:text-violet-300">
                legal@aipath.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
