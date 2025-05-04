
import React from 'react';

const BlogSubscribe = () => {
  return (
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
  );
};

export default BlogSubscribe;
