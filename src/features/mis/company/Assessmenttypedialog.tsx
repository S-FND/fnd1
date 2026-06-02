import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Card {
  id: "mis" | "escap";
  label: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  hoverBorder: string;
  selectedBorder: string;
  selectedBg: string;
  buttonColor: string;
  buttonHover: string;
}

const cards: Card[] = [
  {
    id: "mis",
    label: "MIS",
    title: "Management Information System",
    description: "Track internal ESG metrics and performance indicators across your organization.",
    features: ["KPI Tracking", "Progress Reports", "Quarterly Data Entry", "Performance Analytics"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 17h7M17.5 14v7" />
      </svg>
    ),
    accentColor: "text-emerald-700",
    accentBg: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    selectedBorder: "border-emerald-600",
    selectedBg: "bg-emerald-50/80",
    buttonColor: "bg-emerald-700",
    buttonHover: "hover:bg-emerald-800",
  },
  {
    id: "escap",
    label: "ESCAP",
    title: "ESG Corrective Action Plan",
    description: "Document and manage remediation actions identified from due diligence assessments.",
    features: ["CAP Tracking", "Condition Precedent", "Condition Subsequent", "ESG Roadmap"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 11 17 15 13" />
      </svg>
    ),
    accentColor: "text-blue-700",
    accentBg: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    selectedBorder: "border-blue-600",
    selectedBg: "bg-blue-50/80",
    buttonColor: "bg-blue-700",
    buttonHover: "hover:bg-blue-800",
  },
];

export type AssessmentType = "mis" | "escap" | null;

export function useAssessmentType(): AssessmentType {
  const [searchParams] = useSearchParams();
  return searchParams.get("type") as AssessmentType;
}

export default function AssessmentTypeDialog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<"mis" | "escap" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const isOpen = searchParams.get("dialog") === "assessment";

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const typeParam = searchParams.get("type") as "mis" | "escap" | null;
      if (typeParam && (typeParam === "mis" || typeParam === "escap")) {
        setSelected(typeParam);
      } else {
        setSelected(null);
      }
    }
  }, [isOpen, searchParams]);

  // Disable right-click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // ← REMOVE: handleClose — no cancel allowed
  // Only proceed with selection

  const handleProceed = (): void => {
    if (!selected) return;
    const basePath = selected === "mis" ? "/mis/dashboard" : "/esg-dd/cap";
    navigate(`${basePath}?type=${selected}`);
  };

  const handleCardSelect = (id: "mis" | "escap"): void => {
    setSelected(id);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-[100] flex flex-col items-center justify-center
        bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100
        transition-all duration-300 ease-out
        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}
      onContextMenu={handleContextMenu}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      {/* ← REMOVE: Close button (X) — user must select */}

      {/* Header */}
      <div className="relative z-10 text-center mb-5 px-4">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">
          ESG Due Diligence
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {searchParams.get("type") ? "Switch Module" : "Select Your Module"}
        </h1>
      </div>

      {/* Cards */}
      <div className="relative z-10 grid md:grid-cols-2 gap-6 max-w-4xl w-full px-6 select-none">
        {cards.map((card) => {
          const isSelected = selected === card.id;
          return (
            <div
              key={card.id}
              onClick={() => handleCardSelect(card.id)}
              onContextMenu={handleContextMenu}
              className={`
                relative group cursor-pointer rounded-2xl border-2 p-8
                transition-all duration-200 ease-out select-none
                ${isSelected 
                  ? `${card.selectedBorder} ${card.selectedBg} shadow-lg scale-[1.02] ring-2 ring-offset-2 ring-${card.id === 'mis' ? 'emerald' : 'blue'}-400` 
                  : `bg-white ${card.borderColor} ${card.hoverBorder} hover:shadow-md hover:scale-[1.01]`
                }
              `}
              style={{ userSelect: 'none' }}
            >
              {isSelected && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${card.buttonColor}`}>
                  Selected
                </div>
              )}

              <div className={`
                w-16 h-16 rounded-xl flex items-center justify-center mb-6
                ${card.accentBg} ${card.accentColor}
                transition-transform duration-200 group-hover:scale-110
              `}>
                {card.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.label}</h3>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {card.description}
              </p>

              <ul className="space-y-3">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className={`w-5 h-5 ${card.accentColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {!isSelected && (
                <p className="mt-6 text-xs text-center text-gray-400 font-medium">
                  Click to select
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer — Only Continue button, no Cancel */}
      <div className="relative z-10 mt-10">
        <button
          onClick={handleProceed}
          disabled={!selected}
          className={`
            px-10 py-4 rounded-xl text-base font-bold text-white transition-all
            ${selected 
              ? `${cards.find(c => c.id === selected)?.buttonColor} ${cards.find(c => c.id === selected)?.buttonHover} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5` 
              : 'bg-gray-300 cursor-not-allowed opacity-60'
            }
          `}
        >
          {!selected ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Select a module to continue
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue with {selected.toUpperCase()}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          )}
        </button>
      </div>

      <p className="relative z-10 mt-6 text-xs text-gray-400">
        You can change this anytime from the module selector in the header
      </p>
    </div>
  );
}