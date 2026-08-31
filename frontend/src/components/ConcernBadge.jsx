const LEVELS = {
  low:         { label: '🟢 Low Concern',         className: 'bg-green-50 text-green-700 border border-green-200' },
  moderate:    { label: '🟡 Moderate Concern',     className: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  high:        { label: '🟠 High Concern',         className: 'bg-orange-50 text-orange-700 border border-orange-200' },
  significant: { label: '🔴 Significant Concern',  className: 'bg-red-50 text-red-700 border border-red-200' },
};

export default function ConcernBadge({ level = 'low', size = 'sm' }) {
  const { label, className } = LEVELS[level] || LEVELS.low;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${size === 'sm' ? 'text-xs' : 'text-sm px-3 py-1'} ${className}`}>
      {label}
    </span>
  );
}
