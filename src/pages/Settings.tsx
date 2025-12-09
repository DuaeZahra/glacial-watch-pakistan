import { DashboardLayout } from '@/layouts/DashboardLayout';
import { SettingsPage } from '@/components/dashboard/SettingsPage';

const Settings = () => {
  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="System configuration and preferences"
    >
      <SettingsPage />
    </DashboardLayout>
  );
};

export default Settings;
