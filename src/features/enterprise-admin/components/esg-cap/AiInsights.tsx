import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AiInsightsDialog({ open, onOpenChange, item }: any) {
    // debugger;
  const [expanded, setExpanded] = useState(true);

  const ai = item?.aiInsights;

  const internalDocs =
    ai?.evidence?.filter(
      (e: any) =>
        e.documentSource === "internal" &&
        e.evidenceCategory === "document"
    ) || [];

  const dataEvidence =
    ai?.evidence?.filter(
      (e: any) => e.evidenceCategory === "data"
    ) || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI Insights</DialogTitle>
            </DialogHeader>
    
            {/* 🔹 USER INTENT */}
            <div className="mb-4">
              <h3 className="font-semibold">User Intent</h3>
              <p className="text-sm text-muted-foreground">
                {ai?.userIntent}
              </p>
            </div>
    
            {/* 🔹 ALL EVIDENCE */}
            <div className="mb-4">
              <h3 className="font-semibold">
                Evidence ({ai?.evidence?.length || 0})
              </h3>
    
              <div className="flex flex-wrap gap-2 mt-2">
                {ai?.evidence?.map((e: any, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded bg-gray-100"
                  >
                    {e.type}
                  </span>
                ))}
              </div>
            </div>
    
            {/* 🔥 INTERNAL DOCUMENT SECTIONS (VISIBLE BY DEFAULT) */}
            {internalDocs.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-base">
                  Document Sections ({internalDocs.length})
                </h3>
    
                <div className="space-y-4 mt-3">
                  {internalDocs.map((doc: any, idx: number) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-4 bg-muted/20"
                    >
                      {/* Document Name */}
                      <p className="font-medium mb-3 capitalize">
                        {doc.type.replace(/_/g, " ")}
                      </p>
    
                      {/* Sections Grid */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.keys(doc.template?.structure || {}).map(
                          (section: string, i: number) => (
                            <div
                              key={i}
                              className="px-2 py-1 bg-white border rounded"
                            >
                              {section.replace(/_/g, " ")}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
    
            {/* 🔹 DATA REQUIREMENTS */}
            {dataEvidence.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold">
                  Data Requirements ({dataEvidence.length})
                </h3>
    
                <div className="flex flex-wrap gap-2 mt-2">
                  {dataEvidence.map((e: any, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700"
                    >
                      {e.type}
                    </span>
                  ))}
                </div>
              </div>
            )}
    
            {/* 🔹 SUMMARY */}
            <div className="mt-4">
              <h3 className="font-semibold">Execution Summary</h3>
              <p className="text-sm text-muted-foreground">
                {ai?.executionSummary}
              </p>
            </div>
    
            {/* 🔹 CONFIDENCE */}
            <div className="mt-2 text-xs text-muted-foreground">
              Confidence: {(ai?.confidence * 100).toFixed(0)}%
            </div>
          </DialogContent>
        </Dialog>
      );
}