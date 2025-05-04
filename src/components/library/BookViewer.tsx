
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BookViewerProps {
  title: string;
  pages: string[];
  onClose: () => void;
}

const BookViewer = ({ title, pages, onClose }: BookViewerProps) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold">{title} - Page {currentPage + 1} of {pages.length}</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-8 min-h-[600px] shadow-md">
          <div className="prose max-w-none">
            {pages[currentPage]}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center p-4 border-t">
        <button 
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`flex items-center px-4 py-2 rounded ${
            currentPage === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'bg-church-100 text-church-700 hover:bg-church-200'
          }`}
        >
          <ArrowLeft size={16} className="mr-2" /> Previous Page
        </button>
        
        <button 
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className={`flex items-center px-4 py-2 rounded ${
            currentPage === pages.length - 1
              ? 'text-gray-400 cursor-not-allowed' 
              : 'bg-church-100 text-church-700 hover:bg-church-200'
          }`}
        >
          Next Page <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default BookViewer;
