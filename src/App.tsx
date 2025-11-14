import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Depreciation from "./pages/(tools)/depreciation";
import Invoicing from "./pages/(tools)/invoicing";
import Attendance from "./pages/(tools)/attendance";
import Recruitment from "./pages/(tools)/recruitment";
import Tickets from "./pages/(tools)/tickets";
import Subscriptions from "./pages/(tools)/subscriptions";
import Assets from "./pages/(tools)/assets";
import ShopIncomeExpense from "./pages/(tools)/shop-income-expense";
import Inventory from "./pages/(tools)/inventory";
import CRM from "./pages/(tools)/crm";
import Marketing from "./pages/(tools)/marketing";
import PersonalExpense from "./pages/(tools)/personal-expense";
import Contact from "./pages/(tools)/contact";
import Admin from "./pages/admin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import InitializeAdmin from "./pages/InitializeAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/initialize-admin" element={<InitializeAdmin />} />
          <Route path="/tools/depreciation" element={<Depreciation />} />
          <Route path="/tools/invoicing" element={<Invoicing />} />
          <Route path="/tools/attendance" element={<Attendance />} />
          <Route path="/tools/recruitment" element={<Recruitment />} />
          <Route path="/tools/tickets" element={<Tickets />} />
          <Route path="/tools/subscriptions" element={<Subscriptions />} />
          <Route path="/tools/assets" element={<Assets />} />
          <Route path="/tools/shop-income-expense" element={<ShopIncomeExpense />} />
          <Route path="/tools/inventory" element={<Inventory />} />
          <Route path="/tools/crm" element={<CRM />} />
          <Route path="/tools/marketing" element={<Marketing />} />
          <Route path="/tools/personal-expense" element={<PersonalExpense />} />
          <Route path="/tools/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
