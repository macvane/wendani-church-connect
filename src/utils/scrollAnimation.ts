
// Utility function for scroll animations
const setupScrollAnimation = () => {
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
  
  // Clean up function
  return () => {
    elements.forEach((el) => observer.unobserve(el));
  };
};

export default setupScrollAnimation;
