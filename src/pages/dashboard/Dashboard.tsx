import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Dashboard = () => {
  const { profile } = useAuth();
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground">
          Welcome, {profile.full_name}! Your dashboard will be available here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;