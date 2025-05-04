
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';
import BlogSubscribe from '@/components/blog/BlogSubscribe';
import BlogList from '@/components/blog/BlogList';
import { blogPosts } from '@/data/blogData';
import { Category } from '@/types/blog';

const categories: Category[] = [
  { name: "Faith", count: 8 },
  { name: "Prayer", count: 12 },
  { name: "Doctrine", count: 7 },
  { name: "Spiritual Growth", count: 15 },
  { name: "Stewardship", count: 6 },
  { name: "Community", count: 9 },
  { name: "Prophecy", count: 5 },
];

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
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
                <BlogSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <BlogList 
                  blogs={blogPosts}
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  clearFilters={clearFilters}
                />
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <BlogCategories 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                  <BlogSubscribe />
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
