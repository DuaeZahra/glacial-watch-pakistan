import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AlertCenter } from '@/components/dashboard/AlertCenter';

const Alerts = () => {
  return (
    <DashboardLayout 
      title="Alerts" 
      subtitle="Notification center and emergency broadcast system"
    >
      <AlertCenter />
    </DashboardLayout>
  );
};

export default Alerts;
