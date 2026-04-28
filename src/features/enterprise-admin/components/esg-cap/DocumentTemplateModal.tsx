import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2, FileText, Sparkles } from "lucide-react";
import { PolicyTemplate } from "@/data/policyTemplates";
import { SOPTemplate } from "@/data/sopTemplates";
import { LogTemplate } from "@/data/logTemplates";
import { downloadPolicyTemplate } from "@/utils/policyTemplateGenerator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { httpClient } from "@/lib/httpClient";

type DocumentTemplate = PolicyTemplate | SOPTemplate | LogTemplate;
type DocumentType = "Policy" | "SOP" | "Log";

interface DocumentTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentTemplate;
  documentType: DocumentType;
}

export function DocumentTemplateModal({
  open,
  onOpenChange,
  document,
  documentType,
}: DocumentTemplateModalProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [previewContent, setPreviewContent] = useState<string>("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    companyName: "",
    preparedBy: "",
    place: "",
    officeAddress: "",
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefineWithAI = async () => {
    if (!formData.companyName) {
      toast({
        title: "Company Name Required",
        description: "Please provide at least the company name to refine the document.",
        variant: "destructive",
      });
      return;
    }

    setIsRefining(true);
    try {
      const documentContent = `
${document.name}

${document.sections.map((section, index) => `
${index + 1}. ${section}
[This section will contain details about ${section.toLowerCase()}]
`).join('\n')}
      `.trim();

      // const { data, error } = await supabase.functions.invoke('refine-policy', {
      //   body: {
      //     policyContent: documentContent,
      //     companyData: formData,
      //     documentType
      //   }
      // });

      // if (error) throw error;
      let data = await httpClient.post('esgdd/escap/refine-policy', {
        policyContent: documentContent,
        companyData: formData,
        documentType
      });
      console.log("Refinement response:", data);
      if (data.status == 201) {
        setPreviewContent(data.data['refinedContent'] || "");
        setMissingFields(data.data['missingFields'] || []);
        setActiveTab("preview");

        toast({
          title: "Document Refined",
          description: data['missingFields']?.length > 0
            ? `Document refined! ${data.data['missingFields'].length} field(s) need your input.`
            : "Document refined successfully with all available information!",
        });
        toast({
          title: "Document Refined",
          description: "Document refined successfully with all available information!",
        });
      }

    } catch (error) {
      console.error("Refinement error:", error);
      toast({
        title: "Refinement Failed",
        description: error instanceof Error ? error.message : "Failed to refine the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPolicyTemplate(document, {
        ...formData,
        logoDataUrl: logoPreview || undefined,
      });
      toast({
        title: "Template Downloaded",
        description: `${document.name} has been downloaded successfully.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate the template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    console.log("DocumentTemplateModal opened with document:", document);
  }, [document]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.name}
          </DialogTitle>
          <DialogDescription>
            Fill in your company details and use AI to refine the {documentType.toLowerCase()} document.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "preview")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Company Details</TabsTrigger>
            <TabsTrigger value="preview">Document Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo (Optional)</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              {logoPreview && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-20 w-20 object-contain border rounded"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparedBy">Prepared By *</Label>
              <Input
                id="preparedBy"
                placeholder="Enter name"
                value={formData.preparedBy}
                onChange={(e) =>
                  setFormData({ ...formData, preparedBy: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place">Place *</Label>
              <Input
                id="place"
                placeholder="Enter city/location"
                value={formData.place}
                onChange={(e) =>
                  setFormData({ ...formData, place: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeAddress">Office Address *</Label>
              <Textarea
                id="officeAddress"
                placeholder="Enter complete office address"
                value={formData.officeAddress}
                onChange={(e) =>
                  setFormData({ ...formData, officeAddress: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="rounded-lg border p-4 bg-muted/50">
              <h4 className="font-semibold mb-2">Document Sections:</h4>
              <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
                {document.sections.map((section, index) => (

                  <li key={index} className="text-muted-foreground">
                    {index + 1}. {section}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={handleRefineWithAI}
                disabled={isRefining || !formData.companyName}
                className="gap-2"
              >
                {isRefining ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Refine with AI
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 py-4">
            {previewContent ? (
              <>
                <div className="rounded-lg border p-6 bg-background max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{previewContent}</pre>
                </div>

                {missingFields.length > 0 && (
                  <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                      Missing Information:
                    </h4>
                    <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                      {missingFields.map((field, index) => (
                        <li key={index}>• {field}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      Fill in these details in the form and refine again for a complete document.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setActiveTab("form")}>
                    Back to Form
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={
                      isDownloading ||
                      !formData.companyName ||
                      !formData.preparedBy ||
                      !formData.place ||
                      !formData.officeAddress
                    }
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download Document
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-lg border p-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No preview available yet.</p>
                <p className="text-sm mt-2">Fill in company details and click "Refine with AI" to generate a preview.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {activeTab === "form" && (
            <Button
              onClick={handleDownload}
              disabled={
                isDownloading ||
                !formData.companyName ||
                !formData.preparedBy ||
                !formData.place ||
                !formData.officeAddress
              }
              variant="secondary"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
