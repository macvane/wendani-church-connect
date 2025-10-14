
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useState } from "react";
import ScrollToTop from "./components/layout/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Media from "./pages/Media";
import Events from "./pages/Events";
import Prayer from "./pages/Prayer";
import Contact from "./pages/Contact";
import Downloads from "./pages/Downloads";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import ChildDedication from "./pages/ChildDedication";
import Benevolence from "./pages/Benevolence";
import Library from "./pages/Library";
import Baptism from "./pages/Baptism";
import NotFound from "./pages/NotFound";
import Donate from "./pages/Donate";
import MembershipTransfer from "./pages/MembershipTransfer";
import ThankYou from "./pages/ThankYou";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardOverview from "./pages/admin/DashboardOverview";
import PrayersPage from "./pages/admin/PrayersPage";
import BlogManagementPage from "./pages/admin/BlogManagementPage";
import AnnouncementsPage from "./pages/admin/AnnouncementsPage";
import EventsPage from "./pages/admin/EventsPage";
import ContactsPage from "./pages/admin/ContactsPage";
import BaptismRequestsPage from "./pages/admin/BaptismRequestsPage";
import DedicationsPage from "./pages/admin/DedicationsPage";
import MembershipTransfersPage from "./pages/admin/MembershipTransfersPage";
import BenevolencePage from "./pages/admin/BenevolencePage";
import UsersPage from "./pages/admin/UsersPage";

import ProtectedRoute from "./pages/admin/ProtectedRoute";



const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/media" element={<Media />} />
            <Route path="/events" element={<Events />} />
            <Route path="/prayer" element={<Prayer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/child-dedication" element={<ChildDedication />} />
            <Route path="/benevolence" element={<Benevolence />} />
            <Route path="/library" element={<Library />} />
            <Route path="/baptism" element={<Baptism />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/membership-transfer" element={<MembershipTransfer />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/unauthorized" element={<div>Access Denied</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />}>
                <Route index element={<DashboardOverview />} />
                <Route path="prayers" element={<PrayersPage />} />
                <Route path="baptisms" element={<BaptismRequestsPage />} />
                <Route path="dedications" element={<DedicationsPage />} />
                <Route path="memberships" element={<MembershipTransfersPage />} />
                <Route path="benevolence" element={<BenevolencePage />} />
                <Route path="blogs" element={<BlogManagementPage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="contacts" element={<ContactsPage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};



export default App;
