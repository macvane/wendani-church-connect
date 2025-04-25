
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Media', path: '/media' },
    { name: 'Events', path: '/events' },
    { name: 'Prayer', path: '/prayer' },
    { 
      name: 'Resources',
      path: '/resources',
      dropdown: [
        { name: 'Downloads', path: '/downloads' },
        { name: 'Blogs', path: '/blogs' },
        { name: 'Child Dedication', path: '/child-dedication' },
        { name: 'Benevolence', path: '/benevolence' },
        { name: 'Library', path: '/library' },
      ]
    },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={cn(
        'fixed w-full top-0 left-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
            <span className="text-white font-bold">KW</span>
          </div>
          <span className={cn(
            "font-serif font-bold text-xl transition-colors",
            isScrolled ? 'text-church-600' : 'text-white'
          )}>
            Kahawa Wendani SDA
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            !link.dropdown ? (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-church-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
                  isActive(link.path) 
                    ? 'text-church-600 after:scale-x-100' 
                    : isScrolled ? 'text-gray-700' : 'text-white',
                )}
              >
                {link.name}
              </Link>
            ) : (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger className={cn(
                  "flex items-center space-x-1 font-medium outline-none",
                  isActive(link.path) 
                    ? 'text-church-600' 
                    : isScrolled ? 'text-gray-700' : 'text-white',
                )}>
                  <span>{link.name}</span>
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white w-56">
                  {link.dropdown.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.path}
                        className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md w-full"
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ))}
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X size={24} className={isScrolled ? 'text-gray-700' : 'text-white'} />
          ) : (
            <Menu size={24} className={isScrolled ? 'text-gray-700' : 'text-white'} />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white z-40 pt-20 transform transition-transform duration-300 ease-in-out lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="container flex flex-col space-y-4 p-4">
          {navLinks.map((link) => (
            !link.dropdown ? (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-4 py-2 font-medium text-lg border-b border-gray-100",
                  isActive(link.path) ? 'text-church-600' : 'text-gray-700'
                )}
              >
                {link.name}
              </Link>
            ) : (
              <div key={link.name} className="flex flex-col">
                <button
                  onClick={(e) => {
                    e.currentTarget.nextElementSibling?.classList.toggle('hidden');
                  }}
                  className={cn(
                    "px-4 py-2 font-medium text-lg border-b border-gray-100 flex justify-between items-center",
                    isActive(link.path) ? 'text-church-600' : 'text-gray-700'
                  )}
                >
                  {link.name}
                  <ChevronDown size={16} />
                </button>
                <div className="pl-6 hidden">
                  {link.dropdown.map((item) => (
                    <Link 
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "block px-4 py-2 text-gray-700 hover:text-church-600",
                        isActive(item.path) ? 'text-church-600' : ''
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
