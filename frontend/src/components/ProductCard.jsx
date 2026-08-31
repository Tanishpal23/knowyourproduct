import { useState } from 'react';
import { Link } from 'react-router-dom';

const SCORE_COLORS = {
  low:         'text-green-700 bg-green-50 border-green-100',
  moderate:    'text-amber-700 bg-amber-50 border-amber-100',
  high:        'text-orange-700 bg-orange-50 border-orange-100',
  significant: 'text-red-700 bg-red-50 border-red-100',
};

const CATEGORY_EMOJI = {
  'Beverages':          '🥤',
  'Snacks & Cookies':   '🍪',
  'Snacks & Chips':     '🍟',
  'Instant Noodles':    '🍜',
  'Juices & Beverages': '🧃',
  'Breakfast & Grains': '🥣',
};

function getScoreLevel(score) {
  if (score <= 3)   return 'low';
  if (score <= 5.5) return 'moderate';
  if (score <= 7.5) return 'high';
  return 'significant';
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="h-40 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 shimmer rounded-full" />
        <div className="h-4 w-4/5 shimmer rounded-full" />
        <div className="h-3 w-1/2 shimmer rounded-full" />
        <div className="h-7 w-24 shimmer rounded-full mt-2" />
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { _id, productName, brand, category, image, concernScore, allergens = [] } = product;
  const level = getScoreLevel(concernScore || 0);
  const [imgFailed, setImgFailed] = useState(false);
  const emoji = CATEGORY_EMOJI[category] || '🛍️';

  return (
    <Link
      to={`/product/${_id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden card-hover h-full"
    >
      <div className="h-44 bg-gradient-to-br from-slate-50 to-indigo-50/40 flex items-center justify-center overflow-hidden">
        {image && !imgFailed ? (
          <img
            src={image}
            alt={productName}
            className="h-32 w-auto max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="text-6xl select-none" aria-hidden="true">{emoji}</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold text-indigo-600 mb-1.5 uppercase tracking-wide">{category}</p>
        <h3 className="font-bold text-slate-800 text-[15px] sm:text-base leading-snug mb-1 line-clamp-2 group-hover:text-indigo-700 transition-colors duration-200">
          {productName}
        </h3>
        <p className="text-sm text-slate-500 mb-4">{brand}</p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${SCORE_COLORS[level]}`}>
            <span aria-hidden="true">⚡</span>
            <span>{concernScore?.toFixed(1) || '?'}/10</span>
          </div>
          {allergens.length > 0 && (
            <span className="text-xs text-slate-400 truncate max-w-[45%]">
              {allergens.slice(0, 2).join(', ')}{allergens.length > 2 ? '…' : ''}
            </span>
          )}
        </div>
        <span className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200">
          View product →
        </span>
      </div>
    </Link>
  );
}
