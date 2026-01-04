import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Zap, TrendingUp, ArrowRight } from 'lucide-react';

interface UpgradeCTAProps {
  title?: string;
  description: string;
  showIcon?: boolean;
}

export const UpgradeCTA = memo(function UpgradeCTA({
  title = 'Unlock Full Access',
  description,
  showIcon = true,
}: UpgradeCTAProps) {
  return (
    <div className="border-t border-zinc-800/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 p-8 lg:p-12 text-center">
          {showIcon && <Zap className="w-12 h-12 text-violet-400 mx-auto mb-4" />}
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-zinc-400 max-w-lg mx-auto mb-6">{description}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            Upgrade to Pro
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
});
