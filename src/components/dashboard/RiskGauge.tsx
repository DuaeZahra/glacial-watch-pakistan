import { motion } from 'framer-motion';

interface RiskGaugeProps {
  value: number; // 0-100
  size?: number;
}

export function RiskGauge({ value, size = 160 }: RiskGaugeProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle
  const offset = circumference - (value / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 70) return 'hsl(0, 85%, 55%)'; // Critical - red
    if (val >= 50) return 'hsl(35, 95%, 55%)'; // High - orange
    if (val >= 30) return 'hsl(45, 95%, 55%)'; // Moderate - yellow
    return 'hsl(155, 75%, 45%)'; // Low - green
  };

  const color = getColor(value);

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
      <svg width={size} height={size / 2 + 20} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="hsl(220, 20%, 15%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Animated progress arc */}
        <motion.path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
        
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = (tick / 100) * 180;
          const radian = (angle - 180) * (Math.PI / 180);
          const x1 = size / 2 + (radius - 20) * Math.cos(radian);
          const y1 = size / 2 + (radius - 20) * Math.sin(radian);
          const x2 = size / 2 + (radius - 8) * Math.cos(radian);
          const y2 = size / 2 + (radius - 8) * Math.sin(radian);
          
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(220, 15%, 30%)"
              strokeWidth={2}
            />
          );
        })}
      </svg>
      
      {/* Center value */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 0 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <span
          className="font-display text-4xl font-bold"
          style={{ color, textShadow: `0 0 20px ${color}` }}
        >
          {value}
        </span>
        <span className="text-muted-foreground text-lg">%</span>
      </motion.div>
    </div>
  );
}
