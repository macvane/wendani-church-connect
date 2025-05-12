
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogContents } from '@/data/blogData';

const BlogPost = () => {
  const { id } = useParams();
  const blogId = parseInt(id || "0");
  
  const blog = blogContents.find(blog => blog.id === blogId);
  
  if (!blog) {
    return (
      <>
        <Header />
        <main className="container py-16 min-h-[60vh]">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">
              The blog post you are looking for does not exist or has been removed.
            </p>
            <Link to="/blogs" className="btn btn-primary">
              Back to All Blogs
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
          <img 
            src={blog.featuredImage || 'https://images.unsplash.com/photo-1501951653466-8df816debe46?q=80&w=1374&auto=format&fit=crop'} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-20 text-white">
          <Link to="/blogs" className="inline-flex items-center text-church-300 hover:text-church-200 mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to All Blogs
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="bg-church-600 text-white px-3 py-1 rounded-full">
                {blog.category}
              </div>
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {blog.date}
              </span>
              <span className="flex items-center">
                <User size={14} className="mr-1" />
                {blog.author}
              </span>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container py-12">        
        <article className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {blog.content.map((section, index) => (
              <React.Fragment key={index}>
                {section.type === 'paragraph' && <p className="mb-6">{section.text}</p>}
                {section.type === 'heading' && <h2 className="text-2xl font-bold mt-10 mb-4">{section.text}</h2>}
                {section.type === 'quote' && (
                  <blockquote className="border-l-4 border-church-500 pl-4 italic my-8">
                    {section.text}
                  </blockquote>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-12 pt-6 border-t">
            <div className="flex items-center">
              <Tag size={18} className="mr-2 text-church-600" />
              <span className="mr-2 font-semibold">Related Topics:</span>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogPost;
