import { DashboardLayout } from '@/layouts/DashboardLayout';
import { MapView } from '@/components/dashboard/MapView';

const Index = () => {
  return (
    <DashboardLayout 
      title="Map View" 
      subtitle="Real-time glacial lake monitoring across Pakistan's northern areas"
    >
      <div className="h-[calc(100vh-8rem)] rounded-xl overflow-hidden">
        <MapView />
      </div>
    </DashboardLayout>
  );
};

export default Index;
