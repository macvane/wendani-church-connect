
import React, { useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const blogs = [
  {
    id: 1,
    title: "Finding Peace in a Chaotic World",
    excerpt: "In today's fast-paced world, finding inner peace can be challenging. Here are biblical principles to help you find calm amid chaos.",
    date: "April 20, 2025",
    author: "Pastor John Doe",
    category: "Faith",
    thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400",
  },
  {
    id: 2,
    title: "The Importance of Daily Prayer",
    excerpt: "Establishing a consistent prayer life is essential for spiritual growth. Learn how to develop a meaningful prayer routine.",
    date: "April 15, 2025",
    author: "Elder Mary Smith",
    category: "Prayer",
    thumbnail: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?q=80&w=400",
  },
  {
    id: 3,
    title: "Understanding the Sabbath",
    excerpt: "The Sabbath is more than just a day of rest. Discover the profound spiritual significance of this weekly observance.",
    date: "April 10, 2025",
    author: "Deacon James Brown",
    category: "Doctrine",
    thumbnail: "https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=400",
  }
];

const BlogPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  return (
    <section id="blog" className="section bg-gray-50" ref={sectionRef}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title animate-on-scroll">Latest Blog Posts</h2>
          <p className="section-subtitle animate-on-scroll animate-delay-1">
            Spiritual insights, church news, and encouragement for your faith journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div 
              key={blog.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden animate-on-scroll"
              style={{animationDelay: `${index * 0.1 + 0.2}s`}}
            >
              <img 
                src={blog.thumbnail} 
                alt={blog.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-church-100 text-church-700 rounded">
                    {blog.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {blog.date}
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">By {blog.author}</span>
                  <a 
                    href={`/blogs/${blog.id}`} 
                    className="text-church-600 font-medium hover:text-church-700"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center animate-on-scroll">
          <a href="/blogs" className="btn btn-primary btn-lg">
            View All Blogs
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
