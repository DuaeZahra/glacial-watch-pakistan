import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

const Analytics = () => {
  return (
    <DashboardLayout 
      title="Lake Analytics" 
      subtitle="Comprehensive data analysis and risk assessment"
    >
      <AnalyticsDashboard />
    </DashboardLayout>
  );
};

export default Analytics;
