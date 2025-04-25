
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Search, Calendar, User, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "Finding Peace in a Chaotic World",
    excerpt: "In today's fast-paced world, finding inner peace can be challenging. Here are biblical principles to help you find calm amid chaos.",
    date: "April 20, 2025",
    author: "Pastor John Doe",
    category: "Faith",
    thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Importance of Daily Prayer",
    excerpt: "Establishing a consistent prayer life is essential for spiritual growth. Learn how to develop a meaningful prayer routine.",
    date: "April 15, 2025",
    author: "Elder Mary Smith",
    category: "Prayer",
    thumbnail: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?q=80&w=600",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Understanding the Sabbath",
    excerpt: "The Sabbath is more than just a day of rest. Discover the profound spiritual significance of this weekly observance.",
    date: "April 10, 2025",
    author: "Deacon James Brown",
    category: "Doctrine",
    thumbnail: "https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=600",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "Steps to Spiritual Growth",
    excerpt: "Growing spiritually doesn't happen by accident. Learn practical steps to deepen your relationship with God.",
    date: "April 5, 2025",
    author: "Elder David Kamau",
    category: "Spiritual Growth",
    thumbnail: "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=600",
    readTime: "8 min read",
  },
  {
    id: 5,
    title: "What the Bible Says About Stewardship",
    excerpt: "Explore the biblical principles of stewardship and how they apply to our finances, time, and talents.",
    date: "March 28, 2025",
    author: "Pastor John Doe",
    category: "Stewardship",
    thumbnail: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=600",
    readTime: "6 min read",
  },
  {
    id: 6,
    title: "The Power of Community",
    excerpt: "God designed us to live in community. Discover the spiritual benefits of authentic Christian fellowship.",
    date: "March 20, 2025",
    author: "Elder Sarah Johnson",
    category: "Community",
    thumbnail: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=600",
    readTime: "4 min read",
  }
];

const categories = [
  { name: "Faith", count: 8 },
  { name: "Prayer", count: 12 },
  { name: "Doctrine", count: 7 },
  { name: "Spiritual Growth", count: 15 },
  { name: "Stewardship", count: 6 },
  { name: "Community", count: 9 },
];

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const filteredBlogs = blogPosts.filter(blog => {
    const matchesSearch = searchTerm === '' || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === '' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=2000" 
              alt="Church Blog" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Church Blog</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Spiritual insights, church news, and encouragement for your faith journey.
            </p>
          </div>
        </section>
        
        {/* Blog Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div className="space-y-8">
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map(blog => (
                      <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row animate-on-scroll">
                        <div className="sm:w-1/3">
                          <img 
                            src={blog.thumbnail} 
                            alt={blog.title} 
                            className="w-full h-48 sm:h-full object-cover"
                          />
                        </div>
                        <div className="p-6 sm:w-2/3">
                          <div className="flex items-center mb-3 text-sm text-gray-500">
                            <span className="bg-church-100 text-church-700 px-2 py-1 rounded text-xs font-medium">
                              {blog.category}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {blog.date}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{blog.readTime}</span>
                          </div>
                          
                          <h2 className="text-xl font-bold mb-3">
                            <a href={`/blogs/${blog.id}`} className="hover:text-church-600 transition-colors">
                              {blog.title}
                            </a>
                          </h2>
                          
                          <p className="text-gray-600 mb-4">
                            {blog.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm text-gray-500 flex items-center">
                              <User size={14} className="mr-1" />
                              By {blog.author}
                            </span>
                            <a 
                              href={`/blogs/${blog.id}`} 
                              className="text-church-600 font-medium hover:text-church-700 transition-colors"
                            >
                              Read More →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-xl text-gray-600">No blog posts found matching your search.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('');
                        }}
                        className="mt-4 text-church-600 hover:text-church-700"
                      >
                        Clear filters and show all posts
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Tag size={18} className="mr-2" />
                      Categories
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => setSelectedCategory('')}
                          className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition-colors ${selectedCategory === '' ? 'bg-church-100 text-church-700 font-medium' : ''}`}
                        >
                          All Categories
                        </button>
                      </li>
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
                  
                  <div className="bg-church-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Subscribe to Our Blog</h3>
                    <p className="mb-4">
                      Get the latest blog posts delivered straight to your inbox.
                    </p>
                    <form>
                      <input 
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-4 py-2 rounded-md text-gray-800 mb-3 focus:outline-none focus:ring-2 focus:ring-church-300"
                      />
                      <button 
                        type="submit"
                        className="w-full bg-white text-church-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Blogs;
