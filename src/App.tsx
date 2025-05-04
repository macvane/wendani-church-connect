
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
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

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
