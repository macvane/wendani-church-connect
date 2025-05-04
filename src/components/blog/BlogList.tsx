
import React from 'react';
import BlogCard from './BlogCard';
import { BlogPost } from '@/types/blog';

interface BlogListProps {
  blogs: BlogPost[];
  searchTerm: string;
  selectedCategory: string;
  clearFilters: () => void;
}

const BlogList = ({ blogs, searchTerm, selectedCategory, clearFilters }: BlogListProps) => {
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchTerm === '' || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === '' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No blog posts found matching your search.</p>
          <button 
            onClick={clearFilters}
            className="mt-4 text-church-600 hover:text-church-700"
          >
            Clear filters and show all posts
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
