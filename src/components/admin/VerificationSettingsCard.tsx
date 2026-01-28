import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, FileText, BarChart3, Target, Flame, Zap, Truck, Leaf } from 'lucide-react';
import { useVerificationSettings, ModuleVerificationConfig } from '@/hooks/useVerificationSettings';
import { Separator } from '@/components/ui/separator';

interface ModuleToggleProps {
  id: keyof ModuleVerificationConfig;
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onToggle: (id: keyof ModuleVerificationConfig, value: boolean) => void;
}

const ModuleToggle: React.FC<ModuleToggleProps> = ({
  id,
  label,
  description,
  icon,
  checked,
  onToggle,
}) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-muted">{icon}</div>
      <div>
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={(value) => onToggle(id, value)}
    />
  </div>
);

export const VerificationSettingsCard: React.FC = () => {
  const { config, loading, updateConfig } = useVerificationSettings();

  const handleToggle = (id: keyof ModuleVerificationConfig, value: boolean) => {
    updateConfig({ [id]: value });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Verification Settings</CardTitle>
        </div>
        <CardDescription>
          Enable verification workflow for specific modules. When enabled, all data submitted 
          under these modules will require approval from a designated verifier before being finalized.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {/* ESG Modules */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            ESG Modules
          </h4>
          <ModuleToggle
            id="esms"
            label="ESMS"
            description="Environmental & Social Management System documents"
            icon={<FileText className="h-4 w-4" />}
            checked={config.esms}
            onToggle={handleToggle}
          />
          <ModuleToggle
            id="esgMetrics"
            label="ESG Metrics"
            description="ESG performance metrics and data entries"
            icon={<BarChart3 className="h-4 w-4" />}
            checked={config.esgMetrics}
            onToggle={handleToggle}
          />
          <ModuleToggle
            id="sdg"
            label="SDG"
            description="Sustainable Development Goals tracking"
            icon={<Target className="h-4 w-4" />}
            checked={config.sdg}
            onToggle={handleToggle}
          />
        </div>

        <Separator className="my-4" />

        {/* GHG Accounting */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            GHG Accounting
          </h4>
          <ModuleToggle
            id="ghgScope1"
            label="Scope 1"
            description="Direct emissions from owned or controlled sources"
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            checked={config.ghgScope1}
            onToggle={handleToggle}
          />
          <ModuleToggle
            id="ghgScope2"
            label="Scope 2"
            description="Indirect emissions from purchased energy"
            icon={<Zap className="h-4 w-4 text-yellow-500" />}
            checked={config.ghgScope2}
            onToggle={handleToggle}
          />
          <ModuleToggle
            id="ghgScope3"
            label="Scope 3"
            description="All other indirect emissions in value chain"
            icon={<Truck className="h-4 w-4 text-blue-500" />}
            checked={config.ghgScope3}
            onToggle={handleToggle}
          />
          <ModuleToggle
            id="ghgScope4"
            label="Scope 4"
            description="Avoided emissions outside value chain"
            icon={<Leaf className="h-4 w-4 text-green-500" />}
            checked={config.ghgScope4}
            onToggle={handleToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};