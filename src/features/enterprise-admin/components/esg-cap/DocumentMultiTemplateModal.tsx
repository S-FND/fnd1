import { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { httpClient } from "@/lib/httpClient";
import { downloadPolicyDocument } from "@/utils/policyTemplateGenerator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: any; // expects item.aiInsights.evidence[]
}

type Tab = "form" | "preview";

interface Section {
    title: string;
    content: string;
}

export function DocumentMultiTemplateModal({
    open,
    onOpenChange,
    item,
}: Props) {
    const { toast } = useToast();

    // 🔹 Tabs
    const [activeTab, setActiveTab] = useState<Tab>("form");

    // 🔹 Form
    const [formData, setFormData] = useState({
        companyName: "",
        preparedBy: "",
        place: "",
        officeAddress: "",
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // 🔹 Evidence
    const evidences = item?.aiInsights?.evidence || [];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [sections, setSections] = useState<Record<string, { content: string }>>({});
    const [addedSections, setAddedSections] = useState<Record<string, { content: string }>>({});
    const [sectionOrder, setSectionOrder] = useState<string[]>([]);

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


    const selectedEvidence = useMemo(
        () => evidences[selectedIndex],
        [evidences, selectedIndex]
    );

    const structure = selectedEvidence?.template?.structure || {};
    const isData = selectedEvidence?.evidenceCategory === "data";

    // 🔹 States
    const [isRefining, setIsRefining] = useState(false);
    const [previewContent, setPreviewContent] = useState("");
    const [missingFields, setMissingFields] = useState<string[]>([]);

    function formatLabel(str: string) {
        return str
            .replace(/_/g, " ")
            .split(" ")
            .map((word) =>
                word.length <= 2 ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)
            )
            .join(" ");
    }

    useEffect(() => {
        // reset when switching evidence
        setPreviewContent("");
        setMissingFields([]);
        setActiveTab("form");
    }, [selectedIndex]);

    // 🔹 Handlers
    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleRefine = async () => {
        if (!selectedEvidence || !formData.companyName) {
            toast({
                title: "Missing Info",
                description: "Please fill company name",
                variant: "destructive",
            });
            return;
        }

        setIsRefining(true);
        const documentContent = `
${selectedEvidence.type}

${Object.keys(structure).map((section, index) => `
${index + 1}. ${section}
[This section will contain details about ${section.toLowerCase()}]
`).join('\n')}
      `.trim();

        try {
            debugger;
            const res = await httpClient.post<{
                refinedContent: string;
                missingFields: string[];
                sections: Record<string, any>;
                addedSections: Record<string, any>;
                missingSections: string[];
                sectionOrder: string[];
                suggestions: any[]; // can refine later if structure is known


            }>("esgdd/escap/refine-policy", {
                type: selectedEvidence.type,
                structure: selectedEvidence.template?.structure,
                companyData: formData,
                itemId: item?._id,
                policyContent: documentContent,
                documentType: 'Policy'
            });

            const response = res.data;

            setPreviewContent(response?.refinedContent || "");
            setMissingFields(response?.missingFields || []);
            setSections(response?.sections || {});
            setAddedSections(response?.addedSections || {});
            setSectionOrder(response?.sectionOrder || []);


            setActiveTab("preview");

            toast({
                title: "Refined",
                description: `${selectedEvidence.type.replace(/_/g, " ")} generated`,
            });

        } catch (error) {
            console.error(error);

            toast({
                title: "Error",
                description: "Failed to refine document",
                variant: "destructive",
            });
        }
        finally {
            setIsRefining(false);
        }
    };



    const parseRefinedContentToSections = (refinedContent: string): Section[] => {
        if (!refinedContent) return [];

        const lines = refinedContent.split("\n");

        const sections: Section[] = [];
        let currentSection: Section | null = null;

        for (let rawLine of lines) {
            const line = rawLine.trim();

            if (!line) continue;

            // ✅ Detect headings (# or ## or ###)
            const headingMatch = line.match(/^(#{1,6})\s+(.*)/);

            if (headingMatch) {
                const level = headingMatch[1].length;
                const title = headingMatch[2].trim();

                // Skip H1 as section (treat as document title)
                if (level === 1) {
                    // optional: store separately if needed
                    continue;
                }

                // push previous section
                if (currentSection) {
                    sections.push(currentSection);
                }

                currentSection = {
                    title,
                    content: "",
                };

                continue;
            }

            // ✅ Normal content
            if (!currentSection) {
                currentSection = {
                    title: "General",
                    content: "",
                };
            }

            // Preserve bullets properly
            currentSection.content += rawLine + "\n";
        }

        // push last
        if (currentSection) {
            sections.push(currentSection);
        }

        return sections;
    }

    const handleDownload = async () => {
        try {
            // replace with your API
            console.log("Download template:", selectedEvidence);
            const sections = parseRefinedContentToSections(
                previewContent
            );
            downloadPolicyDocument(
                selectedEvidence.type,
                sections,
                formData
            );

            toast({
                title: "Download Ready",
                description: `${selectedEvidence.type} template`,
            });
        } catch {
            toast({
                title: "Error",
                description: "Download failed",
                variant: "destructive",
            });
        }
    };

    // 🔹 UI
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{item?.item}</DialogTitle>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex gap-2 border-b pb-2 mb-4">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "form" ? "bg-muted" : ""
                            }`}
                        onClick={() => setActiveTab("form")}
                    >
                        Company Details
                    </button>

                    <button
                        className={`px-4 py-2 rounded ${activeTab === "preview" ? "bg-muted" : ""
                            }`}
                        onClick={() => setActiveTab("preview")}
                    >
                        Document Preview
                    </button>
                </div>

                {/* FORM TAB */}
                {activeTab === "form" && (
                    // <div className="space-y-4">
                    //     {/* Company Fields */}
                    //     <InputField
                    //         label="Company Name *"
                    //         value={formData.companyName}
                    //         onChange={(v) => handleChange("companyName", v)}
                    //     />
                    //     <InputField
                    //         label="Prepared By *"
                    //         value={formData.preparedBy}
                    //         onChange={(v) => handleChange("preparedBy", v)}
                    //     />
                    //     <InputField
                    //         label="Place *"
                    //         value={formData.place}
                    //         onChange={(v) => handleChange("place", v)}
                    //     />
                    //     <TextareaField
                    //         label="Office Address *"
                    //         value={formData.officeAddress}
                    //         onChange={(v) => handleChange("officeAddress", v)}
                    //     />

                    //     {/* 🔥 Evidence Selector */}
                    //     <div>
                    //         <label className="text-sm font-medium">
                    //             Select Document
                    //         </label>
                    //         <select
                    //             className="w-full border rounded px-2 py-2 mt-1"
                    //             value={selectedIndex}
                    //             onChange={(e) =>
                    //                 setSelectedIndex(Number(e.target.value))
                    //             }
                    //         >
                    //             {evidences.map((e: any, i: number) => (
                    //                 <option key={i} value={i}>
                    //                     {e.type.replace(/_/g, " ")}
                    //                 </option>
                    //             ))}
                    //         </select>
                    //     </div>

                    //     {/* 🔥 Structure */}
                    //     <div className="border rounded p-3 bg-muted/40">
                    //         <p className="font-medium mb-2">
                    //             {isData ? "Columns" : "Sections"}
                    //         </p>

                    //         <div className="grid grid-cols-2 gap-2 text-sm">
                    //             {Object.keys(structure).map((k, i) => (
                    //                 <div
                    //                     key={i}
                    //                     className="px-2 py-1 bg-white border rounded"
                    //                 >
                    //                     {formatLabel(k)}
                    //                     {/* {k.replace(/_/g, " ")} */}
                    //                 </div>
                    //             ))}
                    //         </div>
                    //     </div>

                    //     {/* Actions */}
                    //     <div className="flex justify-between">
                    //         <Button variant="outline" onClick={handleDownload}>
                    //             <Download className="h-4 w-4 mr-1" />
                    //             Download Template
                    //         </Button>

                    //         {!isData && (
                    //             <Button
                    //                 onClick={handleRefine}
                    //                 disabled={isRefining}
                    //             >
                    //                 {isRefining ? (
                    //                     <Loader2 className="h-4 w-4 animate-spin" />
                    //                 ) : (
                    //                     <Sparkles className="h-4 w-4 mr-1" />
                    //                 )}
                    //                 Refine {selectedEvidence?.type?.replace(/_/g, " ")}
                    //             </Button>
                    //         )}
                    //     </div>
                    // </div>
                    <>
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
                        {/* 🔥 Evidence Selector */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">
                                    Select Document
                                </label>
                                <select
                                    className="w-full border rounded px-2 py-2 mt-1"
                                    value={selectedIndex}
                                    onChange={(e) =>
                                        setSelectedIndex(Number(e.target.value))
                                    }
                                >
                                    {evidences.map((e: any, i: number) => (
                                        <option key={i} value={i}>
                                            {e.type.replace(/_/g, " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 🔥 Structure */}
                            <div className="border rounded p-3 bg-muted/40">
                                <p className="font-medium mb-2">
                                    {isData ? "Columns" : "Sections"}
                                </p>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {Object.keys(structure).map((k, i) => (
                                        <div
                                            key={i}
                                            className="px-2 py-1 bg-white border rounded"
                                        >
                                            {formatLabel(k)}
                                            {/* {k.replace(/_/g, " ")} */}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-1" />
                                    Download Template
                                </Button>

                                {!isData && (
                                    <Button
                                        onClick={handleRefine}
                                        disabled={isRefining}
                                    >
                                        {isRefining ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-4 w-4 mr-1" />
                                        )}
                                        Refine {selectedEvidence?.type?.replace(/_/g, " ")}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* PREVIEW TAB */}
                {activeTab === "preview" && (
                    <div className="space-y-4">
                        <h4 className="font-semibold">
                            Preview –{" "}
                            {selectedEvidence?.type?.replace(/_/g, " ")}
                        </h4>

                        {missingFields.length > 0 && (
                            <div className="bg-yellow-50 border p-2 rounded text-sm">
                                Missing:
                                <ul className="list-disc ml-4">
                                    {missingFields.map((m, i) => (
                                        <li key={i}>{m}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="border rounded p-3 bg-white text-sm whitespace-pre-wrap">
                            {previewContent || "No preview yet"}
                        </div>
                        {/* 🔥 ACTION BUTTONS */}
                        <div className="flex justify-between items-center pt-3 border-t">

                            <Button
                                variant="outline"
                                onClick={() => setActiveTab("form")}
                            >
                                Back to Form
                            </Button>

                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleDownload}
                            >
                                ⬇ Download Document
                            </Button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* 🔹 Simple Inputs (inline to keep single file) */

function InputField({ label, value, onChange }: any) {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <input
                className="w-full border rounded px-2 py-2 mt-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function TextareaField({ label, value, onChange }: any) {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <textarea
                className="w-full border rounded px-2 py-2 mt-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}