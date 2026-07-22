import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    ShieldAlert,
    TrendingUp
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ComplianceSummary {
    dueThisMonthItems: number;
    totalCSItems: number;
    completedItems: number;
    overdueItems: number;
    partlySubmittedItems: number;
    upcomingItems: number;
    resubmitRequiredItems: number;
}

interface ComplianceScore {
    overallScore: number;
    status: string;
    highPriorityRiskFlag: boolean;
    summary: ComplianceSummary;
}

interface Props {
    score: ComplianceScore;
}

const getStatusColor = (score: number) => {
    if (score >= 81)
        return {
            badge: "bg-green-600",
            progress: "bg-green-500"
        };

    if (score >= 61)
        return {
            badge: "bg-blue-600",
            progress: "bg-blue-500"
        };

    if (score >= 41)
        return {
            badge: "bg-yellow-500",
            progress: "bg-yellow-500"
        };

    if (score >= 21)
        return {
            badge: "bg-orange-500",
            progress: "bg-orange-500"
        };

    return {
        badge: "bg-red-600",
        progress: "bg-red-600"
    };
};

export default function ComplianceScoreCard({
    score
}: Props) {

    const color = getStatusColor(score.overallScore);

    return (
        <Card className="mb-6 shadow-sm border">

            <CardContent className="p-4">

                <div className="flex flex-col lg:flex-row justify-between gap-4 items-center">

                    <div className="w-full lg:w-[42%]">

                        <div className="flex items-center gap-2">

                            <TrendingUp className="h-5 w-5 text-primary" />

                            <h2 className="text-lg font-semibold">
                                ESG Compliance Health
                            </h2>

                        </div>

                        <div className="mt-5 flex items-end gap-3">

                            <span className="text-5xl font-bold leading-none">
                                {score.overallScore.toFixed(1)}
                            </span>

                            <span className="text-2xl text-muted-foreground mb-2">
                                %
                            </span>

                        </div>

                        <Progress
                            value={score.overallScore}
                            className="mt-5 h-3"
                        />

                        {score.highPriorityRiskFlag && (

                            <div className="mt-5 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 p-3">

                                <ShieldAlert className="text-red-600 h-5 w-5" />

                                <span className="text-red-700 font-medium">
                                    High Priority Compliance Risks detected
                                </span>

                            </div>

                        )}

                    </div>

                    <div className="grid w-full lg:w-[55%] grid-cols-3 gap-3">

                        <StatCard
                            title="Total CS"
                            value={score.summary.totalCSItems}
                            color="text-slate-700"
                        />

                        <StatCard
                            title="Completed"
                            value={score.summary.completedItems}
                            color="text-green-600"
                            icon={<CheckCircle2 size={18} />}
                        />

                        <StatCard
                            title="Overdue"
                            value={score.summary.overdueItems}
                            color="text-red-600"
                            icon={<AlertTriangle size={18} />}
                        />

                        <StatCard
                            title="Due This Month"
                            value={score.summary.dueThisMonthItems}
                            color="text-amber-600"
                        />

                        <StatCard
                            title="Partly Submitted"
                            value={score.summary.partlySubmittedItems}
                            color="text-orange-500"
                        />

                        <StatCard
                            title="Resubmit"
                            value={score.summary.resubmitRequiredItems}
                            color="text-yellow-600"
                        />

                        <StatCard
                            title="Upcoming"
                            value={score.summary.upcomingItems}
                            color="text-blue-600"
                            icon={<Clock3 size={18} />}
                        />

                        

                    </div>

                </div>

            </CardContent>

        </Card>
    );
}

interface StatProps {
    title: string;
    value: number;
    color: string;
    icon?: React.ReactNode;
}

function StatCard({
    title,
    value,
    color,
    icon
}: StatProps) {

    return (

        <div className="rounded-lg border bg-muted/30 p-4">

            <div className="flex justify-between">

                <span className="text-sm text-muted-foreground">

                    {title}

                </span>

                {icon}

            </div>

            <div className={`mt-2 text-3xl font-bold ${color}`}>
                {value}
            </div>

        </div>

    );
}