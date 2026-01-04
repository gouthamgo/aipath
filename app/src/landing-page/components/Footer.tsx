import { Container } from "./shared";

interface NavigationItem {
  name: string;
  href: string;
}

export default function Footer({
  footerNavigation,
}: {
  footerNavigation: {
    app: NavigationItem[];
    company: NavigationItem[];
  };
}) {
  return (
    <footer className="relative border-t border-white/5 bg-[#09090b]/80 backdrop-blur-sm">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Brand */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">AI Path</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The hands-on way to learn AI engineering. From Python basics to production AI systems.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-16 lg:gap-20">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Product
                </h3>
                <ul className="space-y-3">
                  {footerNavigation.app.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              {new Date().getFullYear()} AI Path. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
