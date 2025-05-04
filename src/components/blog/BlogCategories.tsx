
import React from 'react';
import { Tag } from 'lucide-react';

interface Category {
  name: string;
  count: number;
}

interface BlogCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const BlogCategories = ({ categories, selectedCategory, setSelectedCategory }: BlogCategoriesProps) => {
  return (
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
  );
};

export default BlogCategories;
