import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    
    // This plugin will only be active in development mode
    mode === 'development' && componentTagger(),
    
    // The sitemap plugin will automatically run only during the 'build' command
    sitemap({
      // The base URL of your website
      hostname: 'https://kahawawendanisda.org',
      
      // A list of your site's routes. The plugin will combine these
      // with your hostname to create the full URLs.
      dynamicRoutes: [
        '/',
        '/about',
        '/contact',
        '/blog',
        '/benevolence',
        '/baptism',
        '/donate',
        '/downloads',
        '/events',
        '/library',
        '/media',
        '/membership-transfer',
        '/prayer',
      ],
      
      // This will generate a robots.txt file in your dist folder
      // It's a good practice to have this managed in one place.
      robots: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    }),
  ].filter(Boolean), // This removes any 'false' values from the plugins array
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));