
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row animate-on-scroll">
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
          <Link to={`/blogs/${blog.id}`} className="hover:text-church-600 transition-colors">
            {blog.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-500 flex items-center">
            <User size={14} className="mr-1" />
            By {blog.author}
          </span>
          <Link 
            to={`/blogs/${blog.id}`} 
            className="text-church-600 font-medium hover:text-church-700 transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
