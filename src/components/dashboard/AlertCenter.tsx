import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Send, Clock, MapPin } from 'lucide-react';
import { recentAlerts, Alert } from '@/data/lakes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export function AlertCenter() {
  const [alerts, setAlerts] = useState<Alert[]>(recentAlerts);

  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertTriangle,
          bgClass: 'bg-destructive/10 border-destructive/30',
          iconClass: 'text-destructive',
          badge: 'bg-destructive text-destructive-foreground',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgClass: 'bg-warning/10 border-warning/30',
          iconClass: 'text-warning',
          badge: 'bg-warning text-warning-foreground',
        };
      default:
        return {
          icon: Info,
          bgClass: 'bg-primary/10 border-primary/30',
          iconClass: 'text-primary',
          badge: 'bg-primary text-primary-foreground',
        };
    }
  };

  const handleBroadcastSMS = () => {
    toast.success('Emergency SMS broadcast initiated', {
      description: 'Alerts being sent to 35,000+ residents in downstream communities.',
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground tracking-wide">
            Alert Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {alerts.filter(a => !a.isRead).length} unread alerts
          </p>
        </div>
        <Button
          onClick={handleBroadcastSMS}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
        >
          <Send className="w-4 h-4" />
          Broadcast SMS
        </Button>
      </div>

      {/* Alert filters */}
      <div className="flex gap-2 mb-4">
        {['All', 'Critical', 'Warning', 'Info'].map((filter) => (
          <button
            key={filter}
            className="px-3 py-1.5 text-xs font-medium rounded-full border border-border/50 hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin pr-2">
        {alerts.map((alert, index) => {
          const style = getAlertStyle(alert.type);
          const Icon = style.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${style.bgClass} ${!alert.isRead ? 'ring-1 ring-primary/30 ring-offset-1 ring-offset-background' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${style.bgClass}`}>
                  <Icon className={`w-5 h-5 ${style.iconClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {alert.type.toUpperCase()}
                    </span>
                    {!alert.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alert.lakeName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
