import { DashboardLayout } from '@/layouts/DashboardLayout';
import { FloodSimulation } from '@/components/dashboard/FloodSimulation';

const Simulation = () => {
  return (
    <DashboardLayout 
      title="Flood Simulation" 
      subtitle="3D terrain modeling and flood path visualization"
    >
      <FloodSimulation />
    </DashboardLayout>
  );
};

export default Simulation;
