import { useState } from 'react';
import { Link } from 'react-router-dom';

const SCORE_COLORS = {
  low:         'text-green-600 bg-green-50',
  moderate:    'text-yellow-600 bg-yellow-50',
  high:        'text-orange-600 bg-orange-50',
  significant: 'text-red-600 bg-red-50',
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

export default function ProductCard({ product }) {
  const { _id, productName, brand, category, image, concernScore, allergens = [] } = product;
  const level = getScoreLevel(concernScore || 0);
  const [imgFailed, setImgFailed] = useState(false);
  const emoji = CATEGORY_EMOJI[category] || '🛍️';

  return (
    <Link to={`/product/${_id}`} className="group block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
        {image && !imgFailed ? (
          <img
            src={image}
            alt={productName}
            className="h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="text-6xl select-none">{emoji}</div>
        )}
      </div>
      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-medium text-indigo-500 mb-0.5">{category}</p>
        <h3 className="font-bold text-slate-800 text-sm leading-tight mb-0.5 line-clamp-2 group-hover:text-indigo-700 transition-colors">{productName}</h3>
        <p className="text-xs text-slate-500 mb-3">{brand}</p>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${SCORE_COLORS[level]}`}>
            <span>⚡</span>
            <span>{concernScore?.toFixed(1) || '?'}/10</span>
          </div>
          {allergens.length > 0 && (
            <span className="text-xs text-slate-400">{allergens.slice(0,2).join(', ')}{allergens.length > 2 ? '...' : ''}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
