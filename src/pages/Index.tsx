import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from './Dashboard';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Benefits from "@/components/Benefits";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If user is logged in, show dashboard
  if (!loading && user) {
    return <Dashboard />;
  }

  // Otherwise show landing page
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
    </div>
  );
};

export default Index;