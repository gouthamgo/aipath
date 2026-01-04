import { memo } from 'react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

export const StatCard = memo(function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-zinc-400">{label}</div>
        </div>
      </div>
    </div>
  );
});
