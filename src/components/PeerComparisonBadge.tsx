import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Award, CheckCircle2, RefreshCw, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeType = 'completeness' | 'consistency' | 'timeliness';

interface PeerComparisonBadgeProps {
  type: BadgeType;
  percentile: number; // 0-100
  className?: string;
}

const badgeConfig: Record<BadgeType, {
  label: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  bgGradient: string;
  glowColor: string;
}> = {
  completeness: {
    label: 'Completeness',
    description: 'How complete your KPI data is compared to peers',
    icon: CheckCircle2,
    accentColor: 'text-amber-700',
    bgGradient: 'from-amber-100 via-yellow-50 to-orange-50',
    glowColor: 'shadow-amber-300/50',
  },
  consistency: {
    label: 'Consistency',
    description: 'How consistent your data reporting is across quarters',
    icon: RefreshCw,
    accentColor: 'text-emerald-700',
    bgGradient: 'from-emerald-100 via-green-50 to-teal-50',
    glowColor: 'shadow-emerald-300/50',
  },
  timeliness: {
    label: 'Timeliness',
    description: 'How timely you submit your quarterly data',
    icon: Clock,
    accentColor: 'text-blue-700',
    bgGradient: 'from-blue-100 via-sky-50 to-indigo-50',
    glowColor: 'shadow-blue-300/50',
  },
};

const getOrdinalSuffix = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

const getPercentileLabel = (percentile: number): string => {
  if (percentile >= 90) return 'Top 10%';
  if (percentile >= 75) return 'Top 25%';
  if (percentile >= 50) return 'Top 50%';
  if (percentile >= 25) return 'Top 75%';
  return 'Improving';
};

const getPercentileTier = (percentile: number): 'gold' | 'silver' | 'bronze' | 'standard' => {
  if (percentile >= 90) return 'gold';
  if (percentile >= 75) return 'silver';
  if (percentile >= 50) return 'bronze';
  return 'standard';
};

const tierConfig: Record<'gold' | 'silver' | 'bronze' | 'standard', Record<BadgeType, {
  medalGradient: string;
  borderGradient: string;
  shine: boolean;
}>> = {
  gold: {
    completeness: { medalGradient: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500', borderGradient: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500', shine: true },
    consistency: { medalGradient: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600', borderGradient: 'bg-gradient-to-br from-emerald-300 via-green-400 to-teal-500', shine: true },
    timeliness: { medalGradient: 'bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-600', borderGradient: 'bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-500', shine: true },
  },
  silver: {
    completeness: { medalGradient: 'bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-400', borderGradient: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400', shine: true },
    consistency: { medalGradient: 'bg-gradient-to-br from-emerald-300 via-green-400 to-teal-500', borderGradient: 'bg-gradient-to-br from-emerald-200 via-green-300 to-teal-400', shine: true },
    timeliness: { medalGradient: 'bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-500', borderGradient: 'bg-gradient-to-br from-blue-200 via-sky-300 to-indigo-400', shine: true },
  },
  bronze: {
    completeness: { medalGradient: 'bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400', borderGradient: 'bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400', shine: false },
    consistency: { medalGradient: 'bg-gradient-to-br from-emerald-200 via-green-300 to-teal-400', borderGradient: 'bg-gradient-to-br from-emerald-200 via-green-300 to-teal-400', shine: false },
    timeliness: { medalGradient: 'bg-gradient-to-br from-blue-200 via-sky-300 to-indigo-400', borderGradient: 'bg-gradient-to-br from-blue-200 via-sky-300 to-indigo-400', shine: false },
  },
  standard: {
    completeness: { medalGradient: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500', borderGradient: 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600', shine: false },
    consistency: { medalGradient: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500', borderGradient: 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600', shine: false },
    timeliness: { medalGradient: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500', borderGradient: 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600', shine: false },
  },
};

export const PeerComparisonBadge = ({ type, percentile, className }: PeerComparisonBadgeProps) => {
  const config = badgeConfig[type];
  const tier = getPercentileTier(percentile);
  const tierStyle = tierConfig[tier][type];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "group relative flex flex-col items-center gap-3 p-4 rounded-2xl border border-border/50",
          "bg-gradient-to-br",
          config.bgGradient,
          "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer",
          config.glowColor,
          "hover:shadow-lg",
          className
        )}>

          {/* Medal Badge */}
          <div className="relative">
            <div className={cn(
              "absolute -inset-1 rounded-full opacity-60 blur-sm",
              tierStyle.borderGradient
            )} />
            <div className={cn(
              "relative p-1 rounded-full",
              tierStyle.borderGradient
            )}>
              <div className={cn(
                "relative w-14 h-14 rounded-full flex items-center justify-center",
                tierStyle.medalGradient,
                "shadow-inner"
              )}>
                {tierStyle.shine && (
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>
                )}
                <Icon className="w-6 h-6 text-white drop-shadow-md relative z-10" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-1.5">
            <p className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              config.accentColor
            )}>
              {config.label}
            </p>
            <p className="text-sm font-bold text-foreground">
              {percentile}{getOrdinalSuffix(percentile)} percentile
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              tierStyle.medalGradient
            )}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="font-semibold">{config.label} Score</p>
          </div>
          <p className="text-xs text-muted-foreground">{config.description}</p>
          <div className="flex items-center gap-2 pt-1 border-t">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full", tierStyle.medalGradient)}
                style={{ width: `${percentile}%` }}
              />
            </div>
            <span className="text-xs font-bold">{percentile}%</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
