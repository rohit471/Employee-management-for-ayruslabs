import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, count, icon: Icon, colorClass, bgClass }) => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-slate-700 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{count}</h3>
      </div>
    </div>
  );
};

export default StatCard;