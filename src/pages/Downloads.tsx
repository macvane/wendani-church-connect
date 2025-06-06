import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { File, Download, FileText, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Sample documents data with view URLs
const downloads = [
  {
    id: 1,
    title: "Weekly Church Bulletin",
    description: "The most recent bulletin with announcements, upcoming events, and church activities.",
    date: "April 20, 2025",
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
  },
  {
    id: 3,
    title: "Quarterly Newsletter",
    description: "Our latest newsletter featuring church news, member spotlights, and event recaps.",
    date: "April 1, 2025",
    type: "PDF",
    fileSize: "4.2 MB",
    url: "https://docs.google.com/presentation/d/13nnbHdfIszqeC9xHcA5I_uibJH6DW8gi/edit?usp=sharing&ouid=104174869585023377770&rtpof=true&sd=true",
    viewUrl: "https://docs.google.com/presentation/d/13nnbHdfIszqeC9xHcA5I_uibJH6DW8gi/edit?usp=sharing&ouid=104174869585023377770&rtpof=true&sd=true",
  },
  {
    id: 4,
    title: "Church Calendar 2025",
    description: "Calendar of all planned church activities and events for the year 2025.",
    date: "December 10, 2024",
    type: "PDF",
    fileSize: "2.8 MB",
    url: "https://docs.google.com/document/d/e/1D7wugC1TzaqldU_kD1vDE8aZpgq0FO8EsAMTejMyyTM/pub", 
    viewUrl: "https://docs.google.com/document/d/e/1D7wugC1TzaqldU_kD1vDE8aZpgq0FO8EsAMTejMyyTM/pub",
  },
  {
    id: 5,
    title: "Choir Song Sheets",
    description: "Song sheets for the upcoming special program on May 15th.",
    date: "April 15, 2025",
    type: "ZIP",
    fileSize: "8.5 MB",
    url: "https://docs.google.com/presentation/d/13nnbHdfIszqeC9xHcA5I_uibJH6DW8gi/edit?usp=sharing&ouid=104174869585023377770&rtpof=true&sd=true",
    viewUrl: "https://docs.google.com/presentation/d/13nnbHdfIszqeC9xHcA5I_uibJH6DW8gi/edit?usp=sharing&ouid=104174869585023377770&rtpof=true&sd=true",
  },
  {
    id: 6,
    title: "Children's Sabbath School Materials",
    description: "Resources for children's Sabbath School teachers and parents.",
    date: "April 5, 2025",
    type: "PDF",
    fileSize: "5.3 MB",
    url: "https://docs.google.com/presentation/d/13nnbHdfIszqeC9xHcA5I_uibJH6DW8gi/edit?usp=sharing&ouid=104174869585023377770&rtpof=true&sd=true",
    viewUrl: "https://docs.google.com/presentation/d/13nnbHdfIszqeC9xHcA5I_uibJH6DW8gi/edit?usp=sharing&ouid=104174869585023377770&rtpof=true&sd=true",
  },
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
        
        {/* Downloads Section */}
        <section className="section bg-white">
          
          <div className="container">
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
