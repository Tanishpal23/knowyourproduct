import { useRef, useEffect, useState } from 'react';

const NUTRIENT_LIMITS = {
  calories: { max: 2000, unit: 'kcal', label: 'Calories', color: 'bg-violet-500' },
  totalFat: { max: 78, unit: 'g', label: 'Total Fat', color: 'bg-yellow-500' },
  saturatedFat: { max: 20, unit: 'g', label: 'Saturated Fat', color: 'bg-orange-500' },
  transFat: { max: 2, unit: 'g', label: 'Trans Fat', color: 'bg-red-500' },
  carbohydrates: { max: 275, unit: 'g', label: 'Carbohydrates', color: 'bg-blue-500' },
  totalSugar: { max: 50, unit: 'g', label: 'Total Sugar', color: 'bg-pink-500' },
  addedSugar: { max: 50, unit: 'g', label: 'Added Sugar', color: 'bg-red-400' },
  protein: { max: 50, unit: 'g', label: 'Protein', color: 'bg-green-500' },
  fiber: { max: 28, unit: 'g', label: 'Fiber', color: 'bg-teal-500' },
  sodium: { max: 2300, unit: 'mg', label: 'Sodium', color: 'bg-amber-500' },
};

export default function NutritionBar({ nutrient, value }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  const config = NUTRIENT_LIMITS[nutrient] || { max: 100, unit: 'g', label: nutrient, color: 'bg-slate-400' };
  const pct = Math.min((value / config.max) * 100, 100);

  // Concern coloring for high values
  const isHighConcern = (nutrient === 'addedSugar' && value > 12) || (nutrient === 'sodium' && value > 600) ||
    (nutrient === 'saturatedFat' && value > 7) || (nutrient === 'transFat' && value > 0.5);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setWidth(pct); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);

  if (value === undefined || value === null) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className={`font-medium ${isHighConcern ? 'text-orange-600' : 'text-slate-700'}`}>
          {config.label}{isHighConcern ? ' ⚠' : ''}
        </span>
        <span className={`text-sm font-semibold ${isHighConcern ? 'text-orange-600' : 'text-slate-600'}`}>
          {value}{config.unit}
        </span>
      </div>
      <div ref={ref} className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${isHighConcern ? 'bg-orange-400' : config.color}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">{pct.toFixed(0)}% of daily reference value</p>
    </div>
  );
}
