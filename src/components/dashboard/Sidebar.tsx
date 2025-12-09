import { motion } from 'framer-motion';
import { Map, BarChart3, Bell, Settings, Mountain, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { icon: Map, label: 'Map View', path: '/' },
  { icon: BarChart3, label: 'Lake Analytics', path: '/analytics' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: Activity, label: 'Simulation', path: '/simulation' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'h-screen flex flex-col border-r border-border/50 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
      style={{ background: 'var(--gradient-sidebar)' }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Mountain className="w-8 h-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse-glow" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="font-display font-bold text-lg tracking-wider text-foreground">
                GLOF
              </span>
              <span className="text-xs text-muted-foreground tracking-widest">
                PREDICTOR
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li
              key={item.path}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'text-muted-foreground hover:text-foreground',
                  'hover:bg-secondary/50 group',
                  collapsed && 'justify-center px-3'
                )}
                activeClassName="bg-primary/10 text-primary border border-primary/30 glow-primary"
              >
                <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                {!collapsed && (
                  <span className="font-medium text-sm tracking-wide">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Status indicator */}
      <div className={cn(
        'p-4 mx-3 mb-4 rounded-lg glass-card',
        collapsed && 'p-3 mx-2'
      )}>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-3 h-3 bg-success rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping opacity-75" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">System Active</span>
              <span className="text-xs text-muted-foreground">33 Lakes Monitored</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
}
