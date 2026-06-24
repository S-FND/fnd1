// src/components/esg-cap/ExportDrawer.tsx
import { useMemo, useState } from "react";
import { X, FileText, Eye, Download, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { defaultFilters, type ExportFilters } from "../lib/export-types";
import { downloadPdf, previewPdfUrl } from "../lib/pdf-generator";
import { ESGCapItem, CAPStatus, ESGCapPriority, ESGCapDealCondition } from "@/features/enterprise-admin/types/esgDD";


interface Props {
  open: boolean;
  onClose: () => void;
  items: ESGCapItem[];
  entityName?: string;
}

const STATUS_FILTERS: { value: CAPStatus | "Total"; label: string }[] = [
  { value: "", label: "" },
  { value: "due-in-this-month", label: "Due in This Month" },
  { value: "closed", label: "Closed" },
  { value: "overdue", label: "Overdue" },
  { value: "partly-submitted", label: "Partly Submitted" },
  { value: "submitted-pending-review", label: "Submitted Pending Review" },
];

const PRIORITIES: { value: ESGCapPriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const DEAL_CONDITIONS: { value: ESGCapDealCondition; label: string }[] = [
  { value: "CP", label: "Conditions Precedent (CP)" },
  { value: "CS", label: "Conditions Subsequent (CS)" },
  { value: "ESG_Roadmap", label: "ESG Roadmap" },
  { value: "none", label: "None" },
];

const getDateStatus = (item: ESGCapItem) => {
  const investorStatus = (item.investorStatus || "").toLowerCase();
  const companyStatus = (item.companyStatus || "").toLowerCase();

  // 1. Check if investor has closed it
  if (investorStatus === "closed") {
    return "closed";
  }

  // 2. Check company status first (these are the actual status values)
  if (companyStatus === "closed") {
    return "closed";
  }

  if (companyStatus === "partly-submitted") {
    return "partly-submitted";
  }

  if (companyStatus === "submitted-pending-review") {
    return "submitted-pending-review";
  }

  // 3. Check if overdue based on target date
  if (!item.targetDate) {
    return "";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(item.targetDate);
  target.setHours(0, 0, 0, 0);

  // Check if due in current month
  if (
    target.getMonth() === today.getMonth() &&
    target.getFullYear() === today.getFullYear()
  ) {
    return "due-in-this-month";
  }

  // Check if overdue
  if (target < today) {
    return "overdue";
  }

  // Default: upcoming (for future dates)
  return "upcoming";
};

export function ExportDrawer({ open, onClose, items, entityName }: Props) {
  const [f, setF] = useState<ExportFilters>(defaultFilters);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<"preview" | "download" | "email" | null>(null);
  const [done, setDone] = useState<"download" | "email" | null>(null);

  const getCompanyNameString = (name: any): string => {
    if (!name) return "";
    if (typeof name === 'string') return name;
    if (typeof name === 'object' && name.companyName) return name.companyName;
    return String(name);
  };
  
  // Then use it when calling PDF functions
  const safeCompanyName = getCompanyNameString(entityName);

  const matchCount = useMemo(() => {
    return items.filter(i => {
      // Status filter (skip "Total")
      if (f.statuses.length && !f.statuses.includes("Total")) {
        const effective = getDateStatus(i);
        if (!f.statuses.includes(effective)) return false;  // ✅ works with strings
      }
      // Category filter (deal condition)
      if (f.categories.length && !f.categories.includes(i.dealCondition)) return false;
      // Priority filter
      if (f.priorities.length && !f.priorities.includes(i.priority?.toLowerCase())) return false;
      return true;
    }).length;
  }, [items, f]);

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  }

  async function onPreview() {
    setLoading("preview");
    await new Promise(r => setTimeout(r, 400));
    setPreviewUrl(previewPdfUrl(f, items, safeCompanyName));
    setLoading(null);
  }

  async function onDownload() {
    setLoading("download");
    await new Promise(r => setTimeout(r, 500));
    downloadPdf(f, items, safeCompanyName);
    setLoading(null);
    setDone("download");
    setTimeout(() => setDone(null), 2400);
  }

  async function onEmail() {
    setLoading("email");
    await new Promise(r => setTimeout(r, 700));
    // TODO: implement email API call
    setLoading(null);
    setDone("email");
    setTimeout(() => setDone(null), 2400);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button aria-label="Close" onClick={onClose} className="flex-1 bg-foreground/40 backdrop-blur-sm animate-in fade-in" />
      <aside className="w-full max-w-[640px] h-full bg-card shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <header className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Export ESG CAP Report</h2>
              <p className="text-xs text-muted-foreground">
                {matchCount} of {items.length} items match current filters
              </p>
            </div>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-md hover:bg-muted flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Report Type */}
          {/* <Section title="Report Type" hint="Choose the depth of the export.">
            <div className="grid grid-cols-2 gap-3">
              {(["summary", "detailed"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setF({ ...f, reportType: t })}
                  className={`p-4 rounded-lg border text-left transition ${
                    f.reportType === t ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-semibold capitalize">{t} Report</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t === "summary" ? "KPIs, charts, top-line view" : "Full item-level breakdown + appendix"}
                  </div>
                </button>
              ))}
            </div>
          </Section> */}

          {/* Status */}
          <Section title="Status" hint="Multi-select. Empty = all statuses.">
            <ChipRow>
              {STATUS_FILTERS.map(s => (
                <Chip key={s.value} active={f.statuses.includes(s.value)} onClick={() => setF({ ...f, statuses: toggle(f.statuses, s.value) })}>
                  {s.label}
                </Chip>
              ))}
            </ChipRow>
          </Section>

          {/* Priority */}
          <Section title="Priority">
            <ChipRow>
              {PRIORITIES.map(p => (
                <Chip key={p.value} active={f.priorities.includes(p.value)} onClick={() => setF({ ...f, priorities: toggle(f.priorities, p.value) })}>
                  {p.label}
                </Chip>
              ))}
            </ChipRow>
          </Section>

          {/* Category */}
          <Section title="Category">
            <ChipRow>
              {DEAL_CONDITIONS.map(c => (
                <Chip key={c.value} active={f.categories.includes(c.value)} onClick={() => setF({ ...f, categories: toggle(f.categories, c.value) })}>
                  {c.label}
                </Chip>
              ))}
            </ChipRow>
          </Section>

          {/* Date Range */}
          <Section title="Date Range" hint="Filter CAP items by the selected date field.">
            <div className="flex gap-2 mb-3">
              {([
                { v: "target", label: "Target Date" },
                // { v: "created", label: "Created" },
                // { v: "submitted", label: "Submitted" },
              ] as const).map(o => (
                <Chip key={o.v} active={f.dateField === o.v} onClick={() => setF({ ...f, dateField: o.v })}>
                  {o.label}
                </Chip>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label="From" type="date" value={f.dateFrom} onChange={v => setF({ ...f, dateFrom: v })} />
              <LabeledInput label="To" type="date" value={f.dateTo} onChange={v => setF({ ...f, dateTo: v })} />
            </div>
          </Section>

          {/* Sections */}
          {/* <Section title="Include Sections">
            <div className="grid grid-cols-2 gap-2">
              {([
                ["includeCompany", "Company Information"],
                ["includeDashboard", "Dashboard Summary"],
                ["includeCharts", "Charts & Analytics"],
                ["includeItems", "CAP Item Details"],
                ["includeAttachments", "Attachments Index"],
                ["includeComments", "Comments / Remarks"],
              ] as const).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2.5 rounded-md border p-3 cursor-pointer hover:border-primary/40 transition">
                  <input
                    type="checkbox"
                    checked={f[k]}
                    onChange={e => setF({ ...f, [k]: e.target.checked })}
                    className="h-4 w-4 accent-[oklch(0.55_0.18_155)]"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </Section> */}
        </div>

        {/* Footer */}
        <footer className="border-t bg-muted/30 px-6 py-4 space-y-3">
          {done && (
            <div className="flex items-center gap-2 text-sm text-success bg-success-soft border border-success/20 rounded-md px-3 py-2">
              <CheckCircle2 className="h-4 w-4" />
              {done === "download" ? "PDF downloaded successfully." : "Report emailed to investor contact."}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onPreview}
              disabled={loading !== null}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
            >
              {loading === "preview" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Preview
            </button>
            {/* <button
              onClick={onEmail}
              disabled={loading !== null}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
            >
              {loading === "email" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Email
            </button> */}
            <button
              onClick={onDownload}
              disabled={loading !== null}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 shadow-sm"
            >
              {loading === "download" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </button>
          </div>
        </footer>
      </aside>

      {previewUrl && (
        <div className="fixed inset-0 z-[60] bg-foreground/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Report Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onDownload} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
                <button onClick={() => setPreviewUrl(null)} className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <iframe src={previewUrl} title="PDF Preview" className="flex-1 w-full rounded-b-xl" />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5">
        <h3 className="text-sm font-semibold">{title}</h3>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
        active ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card border-border hover:border-primary/40 text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function LabeledInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-10 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}