import { useEffect, useRef, useState } from 'react';

const CONCERN_COLORS = {
  low:         { stroke: '#22c55e', bg: '#f0fdf4', text: '#16a34a' },
  moderate:    { stroke: '#eab308', bg: '#fefce8', text: '#ca8a04' },
  high:        { stroke: '#f97316', bg: '#fff7ed', text: '#ea580c' },
  significant: { stroke: '#ef4444', bg: '#fef2f2', text: '#dc2626' },
};

const CONCERN_LABELS = {
  low: 'Low Concern', moderate: 'Moderate', high: 'High Concern', significant: 'Significant',
};

function getLevel(score) {
  if (score <= 3)  return 'low';
  if (score <= 5.5) return 'moderate';
  if (score <= 7.5) return 'high';
  return 'significant';
}

export default function ScoreCircle({ score = 0, size = 180 }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  const level = getLevel(score);
  const colors = CONCERN_COLORS[level];
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 10) * circumference;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full opacity-20 blur-xl" style={{ backgroundColor: colors.stroke }} />
        <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-lg">
          {/* Track */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          {/* Score arc */}
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={colors.stroke} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? targetOffset : circumference}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
          {/* Score text */}
          <text x="50" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="800" fill={colors.text}>
            {score.toFixed(1)}
          </text>
          <text x="50" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#94a3b8">
            out of 10
          </text>
        </svg>
      </div>
      {/* Label pill */}
      <div className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: colors.bg, color: colors.text }}>
        {CONCERN_LABELS[level].toUpperCase()}
      </div>
    </div>
  );
}
