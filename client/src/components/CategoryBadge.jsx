import React from 'react';
import { Leaf, Recycle, AlertTriangle, Cpu, Heart, Package } from 'lucide-react';
import { getCategoryConfig } from '../utils/categoryConfig';

const ICONS = {
  ORGANIC: Leaf,
  RECYCLABLE: Recycle,
  HAZARDOUS: AlertTriangle,
  'E-WASTE': Cpu,
  SANITARY: Heart,
  RESIDUAL: Package
};

export default function CategoryBadge({ category, size = 'md' }) {
  const config = getCategoryConfig(category);
  const Icon = ICONS[category] || Package;

  const sizes = {
    sm: { badge: 'px-2 py-1 text-xs gap-1', icon: 12 },
    md: { badge: 'px-3 py-1.5 text-sm gap-1.5', icon: 14 },
    lg: { badge: 'px-4 py-2 text-base gap-2', icon: 18 }
  };

  const s = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${config.badge} text-white ${s.badge}`}
    >
      <Icon size={s.icon} />
      {config.label}
    </span>
  );
}
