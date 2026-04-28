import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { httpClient } from "@/lib/httpClient";
import { downloadPolicyTemplate } from "@/utils/policyTemplateGenerator";

// 🔥 NEW IMPORTS
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AiResponse, ESGCapItem } from "../../types/esgDD";

interface DocumentTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ESGCapItem

}

export function DocumentTemplateModal({
  open,
  onOpenChange,
  item,
}: DocumentTemplateModalProps) {
  const { toast } = useToast();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [aiData, setAiData] = useState<AiResponse>(null)

  const [previewContent, setPreviewContent] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    preparedBy: "",
    place: "",
    officeAddress: "",
  });



  // const aiData = item?.aiResponseRaw;

  // ================= DATA TEMPLATE DOWNLOAD =================
  const downloadDataTemplate = (template: any, type: "excel" | "csv") => {
    const headers = Object.keys(template.structure || {});
    const wsData = [headers];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, template.name);

    if (type === "excel") {
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([buffer], { type: "application/octet-stream" });

      saveAs(blob, `${template.name}.xlsx`);
    } else {
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv" });

      saveAs(blob, `${template.name}.csv`);
    }
  };

  // ================= DOCUMENT DOWNLOAD =================
  const handleDownloadTemplate = async (template: any) => {
    try {
      console.log('template:  :: ', template)
      // await handleRefineWithAI(templa)
      //   setIsDownloading(true);

      //   await downloadPolicyTemplate(template, {
      //     ...formData,
      //   });

      //   toast({
      //     title: "Downloaded",
      //     description: `${template.name} downloaded`,
      //   });
    } catch {
      toast({
        title: "Error",
        description: "Download failed",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // ================= AI REFINE =================
  const handleRefine = async () => {
    setIsRefining(true);
    try {
      const res = await httpClient.post("esgdd/escap/refine-policy", {
        policyContent: "AUTO",
        companyData: formData,
        documentType: aiData?.documentType,
      });

      if (res.status === 201) {
        setPreviewContent(res.data['refinedContent'] || "");
        setActiveTab("preview");
      }
    } finally {
      setIsRefining(false);
    }
  };

//   const handleRefineWithAI = async (name, sections, type) => {
//     if (!formData.companyName) {
//       toast({
//         title: "Company Name Required",
//         description: "Please provide at least the company name to refine the document.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsRefining(true);
//     try {
//       const documentContent = `
// ${document.name}

// ${document.sections.map((section, index) => `
// ${index + 1}. ${section}
// [This section will contain details about ${section.toLowerCase()}]
// `).join('\n')}
//       `.trim();

//       // const { data, error } = await supabase.functions.invoke('refine-policy', {
//       //   body: {
//       //     policyContent: documentContent,
//       //     companyData: formData,
//       //     documentType
//       //   }
//       // });

//       // if (error) throw error;
//       let data = await httpClient.post('esgdd/escap/refine-policy', {
//         policyContent: documentContent,
//         companyData: formData,
//         documentType
//       });
//       console.log("Refinement response:", data);
//       if (data.status == 201) {
//         setPreviewContent(data.data['refinedContent'] || "");
//         setMissingFields(data.data['missingFields'] || []);
//         setActiveTab("preview");

//         toast({
//           title: "Document Refined",
//           description: data['missingFields']?.length > 0
//             ? `Document refined! ${data.data['missingFields'].length} field(s) need your input.`
//             : "Document refined successfully with all available information!",
//         });
//         toast({
//           title: "Document Refined",
//           description: "Document refined successfully with all available information!",
//         });
//       }

//     } catch (error) {
//       console.error("Refinement error:", error);
//       toast({
//         title: "Refinement Failed",
//         description: error instanceof Error ? error.message : "Failed to refine the document. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsRefining(false);
//     }
//   };

  useEffect(() => {
    if (item?.manualInsights) {
      setAiData(item?.manualInsights)
    }
    else {
      setAiData(item?.aiResponseRaw)
    }
  }, [item])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>{item?.item}</DialogTitle>
          <DialogDescription>
            Complete required documents to close this item
          </DialogDescription>
        </DialogHeader>

        {/* 🔥 REQUIRED EVIDENCE */}
        <div className="border p-4 rounded bg-blue-50">
          <h4 className="font-semibold mb-2">Required to Close</h4>
          <div className="flex flex-wrap gap-2">
            {aiData?.requiredEvidence?.types?.map((t: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-blue-100 text-xs rounded">
                {t}
              </span>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="form">Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* ================= FORM ================= */}
          <TabsContent value="form" className="space-y-4">

            <div>
              <Label>Company Name</Label>
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Prepared By</Label>
              <Input
                value={formData.preparedBy}
                onChange={(e) =>
                  setFormData({ ...formData, preparedBy: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Place</Label>
              <Input
                value={formData.place}
                onChange={(e) =>
                  setFormData({ ...formData, place: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Office Address</Label>
              <Textarea
                value={formData.officeAddress}
                onChange={(e) =>
                  setFormData({ ...formData, officeAddress: e.target.value })
                }
              />
            </div>

            {/* 🔥 TEMPLATES */}
            <div className="space-y-3">
              {aiData?.templates?.map((template: any, i: number) => {
                const isData =
                  template.format === "excel" ||
                  template.type === "data";

                const structureKeys = Object.keys(template.structure || {});

                return (
                  <div
                    key={i}
                    className="border rounded-lg p-4 bg-white space-y-3"
                  >
                    {/* 🔹 HEADER */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{template.name}</p>

                        <p className="text-xs text-muted-foreground">
                          {template.type} • {template.format}
                        </p>

                        {template.isMandatory && (
                          <span className="text-xs text-red-500">
                            Mandatory
                          </span>
                        )}
                      </div>

                      {/* 🔹 ACTIONS */}
                      <div className="flex gap-2">
                        {!isData && (
                          <Button
                            size="sm"
                            onClick={() => handleDownloadTemplate(template)}
                          >
                            Download Doc
                          </Button>
                        )}

                        {isData && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                downloadDataTemplate(template, "excel")
                              }
                            >
                              Excel
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                downloadDataTemplate(template, "csv")
                              }
                            >
                              CSV
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 🔥 STRUCTURE AS SECTIONS */}
                    {!isData && structureKeys.length > 0 && (
                      <div className="border-t pt-3">

                        <details>
                          <summary className="cursor-pointer text-sm font-semibold">
                            Sections ({structureKeys.length})
                          </summary>

                          <ul className="text-xs mt-2 space-y-1 max-h-40 overflow-y-auto">
                            {structureKeys.map((key: string, index: number) => (
                              <li key={index} className="text-muted-foreground">
                                {index + 1}. {key.replace(/_/g, " ")}
                              </li>
                            ))}
                          </ul>
                        </details>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => { handleRefine() }} disabled={isRefining}>
                {isRefining ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Refine with AI
              </Button>
            </div>

          </TabsContent>

          {/* ================= PREVIEW ================= */}
          <TabsContent value="preview">
            {previewContent ? (
              <div className="border p-4 rounded">
                <pre className="text-sm whitespace-pre-wrap">
                  {previewContent}
                </pre>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">
                No preview available
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}