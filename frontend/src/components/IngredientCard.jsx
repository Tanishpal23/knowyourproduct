import { useState } from 'react';
import ConcernBadge from './ConcernBadge';

export default function IngredientCard({ ingredient }) {
  const [expanded, setExpanded] = useState(false);
  const { name, concernLevel = 'low', simpleExplanation, purpose, evidenceSummary, regulatoryNotes, foundIn = [], evidenceLevel } = ingredient;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-indigo-100">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-3 group min-h-14"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-slate-800 text-sm">{name}</span>
            <ConcernBadge level={concernLevel} />
          </div>
          {!expanded && simpleExplanation && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{simpleExplanation}</p>
          )}
        </div>
        <div className={`text-slate-400 transition-transform mt-0.5 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-3 border-t border-slate-100 pt-4 fade-in">
          {simpleExplanation && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">What is it?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{simpleExplanation}</p>
            </div>
          )}
          {purpose && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Why is it used?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{purpose}</p>
            </div>
          )}
          {evidenceSummary && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Why should I care?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{evidenceSummary}</p>
            </div>
          )}
          {regulatoryNotes && (
            <div className="bg-slate-50 rounded-lg p-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Regulatory Status</h4>
              <p className="text-xs text-slate-600">{regulatoryNotes}</p>
            </div>
          )}
          {evidenceLevel && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Evidence strength:</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                evidenceLevel === 'high' ? 'bg-green-100 text-green-700' :
                evidenceLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-600'
              }`}>{evidenceLevel.charAt(0).toUpperCase() + evidenceLevel.slice(1)}</span>
            </div>
          )}
          {foundIn.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Also found in</h4>
              <div className="flex flex-wrap gap-1">
                {foundIn.map(item => (
                  <span key={item} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
