import React, { useState, useEffect } from 'react';
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
import { fetchEsgCap } from '../services/esgdd';
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

    const { isAuthenticated } = useAuth();
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

                setCapItem(matchedItem || null);
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

    const initialAssignees = ['Anita Shah'];
    const [updateText, setUpdateText] = useState('');
    const [showUpdateNotes, setShowUpdateNotes] = useState(false);
    const [requestChange, setRequestChange] = useState(false);
    const [changeNote, setChangeNote] = useState('');
    const [assigneeOpen, setAssigneeOpen] = useState(false);
    const [assigneeQuery, setAssigneeQuery] = useState('');
    const [assignees, setAssignees] = useState<string[]>(initialAssignees);
    const peopleDirectory = [
        { name: 'Anita Shah', role: 'Compliance Analyst' },
        { name: 'Manoj Kapoor', role: 'Plant Operations Lead' },
        { name: 'Priya Menon', role: 'Compliance Lead' },
        { name: 'Rahul Iyer', role: 'Governance Reviewer' },
        { name: 'Sneha Rao', role: 'HR Manager' },
        { name: 'Vikram Joshi', role: 'EHS Officer' },
    ];
    const toggleAssignee = (name: string) =>
        setAssignees((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    const initialsOf = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2);
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

    if (!isAuthenticated) return <Navigate to="/login" />;
    //   if (!item) {
    //     return (
    //       <div className="mx-auto max-w-3xl py-16 text-center">
    //         <h1 className="text-2xl font-semibold">CAP item not found</h1>
    //         <Link to="/esg-dd/cap" className="mt-4 inline-flex items-center text-primary hover:underline">
    //           <ArrowLeft className="mr-1 h-4 w-4" /> Back to CAP List
    //         </Link>
    //       </div>
    //     );
    //   }

    const completionPct = Math.round(
        (Object.values(completion).filter(Boolean).length / Object.keys(completion).length) * 100
    );

    const priorityTone =
        capItem?.priority?.toLowerCase() === 'high'
            ? 'red'
            : capItem?.priority?.toLowerCase() === 'medium'
                ? 'amber'
                : 'green';

    const statusToneMap: Record<string, 'amber' | 'blue' | 'green' | 'red' | 'slate'> = {
        pending: 'amber',
        in_review: 'blue',
        in_progress: 'blue',
        accepted: 'green',
        completed: 'green',
        delayed: 'red',
    };

    const workflowSteps = [
        { label: 'Draft', status: 'done' },
        { label: 'Submitted', status: 'done' },
        { label: 'Compliance Review', status: 'current' },
        { label: 'Governance Approval', status: 'pending' },
        { label: 'Closed', status: 'pending' },
    ];

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

    const attachments = [
        { name: 'Annual_Return_FY25.pdf', user: 'Anita Shah', date: 'Aug 02, 2026', size: '1.4 MB', verified: true },
        { name: 'Factory_License_Renewal.pdf', user: 'Manoj Kapoor', date: 'Jul 28, 2026', size: '820 KB', verified: true },
        { name: 'Gratuity_Workings.xlsx', user: 'Anita Shah', date: 'Aug 04, 2026', size: '210 KB', verified: false },
    ];

    const activity = [
        { icon: Upload, color: 'text-blue-600', user: 'Anita Shah', text: 'uploaded Annual_Return_FY25.pdf', time: 'Aug 02, 2026 · 10:14' },
        { icon: MessageSquare, color: 'text-slate-600', user: 'Priya Menon', text: 'commented on the CAP', time: 'Aug 03, 2026 · 09:00' },
        { icon: Activity, color: 'text-amber-600', user: 'System', text: 'status changed to Under Review', time: 'Aug 03, 2026 · 09:02' },
        { icon: CheckCircle2, color: 'text-emerald-600', user: 'Rahul Iyer', text: 'approved the compliance section', time: 'Aug 05, 2026 · 16:40' },
    ];

    if (loading) {
        return <Loader show={undefined} />;
    }
    console.log('cap----------Item',capItem);
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
                                <h1 className="text-3xl font-bold tracking-tight">{capItem?.issue}</h1>
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
                                            {assignees.length === 0 && (
                                                <span className="px-2 text-sm text-muted-foreground">No assignees yet</span>
                                            )}
                                            {assignees.map((name) => {
                                                const person = peopleDirectory.find((p) => p.name === name);
                                                return (
                                                    <span
                                                        key={name}
                                                        className="inline-flex items-center gap-2 rounded-full border bg-background py-1 pl-1 pr-2 text-xs"
                                                    >
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarFallback className="bg-[#1E3A8A] text-[10px] text-white">
                                                                {initialsOf(name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{name}</span>
                                                        {person && <span className="text-muted-foreground">· {person.role}</span>}
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleAssignee(name)}
                                                            className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            aria-label={`Remove ${name}`}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                            <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-7 gap-1 rounded-full text-xs">
                                                        <Plus className="h-3.5 w-3.5" /> Add names or operational roles
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[320px] p-0" align="start">
                                                    <Command shouldFilter={true}>
                                                        <CommandInput
                                                            placeholder="Type a name or search directory…"
                                                            value={assigneeQuery}
                                                            onValueChange={setAssigneeQuery}
                                                        />
                                                        <CommandList>
                                                            {assigneeQuery.trim() &&
                                                                !peopleDirectory.some(
                                                                    (p) => p.name.toLowerCase() === assigneeQuery.trim().toLowerCase()
                                                                ) &&
                                                                !assignees.some(
                                                                    (n) => n.toLowerCase() === assigneeQuery.trim().toLowerCase()
                                                                ) && (
                                                                    <CommandGroup heading="Add new">
                                                                        <CommandItem
                                                                            value={`__add__${assigneeQuery}`}
                                                                            onSelect={() => {
                                                                                const name = assigneeQuery.trim();
                                                                                if (name) {
                                                                                    setAssignees((prev) => [...prev, name]);
                                                                                    setAssigneeQuery('');
                                                                                }
                                                                            }}
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <Plus className="h-4 w-4 text-[#1E3A8A]" />
                                                                            <span className="text-sm">
                                                                                Add <span className="font-medium">"{assigneeQuery.trim()}"</span>
                                                                            </span>
                                                                        </CommandItem>
                                                                    </CommandGroup>
                                                                )}
                                                            <CommandEmpty>No users found. Type a name to add.</CommandEmpty>
                                                            <CommandGroup heading="Directory">
                                                                {peopleDirectory.map((p) => {
                                                                    const selected = assignees.includes(p.name);
                                                                    return (
                                                                        <CommandItem
                                                                            key={p.name}
                                                                            value={p.name}
                                                                            onSelect={() => toggleAssignee(p.name)}
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <Avatar className="h-6 w-6">
                                                                                <AvatarFallback className="bg-muted text-[10px]">
                                                                                    {initialsOf(p.name)}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <div className="flex-1">
                                                                                <div className="text-sm font-medium">{p.name}</div>
                                                                                <div className="text-[11px] text-muted-foreground">{p.role}</div>
                                                                            </div>
                                                                            {selected && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Request Change */}
                            <div className="rounded-xl border bg-muted/30 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">Request Change</div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Triggers reviewer feedback workflow without modifying structured CAP fields
                                        </p>
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
                                const assigneesChanged =
                                    assignees.length !== initialAssignees.length ||
                                    assignees.some((a) => !initialAssignees.includes(a));
                                const hasChanges =
                                    updateText.trim().length > 0 ||
                                    (requestChange && changeNote.trim().length > 0) ||
                                    assigneesChanged;
                                if (!hasChanges) return null;
                                return (
                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#1E3A8A]/20 bg-[#1E3A8A]/5 p-4">
                                        <div className="text-xs text-muted-foreground">
                                            You have unsaved changes. Review before submitting.
                                        </div>
                                        <Button
                                            size="lg"
                                            onClick={() =>
                                                toast.success('Submitted for review', {
                                                    description: `${assignees.length} assignee(s)${requestChange ? ' · change requested' : ''
                                                        }`,
                                                })
                                            }
                                            className="h-11 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
                                        >
                                            <Send className="h-4 w-4" /> Submit for Review
                                        </Button>
                                    </div>
                                );
                            })()}
                        </div>
                    </SectionCard>

                    {/* Fireside Actions */}
                    <SectionCard
                        title="Fireside Actions"
                        subtitle="Internal review and reviewer thread"
                        icon={<MessageSquare className="h-4 w-4" />}
                        variant="muted"
                    >
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fireside Status</div>
                                {(() => {
                                    const current = firesideSteps.filter((s) => s.done).slice(-1)[0] ?? firesideSteps[0];
                                    return (
                                        <div className="mt-4 flex items-center gap-3 rounded-lg border bg-card p-4">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500 text-white">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <div className="text-sm font-semibold">{current.label}</div>
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
                            <Field label="Issue & Related Finding" value={capItem?.relatedFinding || capItem?.issue} />
                            <Field label="Measures & Corrective Actions" value={capItem.measures} />
                        </div>
                    </SectionCard>

                    {/* Completion Tracking */}
                    <SectionCard title="Completion Tracking" subtitle="Milestones and required artefacts" icon={<CheckCircle2 className="h-4 w-4" />}>
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Completion Indicators</div>
                                <ul className="mt-4 space-y-3">
                                    {capItem.deliverable.split("##").filter(Boolean).map((label) => (
                                        <li key={label} className="flex items-center justify-between rounded-lg border bg-card p-3">
                                            <label className="flex items-center gap-3 text-sm">
                                                <Checkbox
                                                    checked={completion[label]}
                                                    onCheckedChange={(v) => setCompletion((prev) => ({ ...prev, [label]: !!v }))}
                                                />
                                                {label}
                                            </label>
                                            <Badge
                                                variant="outline"
                                                className={completion[label] ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-amber-300 text-amber-700 bg-amber-50'}
                                            >
                                                {completion[label] ? 'Complete' : 'Pending'}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Guidance & Resources</div>
                                <ul className="mt-4 space-y-3">
                                    {[
                                        'Annual Return Filing Guide',
                                        'Factories Act Compliance Checklist',
                                        'Labour Welfare Filing SOP',
                                        'Gratuity Computation Template',
                                    ].map((r) => (
                                        <li key={r} className="flex items-center justify-between rounded-lg border bg-card p-3">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                                <a href="#" className="text-primary hover:underline">{r}</a>
                                            </div>
                                            <Badge variant="outline" className="text-xs">Reference</Badge>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <Field label="Submission Date" value="Jul 12, 2026" />
                            <Field label="Target Date" value={capItem?.targetDate ? new Date(capItem.targetDate).toLocaleDateString() : 'Pending'} />
                            <Field label="Actual Completion" value={capItem?.actualDate ? new Date(capItem.actualDate).toLocaleDateString() : 'Pending'} />
                            <Field label="Last Review Date" value={capItem?.lastReviewDate ? new Date(capItem.lastReviewDate).toLocaleDateString() : 'Pending'} />
                            <Field label="Closure Verified By" value={capItem?.closureVerifiedBy || 'Pending'} />
                        </div>
                    </SectionCard>

                    {/* Attachments & Evidence (Modal) */}
                    <Dialog open={attachmentsOpen} onOpenChange={setAttachmentsOpen}>
                        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    {attachmentsMode === 'upload' ? 'Upload Document' : 'View Documents'}
                                </DialogTitle>
                                <DialogDescription>
                                    {attachmentsMode === 'upload'
                                        ? 'Attach evidence files supporting this CAP item.'
                                        : 'All documents attached to this CAP item.'}
                                </DialogDescription>
                            </DialogHeader>

                            {attachmentsMode === 'upload' && (
                                <div className="rounded-xl border-2 border-dashed bg-muted/30 p-8 text-center">
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <p className="mt-2 text-sm font-medium">Drag & drop files to upload</p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX up to 20MB</p>
                                    <Button className="mt-4" variant="outline" onClick={() => toast.success('File picker opened')}>
                                        Browse Files
                                    </Button>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">File</th>
                                            <th className="px-4 py-3 text-left font-medium">Uploaded By</th>
                                            <th className="px-4 py-3 text-left font-medium">Date</th>
                                            <th className="px-4 py-3 text-left font-medium">Size</th>
                                            <th className="px-4 py-3 text-left font-medium">Status</th>
                                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attachments.map((a) => (
                                            <tr key={a.name} className="border-t hover:bg-muted/20">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium">{a.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{a.user}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{a.date}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{a.size}</td>
                                                <td className="px-4 py-3">
                                                    {a.verified ? (
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
                                                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Viewing ${a.name}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading ${a.name}`)}>
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
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
        </UnifiedSidebarLayout>
    );
};

export default ESGCapDetailsPage;