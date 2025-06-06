
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { File, Download, FileText, Eye, BookOpen, Users, GraduationCap, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Sample documents data with view URLs
const downloads = [
  {
    id: 1,
    title: "Weekly Church Announcements",
    description: "The most recent bulletin with announcements, upcoming events, and church activities.",
    date: "June 06, 2025",
    type: "PDF",
    fileSize: "1.2 MB",
    url: "https://docs.google.com/presentation/d/13nnbHdfIszqeC9xHcA5I_uibJH6DW8gi/embed?start=false&loop=false&delayms=3000",
    viewUrl: "https://docs.google.com/presentation/d/13nnbHdfIszqeC9xHcA5I_uibJH6DW8gi/embed?start=false&loop=false&delayms=3000",
  },
  {
    id: 2,
    title: "Church Manual",
    description: "The official church constitution and bylaws that govern our church operations.",
    date: "January 15, 2024",
    type: "PDF",
    fileSize: "3.5 MB",
    url: "https://www.adventist.org/wp-content/uploads/2023/07/2022-Seventh-day-Adventist-Church-Manual.pdf",
    viewUrl: "https://www.adventist.org/wp-content/uploads/2023/07/2022-Seventh-day-Adventist-Church-Manual.pdf",
  }
];

// Sabbath School materials data
const sabbathSchoolMaterials = [
  {
    id: 1,
    title: "Cornerstone Connections",
    description: "Weekly Sabbath School lessons designed specifically for youth and young adults.",
    quarter: "Q2 2025",
    type: "PDF",
    fileSize: "2.1 MB",
    icon: Users,
    color: "text-blue-500",
    url: "https://www.cornerstoneconnections.net/lessons",
    viewUrl: "https://www.cornerstoneconnections.net/lessons",
  },
  {
    id: 2,
    title: "Adult Sabbath School Lesson",
    description: "Standard adult quarterly with weekly lessons and daily study guides.",
    quarter: "Q2 2025 - The Gospel of John",
    type: "PDF",
    fileSize: "3.2 MB",
    icon: BookOpen,
    color: "text-green-500",
    url: "https://www.adultbiblestudyguide.org/pdf.php?file=2025:2Q:SE:PDFs:EAQ225_11.pdf",
    viewUrl: "https://www.adultbiblestudyguide.org/pdf.php?file=2025:2Q:SE:PDFs:EAQ225_11.pdf",
  },
  {
    id: 3,
    title: "Sabbath School Teacher's Guide",
    description: "Comprehensive teaching materials and discussion guides for Sabbath School teachers.",
    quarter: "Q2 2025",
    type: "PDF",
    fileSize: "4.5 MB",
    icon: GraduationCap,
    color: "text-purple-500",
    url: "https://www.absg.adventist.org/",
    viewUrl: "https://www.absg.adventist.org/",
  }
];

const Downloads = () => {
  const [selectedDocument, setSelectedDocument] = useState<null | {
    title: string;
    viewUrl: string;
  }>(null);
  
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1694015824784-28d0c8d6fdca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Downloads" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Downloads</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Access and download church resources, announcements, and materials.
            </p>
          </div>
        </section>

        {/* Sabbath School Materials Section */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Sabbath School Materials</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Download the latest Sabbath School lesson materials for all age groups and teaching resources.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sabbathSchoolMaterials.map((material) => {
                const IconComponent = material.icon;
                return (
                  <div 
                    key={material.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className=" items-center mb-4">
                        <div className={`flex justify-center items-center mb-4 ${material.color}`}>
                          <IconComponent size={52} />
                        </div>
                        <div>
                          <h3 className="font-bold text-center text-lg">{material.title}</h3>
                          <p className="text-sm text-gray-500">{material.quarter}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{material.description}</p>
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <span>Type: {material.type}</span>
                        <span className="mx-2">•</span>
                        <span>Size: {material.fileSize}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(material.url)}
                          className="flex items-center justify-center flex-1 py-2 px-3 bg-church-500 text-white rounded-md hover:bg-church-600 transition-colors text-sm"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                        <button 
                          onClick={() => window.open(material.url)} 
                          className="flex items-center justify-center flex-1 py-2 px-3 bg-church-600 text-white rounded-md hover:bg-church-700 transition-colors text-sm"
                        >
                          <Download size={16} className="mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* General Downloads Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">General Church Resources</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Access bulletins, newsletters, calendars, and other church documents.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {downloads.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="mr-4">
                        {item.type === 'PDF' ? (
                          <FileText size={40} className="text-red-500" />
                        ) : (
                          <File size={40} className="text-blue-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>Uploaded: {item.date}</span>
                          <span>Type: {item.type}</span>
                          <span>Size: {item.fileSize}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => window.open(item.url)}
                        className="flex items-center justify-center w-1/2 py-2 bg-church-500 text-white rounded-md hover:bg-church-600 transition-colors"
                      >
                        <Eye size={18} className="mr-2" />
                        View Document
                      </button>
                      <button 
                        onClick={() => window.open(item.url)} 
                        className="flex  items-center justify-center w-1/2 py-2 bg-church-600 text-white rounded-md hover:bg-church-700 transition-colors"
                        
                      >
                        <Download size={18} className="mr-2" />
                        Download {item.type}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Document Viewer Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent className="max-w-5xl h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
          </DialogHeader>
          <div className="h-full p-0 overflow-  hidden">
            {selectedDocument && (
              <iframe 
                src={selectedDocument.viewUrl} 
                title={selectedDocument.title} 
                className="w-full h-full border-0"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Downloads;
