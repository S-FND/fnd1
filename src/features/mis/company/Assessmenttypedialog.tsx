import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// URL param: ?dialog=assessment  → opens the dialog
// Closing the dialog removes the param from the URL

interface Card {
  id: "mis" | "escap";
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  selectedBorder: string;
  selectedBg: string;
}

const cards: Card[] = [
  {
    id: "mis",
    label: "MIS",
    title: "Management Information System",
    description:
      "Track internal ESG metrics and performance indicators across your organization.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 17h7M17.5 14v7" />
      </svg>
    ),
    iconBg: "bg-green-50",
    iconColor: "text-green-800",
    badgeBg: "bg-green-50 text-green-900",
    selectedBorder: "border-green-700",
    selectedBg: "bg-green-50",
  },
  {
    id: "escap",
    label: "ESCAP",
    title: "ESG Corrective Action Plan",
    description:
      "Document and manage remediation actions identified from due diligence assessments.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 11 17 15 13" />
      </svg>
    ),
    iconBg: "bg-blue-50",
    iconColor: "text-blue-800",
    badgeBg: "bg-blue-50 text-blue-900",
    selectedBorder: "border-blue-600",
    selectedBg: "bg-blue-50",
  },
];

export default function AssessmentTypeDialog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<"mis" | "escap" | null>(null);
  const navigate = useNavigate();

  // Dialog is open when URL has ?dialog=assessment
  const isOpen = searchParams.get("dialog") === "assessment";

  // Sync selected type from URL param if present: ?dialog=assessment&type=mis
  useEffect(() => {
    const typeParam = searchParams.get("type") as "mis" | "escap" | null;
    if (typeParam && (typeParam === "mis" || typeParam === "escap")) {
      setSelected(typeParam);
    }
  }, []);

  const handleClose = (): void => {
    setSelected(null);
    setSearchParams((prev) => {
      prev.delete("dialog");
      prev.delete("type");
      return prev;
    });
  };

  const handleProceed = (): void => {
    if (!selected) return;
    // Add selected type to URL before proceeding
    setSearchParams((prev) => {
      prev.set("type", selected);
      prev.delete("dialog");
      return prev;
    });
    // TODO: add your navigation / action logic here
    console.log("Proceeding with:", selected);
    navigate(selected === "mis" ? "/mis/dashboard" : "/esg-dd/cap");
  };

  const handleCardSelect = (id: "mis" | "escap"): void => {
    setSelected(id);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35"
    >
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg mx-4 p-7"

      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-1">
              ESG Due Diligence
            </p>
            <h2 className="text-[18px] font-semibold text-gray-900 mb-1">
              Select assessment type
            </h2>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Choose the framework you'd like to proceed with for this assessment.
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 ml-4 mt-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {cards.map((card: Card) => {
            const isSelected = selected === card.id;
            return (
              <div
                key={card.id}
                onClick={() => handleCardSelect(card.id)}
                className={`
                  cursor-pointer rounded-xl border-[1.5px] p-4 transition-all duration-150 select-none
                  ${
                    isSelected
                      ? `${card.selectedBorder} ${card.selectedBg}`
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.iconBg} ${card.iconColor}`}>
                  {card.icon}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[15px] font-semibold text-gray-900">
                    {card.label}
                  </span>
                  {isSelected && (
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                      Selected
                    </span>
                  )}
                </div>

                <p className="text-[12px] font-medium text-gray-700 mb-1">
                  {card.title}
                </p>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-5 flex items-center justify-end gap-2.5">
          <button
            onClick={handleClose}
            className="text-[13px] font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            disabled={!selected}
            className={`
              text-[13px] font-semibold px-5 py-2 rounded-lg text-white bg-[#1a6b3a] transition-opacity
              ${selected ? "opacity-100 cursor-pointer hover:bg-[#155930]" : "opacity-40 cursor-not-allowed"}
            `}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------
// 1. Render once anywhere in your route tree (no props needed):
//      <AssessmentTypeDialog />
//
// 2. Open the dialog by setting the URL param:
//      navigate("?dialog=assessment")
//      // or
//      setSearchParams({ dialog: "assessment" })
//
// 3. Optionally pre-select a type via URL:
//      navigate("?dialog=assessment&type=mis")
//
// 4. On Proceed, ?type=mis or ?type=escap is set in the URL.
//    Add your navigation/action logic inside handleProceed().
// ---------------------------------------------------------------------------