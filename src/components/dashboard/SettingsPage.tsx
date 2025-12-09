import { motion } from 'framer-motion';
import { Bell, Satellite, MessageSquare, Shield, Database, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function SettingsPage() {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure alert thresholds and channels</p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingRow
            label="Critical Alert SMS"
            description="Send SMS to emergency contacts for critical alerts"
            defaultChecked={true}
          />
          <SettingRow
            label="Daily Digest Email"
            description="Receive daily summary of all monitored lakes"
            defaultChecked={true}
          />
          <SettingRow
            label="Rapid Expansion Alerts"
            description="Notify when lake area increases by more than 5%"
            defaultChecked={true}
          />
          <SettingRow
            label="Weather Integration"
            description="Include weather warnings in alert analysis"
            defaultChecked={false}
          />
        </div>
      </motion.div>

      {/* Satellite Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-glacier/10 border border-glacier/30">
            <Satellite className="w-5 h-5 text-glacier" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Satellite Data</h3>
            <p className="text-sm text-muted-foreground">Configure satellite imagery sources</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Primary Source</Label>
            <Input
              defaultValue="Sentinel-2"
              className="bg-secondary/50 border-border/50"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Update Frequency</Label>
            <Input
              defaultValue="Every 5 days"
              className="bg-secondary/50 border-border/50"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Resolution</Label>
            <Input
              defaultValue="10m"
              className="bg-secondary/50 border-border/50"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Cloud Cover Threshold</Label>
            <Input
              defaultValue="< 20%"
              className="bg-secondary/50 border-border/50"
              readOnly
            />
          </div>
        </div>
      </motion.div>

      {/* SMS Gateway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-warning/10 border border-warning/30">
            <MessageSquare className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">SMS Gateway</h3>
            <p className="text-sm text-muted-foreground">Emergency broadcast configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Gateway Provider</Label>
            <Input
              defaultValue="Telenor Pakistan"
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">API Endpoint</Label>
            <Input
              defaultValue="https://api.telenor.pk/sms"
              className="bg-secondary/50 border-border/50"
            />
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-sm text-success font-medium">Gateway Connected</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last broadcast: 2 days ago to 35,420 recipients
          </p>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">Access control and audit settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingRow
            label="Two-Factor Authentication"
            description="Require 2FA for all admin actions"
            defaultChecked={true}
          />
          <SettingRow
            label="Audit Logging"
            description="Log all user actions and system events"
            defaultChecked={true}
          />
          <SettingRow
            label="API Rate Limiting"
            description="Limit external API requests to prevent abuse"
            defaultChecked={true}
          />
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-border/50">
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description: string;
  defaultChecked: boolean;
}

function SettingRow({ label, description, defaultChecked }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
