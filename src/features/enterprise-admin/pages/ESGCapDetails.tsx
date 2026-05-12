import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, Navigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    Plus,
    Send,
    Paperclip,
    FileText,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    Building2,
    ShieldCheck,
    Activity,
    ChevronDown,
    Info,
    X,
    UserPlus,
    ClipboardCheck,
    Loader2,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
// import { machineDDCapItems } from '@/features/machine-dd/data/mockMachineDD';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { logger } from '@/hooks/logger';
import Loader from '@/components/ui/loader';
import { fetchEsgCap, updatePlan, esgddChangePlan, editFinalizedPlan } from '../services/esgdd';
import { DocumentUploadModal } from '../components/esg-cap/DocumentUploadModal';
import { httpClient } from "@/lib/httpClient";
const SectionCard: React.FC<{
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'primary' | 'muted';
    rightSlot?: React.ReactNode;
    children: React.ReactNode;
}> = ({ title, subtitle, icon, variant = 'default', rightSlot, children }) => {
    const headerClass =
        variant === 'primary'
            ? 'bg-[hsl(224_76%_28%)] text-white'
            : variant === 'muted'
                ? 'bg-slate-700 text-white'
                : 'bg-card text-foreground border-b';


    return (
        <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <header className={cn('flex items-center justify-between px-6 py-4', headerClass)}>
                <div className="flex items-center gap-3">
                    {icon && <span className="opacity-90">{icon}</span>}
                    <div>
                        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
                        {subtitle && (
                            <p className={cn('text-xs', variant === 'default' ? 'text-muted-foreground' : 'text-white/70')}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                {rightSlot}
            </header>
            <div className="p-6">{children}</div>
        </section>
    );
};

const MetaPill: React.FC<{ label: string; tone?: 'default' | 'red' | 'amber' | 'green' | 'blue' | 'slate' }> = ({
    label,
    tone = 'default',
}) => {
    const map: Record<string, string> = {
        default: 'bg-muted text-foreground border-border',
        red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
        amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
        blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
        slate: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800',
    };
    return (
        <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium', map[tone])}>
            {label}
        </span>
    );
};

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 text-sm text-foreground">{value ?? '—'}</div>
    </div>
);



const ESGCapDetailsPage: React.FC = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const itemName = searchParams.get('itemName');

    // const { isAuthenticated } = useAuth();
    //   all.find((i) => i.id === id);
    const [loading, setLoading] = useState(true);
    const [capItem, setCapItem] = useState<any>(null);


    const getUserEntityId = () => {
        try {
            const user = localStorage.getItem('fandoro-user');

            if (user) {
                const parsedUser = JSON.parse(user);
                return parsedUser?.entityId || null;
            }

            return null;
        } catch (error) {
            logger.error("Error parsing user ", error);
            return null;
        }
    };

    const entityId = getUserEntityId();

    const loadData = async () => {
        if (!entityId || !id || !itemName) return;

        setLoading(true);

        try {
            const data = await fetchEsgCap(entityId);

            if (data?.status) {
                const matchedItem = (data?.plan || []).find(
                    (i: any) =>
                        i?.reportId === id &&
                        i?.item?.trim()?.toLowerCase() ===
                        decodeURIComponent(itemName)
                            ?.trim()
                            ?.toLowerCase()
                );
                setFullPlan(data.plan || []);
                setCapItem(matchedItem || null);
                setAssigneeText(matchedItem?.assignedTo || '');
                setChangeNote(matchedItem?.changeNote || '');
                setUpdateText(matchedItem?.UpdateNote || '');
            } else {
                toast.error("Failed to load ESG CAP data");
            }
        } catch (error) {
            toast.error("Error loading CAP data");
            logger.error(error);
        } finally {
            setLoading(false);
        }
    };
    console.log('setCapItem===========>', capItem);
    useEffect(() => {
        loadData();
    }, [id, itemName]);

    const initialAssignees = capItem?.assignedTo || [];
    const [updateText, setUpdateText] = useState('');
    const [showUpdateNotes, setShowUpdateNotes] = useState(false);
    const [requestChange, setRequestChange] = useState(false);
    const [changeNote, setChangeNote] = useState('');
    const [assigneeText, setAssigneeText] = useState<string>('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [fullPlan, setFullPlan] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [uploadDocumentType, setUploadDocumentType] = useState<string | null>(null);
    const selectedIndicatorRef = useRef<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{
        file: any;
        idx: number;
    } | null>(null);
    const [completion, setCompletion] = useState<Record<string, boolean>>({
        'Consolidated Annual Return Copy': true,
        'Factory License': true,
        'Labour Welfare Filing': false,
        'Gratuity Payment Proof': false,
    });
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [attachmentsMode, setAttachmentsMode] = useState<'upload' | 'view'>('upload');

    const openAttachments = (mode: 'upload' | 'view') => {
        setAttachmentsMode(mode);
        setAttachmentsOpen(true);
    };

    const firesideSteps = [
        { label: 'Submitted', date: 'Jul 12, 2026', done: true },
        { label: 'Under Review', date: 'Jul 14, 2026', done: true },
        { label: 'Change Requested', date: 'Jul 18, 2026', done: true },
        { label: 'Approved', date: 'Pending', done: false },
        { label: 'Closed', date: 'Pending', done: false },
    ];

    const comments = [
        { name: 'Priya Menon', role: 'Compliance Lead', time: '2 days ago', text: 'Please attach the consolidated annual return for FY25.' },
        { name: 'Rahul Iyer', role: 'Governance Reviewer', time: '5 hours ago', text: 'Looks aligned. Awaiting Labour Welfare filing proof.' },
    ];

    const getLoggedInUser = () => {
        const userStr = localStorage.getItem('fandoro-user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    };

    const loggedInUser = getLoggedInUser();
    const isFiresideEmail = loggedInUser?.email?.endsWith('@fireside.com') ?? false;

    const handleViewDocument = async (file: any) => {
        try {
            const getSignedUrl: any = await httpClient.get(
                `esgdd/escap/uploaded/evidence-files/signed-urls?key=${file.filename}`
            );

            if (getSignedUrl.status === 200) {
                window.open(getSignedUrl.data.signedUrl, '_blank');
            }
        } catch (error) {
            console.error("View error:", error);
            toast.error("Failed to view document");
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            if (requestChange) {

                const updatedPlan = fullPlan.map((item) => {
                    if (
                        item.reportId === capItem.reportId &&
                        item.item === capItem.item
                    ) {
                        return {
                            ...item,
                            assignedTo: assigneeText?.trim(),
                            UpdateNote: updateText?.trim(),
                            changeNote: changeNote?.trim(),
                            comment: 'Change-Request',
                        };
                    }

                    return item;
                });

                const changePayload = {
                    entityId,
                    changeRequest: {
                        plan: updatedPlan,
                        comment: 'Change-Request',
                    },
                };

                await esgddChangePlan(changePayload);

                toast.success('Change request submitted', {
                    description: changeNote,
                });

            } else {

                const updatedFullPlan = fullPlan.map((item) =>
                    item.reportId === capItem.reportId &&
                        item.item === capItem.item
                        ? {
                            ...item,
                            assignedTo: assigneeText?.trim(),
                            UpdateNote: updateText?.trim(),
                            comment: 'Plan-Update',
                        }
                        : item
                );

                const payload = {
                    entityId,
                    updatedPlan: updatedFullPlan,
                    reason: 'Investor edited the finalized plan',
                };

                await editFinalizedPlan(payload);

                toast.success('Plan updated successfully');
            }

            setUpdateText('');
            setShowUpdateNotes(false);
            setRequestChange(false);
            setChangeNote('');

            await loadData();

        } catch (error) {
            console.error(error);
            toast.error('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDocument = (file: any, idx: number) => {
        setConfirmDelete({
            file,
            idx,
        });
    };

    const handleDeleteConfirmed = async () => {
        if (!confirmDelete) return;

        const { file } = confirmDelete;

        try {
            setDeleting(file.filename);

            const queryParams = new URLSearchParams({
                fileName: file.filename,
                actionItemId: file.aiSummary?.actionItemId || '',
                validationDocId: file.aiSummary?._id || '',
            }).toString();

            await httpClient.delete(
                `esgdd/escap/delete-file-esgcap?${queryParams}`
            );

            toast.success('Document deleted');

            setCapItem((prev: any) => ({
                ...prev,
                fileUploadedData:
                    prev?.fileUploadedData?.filter(
                        (f: any) => f.filename !== file.filename
                    ) || [],
            }));

            setConfirmDelete(null);

        } catch (error: any) {
            console.error(error);
            toast.error('Failed to delete document');
        } finally {
            setDeleting(null);
        }
    };

    const hasDocumentForIndicator = (indicatorLabel: string) => {
        return capItem?.fileUploadedData?.some(
          (file: any) => file.documentType === indicatorLabel
        );
      };

    if (loading) {
        return <UnifiedSidebarLayout><Loader2 /> </UnifiedSidebarLayout>;
    }
    return (
        <UnifiedSidebarLayout>
            <div className="min-h-screen bg-[hsl(220_25%_97%)] dark:bg-background">
                <div className="mx-auto max-w-[1440px] px-6 py-8 space-y-6">
                    {/* Header */}
                    <div>
                        <Link to="/esg-dd/cap" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-1 h-4 w-4" /> Back to CAP List
                        </Link>
                        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h5 className="text-3xl font-bold tracking-tight">{capItem?.item}</h5>
                                {/* <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{capItem?.description}</p> */}
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <MetaPill label={capItem.dealCondition} tone="slate" />
                                    <MetaPill label={`${capItem?.priority?.charAt(0)?.toUpperCase() + capItem?.priority?.slice(1)} Priority`} />
                                    <MetaPill label={`Due ${new Date(capItem?.targetDate).toLocaleDateString()}`} tone="blue" />
                                    <MetaPill label={capItem?.category?.charAt(0)?.toUpperCase() + capItem?.category?.slice(1)} />
                                    <MetaPill
                                        label={capItem?.status?.replaceAll('_', ' ') || 'Pending'}
                                        tone={
                                            capItem?.status === 'completed' || capItem?.status === 'accepted'
                                                ? 'green'
                                                : capItem?.status === 'pending'
                                                    ? 'amber'
                                                    : capItem?.status === 'in_review' ||
                                                        capItem?.status === 'in_progress'
                                                        ? 'blue'
                                                        : capItem?.status === 'delayed'
                                                            ? 'red'
                                                            : 'slate'
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">
                                    <Download className="h-4 w-4" /> Export
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Company Actions */}
                    <SectionCard
                        title="Company Actions"
                        subtitle="Operational updates from the responsible team"
                        icon={<ClipboardCheck className="h-4 w-4" />}
                        variant="primary"
                        rightSlot={
                            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 ring-1 ring-white/20">
                                Only this section is editable
                            </span>
                        }
                    >
                        <div className="space-y-6">
                            {/* Primary Actions */}
                            <div>
                                <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    Primary Actions
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Button
                                        size="lg"
                                        onClick={() => openAttachments('upload')}
                                        className="h-11 rounded-xl bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                                    >
                                        <Upload className="h-4 w-4" /> Upload Document
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        onClick={() => setShowUpdateNotes((v) => !v)}
                                        className="h-11 rounded-xl"
                                    >
                                        <Plus className="h-4 w-4" /> {showUpdateNotes ? 'Hide Update Notes' : 'Add Update'}
                                    </Button>
                                </div>
                            </div>

                            {/* Update Notes (collapsible) */}
                            <div
                                className={cn(
                                    'grid overflow-hidden transition-all duration-300 ease-in-out',
                                    showUpdateNotes ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                )}
                            >
                                <div className="min-h-0">
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                        Update Notes
                                    </label>
                                    <Textarea
                                        className="mt-2 min-h-[140px] rounded-lg bg-muted/40 text-[15px] leading-relaxed transition focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/40"
                                        placeholder="Open text box for status updates, blocker notes, audit remarks, etc."
                                        value={updateText}
                                        onChange={(e) => setUpdateText(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Update Notes (only if exists) */}
                            {capItem?.UpdateNote && capItem?.comment === 'Plan-Update' && (
                                <div className="rounded-xl border bg-muted/30 p-5">
                                    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                <FileText className="h-4 w-4 text-[#1E3A8A]" /> Update Notes
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Operational updates recorded for this CAP item
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
                                                <Textarea
                                                    disabled
                                                    value={updateText}
                                                    onChange={(e) => setUpdateText(e.target.value)}
                                                    className="min-h-[100px] bg-transparent border-0 focus-visible:ring-0"
                                                    placeholder="Update notes..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Assigned To */}
                            <div className="rounded-xl border bg-muted/30 p-5">
                                <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <UserPlus className="h-4 w-4 text-[#1E3A8A]" /> Assigned To
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Operational owner responsible for CAP execution
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
                                            <Input
                                                placeholder="Assigned To"
                                                value={assigneeText}
                                                onChange={(e) => setAssigneeText(e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Request Change */}
                            <div className="rounded-xl border bg-muted/30 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">Request Change</div>
                                        {capItem?.comment === 'Change-Request' && (
                                            <div className="mt-2 space-y-2">
                                                <Badge
                                                    variant="outline"
                                                    className="border-amber-300 bg-amber-50 text-amber-700"
                                                >
                                                    Change Requested
                                                </Badge>

                                                <p className="text-xs text-muted-foreground">
                                                    {capItem?.changeNote ||
                                                        'Triggers reviewer feedback workflow without modifying structured CAP fields'}
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                    <Switch checked={requestChange} onCheckedChange={(v) => setRequestChange(!!v)} />
                                </div>
                                <div
                                    className={cn(
                                        'grid overflow-hidden transition-all duration-300 ease-in-out',
                                        requestChange ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                    )}
                                >
                                    <div className="min-h-0">
                                        <Textarea
                                            placeholder="Reviewer feedback or change description…"
                                            value={changeNote}
                                            onChange={(e) => setChangeNote(e.target.value)}
                                            className="min-h-[120px] rounded-lg bg-card"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit (visible only on changes) */}
                            {(() => {
                                const initialAssignee = capItem?.assignedTo || '';

                                const assigneeChanged = assigneeText.trim() !== initialAssignee.trim();

                                const hasChanges =
                                    updateText.trim().length > 0 ||
                                    (requestChange && changeNote.trim().length > 0) ||
                                    assigneeChanged;

                                // if (!hasChanges) return null;

                                return (
                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#1E3A8A]/20 bg-[#1E3A8A]/5 p-4">
                                        <div className="text-xs text-muted-foreground">
                                            You have unsaved changes. Review before submitting.
                                        </div>

                                        <Button
                                            size="lg"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="h-11 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
                                        >
                                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                            Submit for Review
                                        </Button>
                                    </div>
                                );
                            })()}
                        </div>
                    </SectionCard>

                    {/* Investor Actions */}
                    <SectionCard
                        title={!isFiresideEmail ? "Investor Action" : "Fireside Action"}
                        subtitle="Internal review and reviewer thread"
                        icon={<MessageSquare className="h-4 w-4" />}
                        variant="muted"
                    >
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{!isFiresideEmail ? "Investor Status" : "Fireside Status"}</div>
                                {(() => {
                                    const current = firesideSteps.filter((s) => s.done).slice(-1)[0] ?? firesideSteps[0];
                                    return (
                                        <div className="mt-4 flex items-center gap-3 rounded-lg border bg-card p-4">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500 text-white">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <div className="text-sm font-semibold">Under Review</div>
                                                <div className="text-xs text-muted-foreground">{current.date}</div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Review Comment</div>
                                <div className="mt-4">
                                    {(() => {
                                        const c = comments[comments.length - 1];
                                        return (
                                            <div className="flex gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>{c.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 rounded-lg border bg-muted/30 p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm font-medium">{c.name} <span className="text-xs font-normal text-muted-foreground">· {c.role}</span></div>
                                                        <div className="text-xs text-muted-foreground">{c.time}</div>
                                                    </div>
                                                    <p className="mt-1 text-sm text-foreground/90">{c.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Reference Details */}
                    <SectionCard title="Reference Details" subtitle="Finding context and corrective measures" icon={<Info className="h-4 w-4" />}>
                        <div className="space-y-6">
                            <Field label="Issue & Related Finding" value={capItem?.issue} />
                            <Field label="Measures & Corrective Actions" value={capItem.measures} />
                        </div>
                    </SectionCard>

                    {/* Completion Tracking */}
                    <SectionCard title="Completion Tracking" subtitle="Milestones and required artefacts" icon={<CheckCircle2 className="h-4 w-4" />}>
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Completion Indicators</div>
                                <ul className="mt-4 space-y-3">
                                <ul className="mt-4 space-y-3">
  {(capItem?.deliverable
    ? capItem.deliverable.includes("##")
      ? capItem.deliverable.split("##").filter(Boolean)
      : [capItem.deliverable].filter(Boolean)
    : []
  ).map((label: string) => {
    const hasDoc = hasDocumentForIndicator(label);
    return (
      <li
        key={label}
        className="flex items-center justify-between rounded-lg border bg-card p-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{label}</span>
          {hasDoc && (
            <Badge variant="outline" className="border-emerald-500 bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Document Uploaded
            </Badge>
          )}
        </div>
        {/* Optional: add a "View" button that opens the document */}
        {hasDoc && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const file = capItem.fileUploadedData.find(
                (f: any) => f.documentType === label
              );
              if (file) handleViewDocument(file);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
        )}
      </li>
    );
  })}
</ul>
                                </ul>
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Guidance & Resources
                                </div>

                                <ul className="mt-4 space-y-3">
                                    {(capItem?.resource
                                        ? capItem.resource.includes("##")
                                            ? capItem.resource.split("##")
                                            : [capItem.resource]
                                        : []
                                    ).filter(Boolean).map((r: string) => (
                                        <div
                                            key={r}
                                            className="flex items-center justify-between rounded-lg border bg-card p-3"
                                        >
                                            <div className="flex items-center gap-3 text-sm">
                                                <span>{r}</span>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <Field label="Submission Date" value="12 Jul 2026" />
                            <Field label="Target Date" value={capItem?.targetDate ? new Date(capItem.targetDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            }) : 'Pending'} />
                            <Field label="Actual Completion" value={capItem?.actualDate ? new Date(capItem.targetDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            }) : 'Pending'} />
                            <Field label="Last Review Date" value={capItem?.lastReviewDate ? new Date(capItem.targetDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            }) : 'Pending'} />
                            <Field label="Closure Verified By" value={capItem?.closureVerifiedBy || 'Upcoming'} />
                        </div>
                    </SectionCard>

                    {/* Attachments & Evidence (Modal) */}
                    <Dialog open={attachmentsOpen} onOpenChange={setAttachmentsOpen}>
                        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
                            <DialogHeader>
                                <DialogTitle>Attachments & Evidence</DialogTitle>
                            </DialogHeader>

                            {/* Completion Indicators list with per‑indicator Upload button */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-2">Completion Indicators</h3>
                                <div className="space-y-2">
                                    {(capItem?.deliverable
                                        ? capItem.deliverable.includes("##")
                                            ? capItem.deliverable.split("##").filter(Boolean)
                                            : [capItem.deliverable].filter(Boolean)
                                        : []
                                    ).map((label: string) => (
                                        <div key={label} className="flex items-center justify-between rounded-lg border p-3">
                                            <span className="text-sm">{label}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    selectedIndicatorRef.current = label;
                                                    setUploadModalOpen(true);
                                                }}
                                            >
                                                <Upload className="h-3 w-3 mr-1" /> Upload
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Uploaded files table (existing code, unchanged) */}
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">File</th>
                                            <th className="px-4 py-3 text-left font-medium">Uploaded By</th>
                                            <th className="px-4 py-3 text-left font-medium">Date</th>
                                            <th className="px-4 py-3 text-left font-medium">Size</th>
                                            <th className="px-4 py-3 text-left font-medium">Status</th>
                                            <th className="px-4 py-3 text-center font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {capItem.fileUploadedData?.map((file, idx) => {
                                            const fileSize = file.size ? (file.size / 1024).toFixed(1) + ' KB' : '—';
                                            const uploadDate = file.aiSummary?.createdAt
                                                ? new Date(file.aiSummary.createdAt).toLocaleDateString()
                                                : '—';
                                            const isVerified = file.status === 'Verified' || file.aiSummary?.status === 'final';
                                            return (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3 max-w-[220px]">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                                                            <span
                                                                className="font-medium truncate block max-w-[180px] cursor-pointer"
                                                                title={file.filename || "Unnamed"}
                                                            >
                                                                {file.filename || "Unnamed"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">—</td>   {/* Uploaded By – no field yet */}
                                                    <td className="px-4 py-3 text-muted-foreground">{uploadDate}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{fileSize}</td>
                                                    <td className="px-4 py-3">
                                                        {isVerified ? (
                                                            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                                                                <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                                                                <AlertCircle className="mr-1 h-3 w-3" /> Pending
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {/* <Button variant="ghost" size="sm" onClick={() => window.open(file.s3Link, '_blank')}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button> */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDocument(file)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = file.s3Link;
                                                            link.download = file.filename;
                                                            link.click();
                                                        }}>
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            disabled={deleting === file.filename}
                                                            onClick={() => handleDeleteDocument(file, idx)}
                                                        >
                                                            {deleting === file.filename ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Timeline */}
                    {/* <SectionCard title="Timeline Activity" subtitle="Chronological record of changes" icon={<Activity className="h-4 w-4" />}>
          <ol className="space-y-0">
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < activity.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-border" />}
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted', a.color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">{a.user}</span>{' '}
                      <span className="text-muted-foreground">{a.text}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{a.time}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </SectionCard> */}
                </div>
            </div>
            <DocumentUploadModal
                open={uploadModalOpen}
                onOpenChange={(open) => {
                    setUploadModalOpen(open);
                    if (!open) setUploadDocumentType(null);
                }}
                checklistItemId={capItem._id}
                itemTitle={capItem.item || capItem.issue}
                itemDescription={capItem.measures || ""}
                itemTheme="Policy"
                itemCategory={capItem.category}
                itemPolicy={capItem.deliverable || ""}
                itemResource={capItem.resource}
                itemSourceType={capItem.sourceType || ""}
                setReloadData={(reload) => reload && loadData()}
                documentType={selectedIndicatorRef.current}
            />

            {/* Custom Delete Confirmation Modal */}
            {confirmDelete && (
                <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete{" "}
                            <strong>{confirmDelete?.file.filename}</strong>?
                        </p>

                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                                Cancel
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirmed}
                            >
                                Delete Permanently
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </UnifiedSidebarLayout>
    );
};

export default ESGCapDetailsPage;