
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

import ReactGA from 'react-ga4';

// Initialize Google Analytics
const GA_MEASUREMENT_ID = "G-Q3NT78RNFM"; // Replace with your Measurement ID
ReactGA.initialize(GA_MEASUREMENT_ID);

// This component will track page views
const AnalyticsTracker = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Send a pageview event every time the location changes
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsTracker />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};



export default App;
