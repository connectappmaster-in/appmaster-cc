import Navbar from "@/components/Navbar";

const OpportunitiesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Opportunities</h1>
        <p className="text-muted-foreground">Track sales opportunities.</p>
      </main>
    </div>
  );
};

export default OpportunitiesPage;
