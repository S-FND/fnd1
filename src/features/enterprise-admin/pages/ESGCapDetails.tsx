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
import DocumentSummaryDialog from '../components/esg-cap/document-summary-review';

import { httpClient } from "@/lib/httpClient";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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
                setChangeNote(matchedItem?.requestChange || '');
                setUpdateText(matchedItem?.UpdateNote || '');
                if (matchedItem?.fileUploadedData) {
                    const responses: Record<string, 'yes' | 'no' | null> = {};
                    const notes: Record<string, string> = {};
                    matchedItem.fileUploadedData.forEach((entry: any) => {
                        const label = entry.indicatorLabel?.trim();
                        if (!label) return;
                        if (entry.indicatorResponse === 'no') {
                            responses[label] = 'no';
                            if (entry.indicatorNote) notes[label] = entry.indicatorNote;
                        } else if (entry.filename) {
                            // Has a file uploaded -> treat as 'yes'
                            responses[label] = 'yes';
                            // Optionally, you could store a note from the file entry if any
                            if (entry.indicatorNote) notes[label] = entry.indicatorNote;
                        }
                    });
                    setIndicatorResponse(responses);
                    setIndicatorNotes(notes);
                }
                if (
                    matchedItem &&
                    !matchedItem.aiInsights &&
                    !matchedItem.aiProcessed
                ) {
                    await generateAiInsights();
                }
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

    useEffect(() => {
        loadData();
    }, [id, itemName]);

    const generateAiInsights = async () => {
        try {
            await httpClient.post('esgdd/escap/generate-ai-insight', {
                entityId,
                itemName: decodeURIComponent(itemName || ''),
            });

            await loadData();
        } catch (error) {
            console.error(error);
        }
    };

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
    const [indicatorResponse, setIndicatorResponse] = useState<Record<string, 'yes' | 'no' | null>>({});
    const [indicatorNotes, setIndicatorNotes] = useState<Record<string, string>>({});
    const [currentIndicatorResponse, setCurrentIndicatorResponse] = useState<'yes' | 'no' | null>(null);
    const [currentIndicatorNote, setCurrentIndicatorNote] = useState<string>('');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
    const [reopenAttachments, setReopenAttachments] = useState(false);

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

    const investorEmailStored = localStorage.getItem("fandoro-admin");
    const isInvestorEmailExists = !!investorEmailStored;

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
                        item.reportId === capItem?.reportId &&
                        item.item === capItem?.item
                    ) {
                        return {
                            ...item,
                            assignedTo: assigneeText?.trim(),
                            UpdateNote: updateText?.trim(),
                            requestChange: changeNote?.trim(),
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
                    item.reportId === capItem?.reportId &&
                        item.item === capItem?.item
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
                    reason: 'Founder edited the finalized plan',
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
        console.log('this is hit ');
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
            (file: any) => file.indicatorLabel === indicatorLabel
        );
    };

    const latestUploadedAt = capItem?.completionIndicators
        ?.filter(
            (item: any) =>
                item?.fileUploadUrl &&
                item?.uploadedAt
        )
        ?.sort(
            (a: any, b: any) =>
                new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime()
        )?.[0]?.uploadedAt;
    if (loading) {
        return (
            <UnifiedSidebarLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg font-medium text-muted-foreground animate-pulse">
                            Please wait...
                        </p>
                    </div>
                </div>
            </UnifiedSidebarLayout>
        );
    }

    console.log("changeNote:", capItem);
    return (
        <UnifiedSidebarLayout>
            <div className="min-h-screen bg-[hsl(220_25%_97%)] dark:bg-background">
                <div className="mx-auto max-w-[1440px] px-6 py-8 space-y-6">
                    {/* Header */}
                    <div>

                        <div className="mt-3 flex flex-wrap items-start justify-between gap-4 item">
                            <div>
                                <h5 className="text-3xl font-bold text-left tracking-tight">{capItem?.item}</h5>
                                {/* <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{capItem?.description}</p> */}
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <MetaPill label={capItem?.dealCondition} tone="slate" />
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
                                {/* <Button variant="outline">
                                    <Download className="h-4 w-4" /> Export
                                </Button> */}
                                <Link
                                    to="/esg-dd/cap"
                                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back
                                </Link>
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
                                        <div className="relative group flex items-center gap-1 w-fit">
                                            <div className="text-sm font-semibold text-foreground">
                                                Request Change
                                            </div>

                                            <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />

                                            <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50">
                                                <div className="inline-block w-fit whitespace-nowrap rounded-md bg-white text-black text-xs px-3 py-2 shadow-lg">
                                                    Make request changes for CAP items like timeline, completion indicators, CP/CS status, etc.
                                                </div>
                                            </div>
                                        </div>
                                        {capItem?.comment === 'Change-Request' && (
                                            <div className="mt-2 space-y-2">
                                                <Badge
                                                    variant="outline"
                                                    className="border-amber-300 bg-amber-50 text-amber-700"
                                                >
                                                    Change Requested
                                                </Badge>

                                                <p className="text-xs text-muted-foreground">
                                                    {capItem?.requestChange ||
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
                        title={!isInvestorEmailExists ? "Investor Action" : "Fireside Action"}
                        subtitle="Internal review and reviewer thread"
                        icon={<MessageSquare className="h-4 w-4" />}
                        variant="muted"
                    >
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{!isInvestorEmailExists ? "Investor Status" : "Fireside Status"}</div>
                                {(() => {
                                    const current = firesideSteps.filter((s) => s.done).slice(-1)[0] ?? firesideSteps[0];
                                    return (
                                        <div className="mt-4 flex items-center gap-3 rounded-lg border bg-card p-4">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500 text-white">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <div className="text-sm font-semibold">{capItem?.investorStatus}</div>
                                                {/* <div className="text-xs text-muted-foreground">{capItem?.lastReviewDate}</div> */}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Review Comment
                                </div>

                                <div className="mt-4">
                                    <div className="flex gap-3">
                                        <Avatar className="h-9 w-9">
                                            {/* <AvatarFallback>
                                                {(capItem?.assignedTo || "NA")
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback> */}
                                        </Avatar>

                                        <div className="flex-1 rounded-lg border bg-muted/30 p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-muted-foreground">
                                                    <p className="mt-1 text-sm text-foreground/90">
                                                        {capItem?.reviewRemarks || "No review remarks available"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Reference Details */}
                    <SectionCard title="Reference Details" subtitle="Finding context and corrective measures" icon={<Info className="h-4 w-4" />}>
                        <div className="space-y-6 text-left">
                            <Field label="Issue & Related Finding" value={capItem?.issue} />
                            <Field label="Measures & Corrective Actions" value={capItem?.measures} />
                        </div>
                    </SectionCard>

                    {/* Completion Tracking */}
                    <SectionCard
                        title="Completion Tracking"
                        subtitle="Milestones and required artefacts"
                        icon={<CheckCircle2 className="h-4 w-4" />}
                    >
                        <div className="space-y-6">

                            {(capItem?.completionIndicators || []).map((i: any, idx: number) => {

                                const matched = capItem?.fileUploadedData?.find(
                                    (f: any) =>
                                        f?.indicatorLabel?.trim()?.toLowerCase() ===
                                        i?.indicatorLabel?.trim()?.toLowerCase()
                                );

                                const hasDoc = matched?.indicatorResponse !== 'no' && matched?.s3Link;
                                const isNo = matched?.indicatorResponse === 'no';
                                const note = matched?.indicatorNote;

                                return (
                                    <div key={idx} className="space-y-4">

                                        {/* ROW */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            {/* LEFT */}
                                            <div className="rounded-lg border bg-card p-3">

                                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Completion Indicator
                                                </div>

                                                <div className="mt-1 text-sm font-medium">
                                                    {i.indicatorLabel || '-'}
                                                </div>

                                                {/* BADGES */}
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {hasDoc && (
                                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Document Uploaded
                                                        </Badge>
                                                    )}

                                                    {isNo && (
                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                                                                Response Uploaded
                                                            </Badge>

                                                            {note && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Note: {note}
                                                                </span>
                                                            )}

                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="rounded-lg border bg-card p-3">
                                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Guidance & Resources
                                                </div>

                                                <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {i.guidanceResources || '-'}
                                                </div>
                                            </div>

                                        </div>

                                        {/* SEPARATOR */}
                                        {idx < capItem?.completionIndicators?.length - 1 && (
                                            <Separator />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* FOOTER META */}
                        <Separator className="my-6" />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <Field label="Submission Date" value={latestUploadedAt
                                ? new Date(latestUploadedAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })
                                : '—'} />
                            <Field label="Target Date" value={capItem?.targetDate ? new Date(capItem?.targetDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            }) : 'Pending'} />
                            <Field label="Actual Completion" value={capItem?.actualDate ? new Date(capItem?.actualDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            }) : 'Pending'} />
                            <Field label="Last Review Date" value={capItem?.lastReviewDate ? new Date(capItem?.lastReviewDate).toLocaleDateString('en-GB', {
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
                                        ? capItem?.deliverable.includes("##")
                                            ? capItem?.deliverable.split("##").filter(Boolean)
                                            : [capItem?.deliverable].filter(Boolean)
                                        : []
                                    ).map((rawLabel: string) => {
                                        const label = rawLabel.trim();
                                        const response = indicatorResponse[label];
                                        console.log(`Label: "${label}", Response:`, indicatorResponse[label], "Note:", indicatorNotes[label]);
                                        return (
                                            <div key={label} className="rounded-lg border p-3">
                                                <div className="text-sm font-medium mb-3">{label}</div>

                                                {/* 2-column layout */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

                                                    {/* LEFT: YES / NO */}
                                                    <div className="flex gap-4 items-center">
                                                        <label className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="radio"
                                                                name={`indicator-${label}`}
                                                                checked={response === 'yes'}
                                                                onChange={() =>
                                                                    setIndicatorResponse((prev) => ({
                                                                        ...prev,
                                                                        [label]: 'yes',
                                                                    }))
                                                                }
                                                            />
                                                            Yes
                                                        </label>

                                                        <label className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="radio"
                                                                name={`indicator-${label}`}
                                                                checked={response === 'no'}
                                                                onChange={() =>
                                                                    setIndicatorResponse((prev) => ({
                                                                        ...prev,
                                                                        [label]: 'no',
                                                                    }))
                                                                }
                                                            />
                                                            No
                                                        </label>
                                                    </div>

                                                    {/* RIGHT: CONDITIONAL UI */}
                                                    <div className="flex flex-col gap-2">

                                                        {response === 'yes' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    selectedIndicatorRef.current = label;
                                                                    setCurrentIndicatorResponse(indicatorResponse[label] || 'yes');
                                                                    setCurrentIndicatorNote(indicatorNotes[label] || '');
                                                                    setUploadModalOpen(true);
                                                                }}
                                                                className="w-fit"
                                                            >
                                                                <Upload className="h-3 w-3 mr-1" />
                                                                Upload Document
                                                            </Button>
                                                        )}

                                                        {response === 'no' && (
                                                            <div className="flex flex-col gap-2">
                                                                <Textarea
                                                                    placeholder="Provide Details..."
                                                                    value={indicatorNotes[label] || ''}
                                                                    onChange={(e) =>
                                                                        setIndicatorNotes((prev) => ({ ...prev, [label]: e.target.value }))
                                                                    }
                                                                    className="min-h-[80px]"
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={async () => {
                                                                        try {
                                                                            // Build FormData without a file
                                                                            const formData = new FormData();
                                                                            formData.append("itemTitle", capItem?.item || capItem?.issue);
                                                                            formData.append("itemDescription", capItem?.measures || "");
                                                                            formData.append("itemTheme", "Policy");
                                                                            formData.append("itemCategory", capItem?.category);
                                                                            formData.append("itemPolicy", capItem?.deliverable || "");
                                                                            formData.append("itemResource", capItem?.resource || "");
                                                                            formData.append("itemSourceType", capItem?.sourceType || "");
                                                                            formData.append("indicatorLabel", label); // indicator label
                                                                            formData.append("indicatorResponse", "no");
                                                                            formData.append("indicatorNote", indicatorNotes[label] || "");

                                                                            await httpClient.post("esgdd/escap/upload-file/esgcap", formData);
                                                                            toast.success("Indicator response saved");
                                                                            await loadData(); // refresh to show saved status
                                                                        } catch (error) {
                                                                            console.error(error);
                                                                            toast.error("Failed to save response");
                                                                        }
                                                                    }}
                                                                    className="w-fit"
                                                                >
                                                                    Save Response
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Uploaded files table (existing code, unchanged) */}
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Indicator</th>
                                            <th className="px-4 py-3 text-left font-medium">File / Note</th>
                                            <th className="px-4 py-3 text-center font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {capItem?.fileUploadedData?.map((file: any, idx: number) => {

                                            // NO response row
                                            if (file?.indicatorResponse === "no") {
                                                return null;
                                            }

                                            return (
                                                <tr key={`file-${idx}`}>

                                                    {/* Indicator */}
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium">
                                                            {file?.indicatorLabel || '—'}
                                                        </div>
                                                    </td>

                                                    {/* File */}
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

                                                    {/* Actions */}
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-2">

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    // Close the attachments modal first
                                                                    setAttachmentsOpen(false);
                                                                    // Remember to reopen it later
                                                                    setReopenAttachments(true);
                                                                    // Prepare files and open summary dialog
                                                                    const docsForSameIndicator = capItem?.fileUploadedData.filter(
                                                                        (f: any) => f.indicatorLabel === file.indicatorLabel
                                                                    );
                                                                    setSelectedFiles(docsForSameIndicator.length ? docsForSameIndicator : [file]);
                                                                    setIsDownloadOpen(true);
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const link = document.createElement('a');
                                                                    link.href = file.s3Link;
                                                                    link.download = file.filename;
                                                                    link.click();
                                                                }}
                                                            >
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

                                                        </div>
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
                    if (!open) {
                        setUploadDocumentType(null);
                        setCurrentIndicatorResponse(null);
                        setCurrentIndicatorNote('');
                    }
                }}
                checklistItemId={capItem?._id}
                itemTitle={capItem?.item || capItem?.issue}
                itemDescription={capItem?.measures || ""}
                itemTheme="Policy"
                itemCategory={capItem?.category}
                itemPolicy={capItem?.deliverable || ""}
                itemResource={capItem?.resource}
                itemSourceType={capItem?.sourceType || ""}
                setReloadData={(reload) => reload && loadData()}
                indicatorLabel={selectedIndicatorRef.current}
            />

            <DocumentSummaryDialog
                open={isDownloadOpen}
                files={selectedFiles}
                onClose={() => {
                    setIsDownloadOpen(false);
                    setSelectedFiles([]);
                    if (reopenAttachments) {
                        setAttachmentsOpen(true);
                        setReopenAttachments(false);
                    }
                }}
            />

            {/* Custom Delete Confirmation Modal */}
            {confirmDelete && (
                <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete{" "}?
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <strong className="inline-block max-w-[400px] truncate cursor-pointer">
                                            {confirmDelete?.file.filename}
                                        </strong>
                                    </TooltipTrigger>

                                    <TooltipContent className="max-w-sm break-all">
                                        {confirmDelete?.file.filename}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
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