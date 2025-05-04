import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Search, Book, Clock, Calendar, User, BookOpen, Headphones, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { physicalBooks, digitalBooks } from '@/data/libraryData';
import AudioBookPlayer from '@/components/library/AudioBookPlayer';
import BookViewer from '@/components/library/BookViewer';

// Sample categories
const categories = [
  { name: "All", count: physicalBooks.length },
  { name: "Spiritual Growth", count: physicalBooks.filter(book => book.category === "Spiritual Growth").length },
  { name: "Prophecy", count: physicalBooks.filter(book => book.category === "Prophecy").length },
  { name: "Biography", count: physicalBooks.filter(book => book.category === "Biography").length },
  { name: "Bible Study", count: physicalBooks.filter(book => book.category === "Bible Study").length },
  { name: "Health", count: physicalBooks.filter(book => book.category === "Health").length },
  { name: "Christian Living", count: physicalBooks.filter(book => book.category === "Christian Living").length },
  { name: "Education", count: physicalBooks.filter(book => book.category === "Education").length },
];

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [borrowFormVisible, setBorrowFormVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [borrowForm, setBorrowForm] = useState({
    name: '',
    email: '',
    phone: '',
    memberID: '',
    borrowDate: '',
    returnDate: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [audioBookOpen, setAudioBookOpen] = useState(false);
  const [audioBookData, setAudioBookData] = useState<{ 
    title: string; 
    author: string; 
    coverImage: string; 
    audioUrl: string;
  } | null>(null);

  const [bookViewerOpen, setBookViewerOpen] = useState(false);
  const [bookViewerData, setBookViewerData] = useState<{ 
    title: string; 
    pages: string[];
  } | null>(null);
  
  const filteredBooks = physicalBooks.filter(book => {
    const matchesSearch = searchTerm === '' || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBorrowForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBorrowBook = (book: any) => {
    if (!book.availability) {
      toast({
        title: "Book Unavailable",
        description: "Sorry, this book is currently on loan. Please check back later.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedBook(book);
    setBorrowFormVisible(true);
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14); // 2 weeks from now
    
    setBorrowForm(prev => ({
      ...prev,
      borrowDate: today,
      returnDate: returnDate.toISOString().split('T')[0],
    }));
  };

  const handleReadBook = (book: any) => {
    setBookViewerData({
      title: book.title,
      pages: book.pages
    });
    setBookViewerOpen(true);
  };

  const handleListenToBook = (book: any) => {
    setAudioBookData({
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      audioUrl: book.audioUrl
    });
    setAudioBookOpen(true);
  };
  
  const handleSubmitBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Book Reserved",
        description: `You have successfully reserved "${selectedBook.title}". Please collect it from the library within 3 days.`,
      });
      
      setBorrowFormVisible(false);
      setSelectedBook(null);
      setIsSubmitting(false);
      
      setBorrowForm({
        name: '',
        email: '',
        phone: '',
        memberID: '',
        borrowDate: '',
        returnDate: '',
      });
    }, 1500);
  };

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000" 
              alt="Church Library" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Church Library</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Browse our collection of books and resources to enrich your spiritual journey.
            </p>
          </div>
        </section>
        
        {/* Library Section */}
        <section className="section bg-white">
          <div className="container">
            <Tabs defaultValue="physical" className="animate-on-scroll">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="physical">Physical Books</TabsTrigger>
                  <TabsTrigger value="digital">Digital Resources</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="physical">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-24">
                      <div className="mb-6">
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Search books..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Categories</h3>
                        <ul className="space-y-2">
                          {categories.map(category => (
                            <li key={category.name}>
                              <button
                                onClick={() => setSelectedCategory(category.name)}
                                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition-colors ${selectedCategory === category.name ? 'bg-church-100 text-church-700 font-medium' : ''}`}
                              >
                                {category.name} ({category.count})
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6 bg-church-600 text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Library Hours</h3>
                        <ul className="space-y-3">
                          <li className="flex justify-between">
                            <span>Sunday:</span>
                            <span>Closed</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Monday:</span>
                            <span>Closed</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Tuesday:</span>
                            <span>10:00 AM - 2:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Wednesday:</span>
                            <span>10:00 AM - 2:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Thursday:</span>
                            <span>3:00 PM - 6:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Friday:</span>
                            <span>10:00 AM - 12:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Saturday:</span>
                            <span>2:00 PM - 4:00 PM</span>
                          </li>
                        </ul>
                        
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="text-sm">
                            For inquiries, contact our librarian at:
                            <br />
                            <span className="font-medium">library@kahawawendanisda.org</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="lg:col-span-3">
                    <div className="mb-6 flex justify-between items-center">
                      <h2 className="text-2xl font-bold">
                        {selectedCategory === 'All' ? 'All Books' : selectedCategory} 
                        <span className="text-lg font-normal text-gray-500">
                          ({filteredBooks.length} books)
                        </span>
                      </h2>
                    </div>
                    
                    {filteredBooks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredBooks.map(book => (
                          <div key={book.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                            <div className="relative pt-[120%]">
                              <img 
                                src={book.coverImage} 
                                alt={book.title} 
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              {!book.availability && (
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">
                                  On Loan
                                </div>
                              )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                              <p className="text-gray-500 text-sm mb-2">By {book.author}</p>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
                                {book.description}
                              </p>
                              <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                                <span>{book.category}</span>
                                <span>{book.publicationYear}</span>
                              </div>
                              <div className="flex flex-col space-y-2">
                                <button
                                  onClick={() => handleBorrowBook(book)}
                                  className={`w-full py-2 rounded-md ${book.availability 
                                    ? 'bg-church-600 hover:bg-church-700 text-white' 
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  } transition-colors text-center`}
                                  disabled={!book.availability}
                                >
                                  {book.availability ? 'Borrow Book' : 'Currently Unavailable'}
                                </button>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => handleReadBook(book)}
                                    className="flex items-center justify-center py-2 bg-church-100 text-church-700 rounded-md hover:bg-church-200 transition-colors"
                                  >
                                    <BookOpen size={16} className="mr-2" />
                                    Read
                                  </button>
                                  
                                  <button
                                    onClick={() => handleListenToBook(book)}
                                    className="flex items-center justify-center py-2 bg-church-100 text-church-700 rounded-md hover:bg-church-200 transition-colors"
                                  >
                                    <Headphones size={16} className="mr-2" />
                                    Listen
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Book size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600">No books found matching your search.</p>
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('All');
                          }}
                          className="mt-4 text-church-600 hover:text-church-700"
                        >
                          Clear filters and show all books
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Borrow Form Modal */}
                {borrowFormVisible && selectedBook && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold">Borrow Book</h3>
                          <button 
                            onClick={() => setBorrowFormVisible(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </div>
                        
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-24 shrink-0 mr-4">
                            <img 
                              src={selectedBook.coverImage} 
                              alt={selectedBook.title} 
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold">{selectedBook.title}</h4>
                            <p className="text-sm text-gray-500">By {selectedBook.author}</p>
                          </div>
                        </div>
                        
                        <form onSubmit={handleSubmitBorrow} className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
                              Your Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text" 
                              id="name" 
                              name="name" 
                              value={borrowForm.name}
                              onChange={handleChangeForm}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block font-medium mb-1 text-gray-700">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="email" 
                              id="email" 
                              name="email"
                              value={borrowForm.email}
                              onChange={handleChangeForm}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block font-medium mb-1 text-gray-700">
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="tel" 
                              id="phone" 
                              name="phone"
                              value={borrowForm.phone}
                              onChange={handleChangeForm}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="memberID" className="block font-medium mb-1 text-gray-700">
                              Church Member ID (if applicable)
                            </label>
                            <input 
                              type="text" 
                              id="memberID" 
                              name="memberID"
                              value={borrowForm.memberID}
                              onChange={handleChangeForm}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="borrowDate" className="block font-medium mb-1 text-gray-700">
                                Borrow Date <span className="text-red-500">*</span>
                              </label>
                              <input 
                                type="date" 
                                id="borrowDate" 
                                name="borrowDate"
                                value={borrowForm.borrowDate}
                                onChange={handleChangeForm}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="returnDate" className="block font-medium mb-1 text-gray-700">
                                Return Date <span className="text-red-500">*</span>
                              </label>
                              <input 
                                type="date" 
                                id="returnDate" 
                                name="returnDate"
                                value={borrowForm.returnDate}
                                onChange={handleChangeForm}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                            <p><strong>Note:</strong> Books are loaned for a maximum of 2 weeks. Please return them on time.</p>
                          </div>
                          
                          <div className="flex justify-end pt-4">
                            <button 
                              type="button"
                              onClick={() => setBorrowFormVisible(false)}
                              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              disabled={isSubmitting}
                              className={`px-4 py-2 bg-church-600 text-white rounded-md hover:bg-church-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              {isSubmitting ? 'Processing...' : 'Submit Request'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="digital">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Digital Resources</h2>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Search digital resources..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {digitalBooks.map(book => (
                      <div key={book.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex">
                        <div className="w-1/3">
                          <img 
                            src={book.coverImage} 
                            alt={book.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 w-2/3">
                          <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                          <p className="text-gray-500 text-sm mb-2">By {book.author}</p>
                          
                          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                            <span className="flex items-center">
                              <Book size={12} className="mr-1" />
                              {book.format}
                            </span>
                            <span>{book.fileSize}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {book.description}
                          </p>
                          
                          <a 
                            href={book.url}
                            className="inline-flex items-center text-church-600 hover:text-church-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download size={16} className="mr-1" />
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Other Digital Resources</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3">Sabbath School Lessons</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Access current and archived Sabbath School study materials for all age groups.
                        </p>
                        <a 
                          href="https://sabbathschoolpersonalministries.org/sabbathschool"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-church-600 hover:text-church-700 font-medium"
                        >
                          Visit Resource →
                        </a>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3">Ellen G. White Writings</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Complete collection of Ellen G. White's published writings online.
                        </p>
                        <a 
                          href="https://egwwritings.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-church-600 hover:text-church-700 font-medium"
                        >
                          Visit Resource →
                        </a>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-3">Bible Study Guides</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Free Bible study guides on various biblical topics.
                        </p>
                        <a 
                          href="https://www.amazingfacts.org/media-library/study-guides/t/bible-study-guides"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-church-600 hover:text-church-700 font-medium"
                        >
                          Visit Resource →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Library Info */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title animate-on-scroll">Library Information</h2>
              <p className="section-subtitle animate-on-scroll animate-delay-1">
                Our church library has resources to help you grow in your spiritual journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm animate-on-scroll">
                <div className="h-12 w-12 rounded-full bg-church-100 flex items-center justify-center mb-4">
                  <Book size={24} className="text-church-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Borrowing Policy</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Church members can borrow up to 3 books</li>
                  <li>Non-members limited to 1 book at a time</li>
                  <li>Loan period is 2 weeks, with one renewal</li>
                  <li>Reference materials are for in-library use only</li>
                  <li>Valid ID required for registration</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm animate-on-scroll animate-delay-1">
                <div className="h-12 w-12 rounded-full bg-church-100 flex items-center justify-center mb-4">
                  <Clock size={24} className="text-church-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Operating Hours</h3>
                <ul className="text-gray-600 space-y-2">
                  <li><strong>Tuesday:</strong> 10:00 AM - 2:00 PM</li>
                  <li><strong>Wednesday:</strong> 10:00 AM - 2:00 PM</li>
                  <li><strong>Thursday:</strong> 3:00 PM - 6:00 PM</li>
                  <li><strong>Friday:</strong> 10:00 AM - 12:00 PM</li>
                  <li><strong>Saturday:</strong> 2:00 PM - 4:00 PM</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm animate-on-scroll animate-delay-2">
                <div className="h-12 w-12 rounded-full bg-church-100 flex items-center justify-center mb-4">
                  <User size={24} className="text-church-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Meet Our Librarian</h3>
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100" 
                    alt="Church Librarian"
                    className="w-16 h-16 object-cover rounded-full mr-4"
                  />
                  <div className="text-left">
                    <h4 className="font-bold">Jane Njeri</h4>
                    <p className="text-gray-500">Church Librarian</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Jane has been managing our church library for over 5 years. She's passionate about books and helping members find resources.
                </p>
                <p className="text-gray-600">
                  Contact: library@kahawawendanisda.org
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Audio Book Player Dialog */}
      <Dialog open={audioBookOpen} onOpenChange={(open) => !open && setAudioBookOpen(false)}>
        <DialogContent className="max-w-md p-6">
          {audioBookData && (
            <AudioBookPlayer 
              title={audioBookData.title}
              author={audioBookData.author}
              coverImage={audioBookData.coverImage}
              audioSrc={audioBookData.audioUrl}
              onClose={() => setAudioBookOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Book Viewer Dialog */}
      <Dialog open={bookViewerOpen} onOpenChange={(open) => !open && setBookViewerOpen(false)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
          {bookViewerData && (
            <BookViewer 
              title={bookViewerData.title}
              pages={bookViewerData.pages}
              onClose={() => setBookViewerOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Library;
