
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formType = searchParams.get('type') || 'form';
  
  const getFormTypeMessage = (type: string) => {
    switch (type) {
      case 'contact':
        return 'Thank you for contacting us! We will get back to you soon.';
      case 'prayer':
        return 'Thank you for sharing your prayer request. Our prayer team will be praying for you.';
      case 'baptism':
        return 'Thank you for your baptism request! Our pastoral team will contact you soon.';
      case 'dedication':
        return 'Thank you for your child dedication request! We will contact you to schedule the ceremony.';
      case 'benevolence':
        return 'Thank you for your benevolence request. We will review your application and get back to you.';
      case 'library':
        return 'Thank you for your library request! We will process your request and contact you soon.';
      case 'donation':
        return 'Thank you for recording your donation information. Your generosity is greatly appreciated.';
      case 'membership':
        return 'Thank you for your membership transfer request! We will process your application and contact you.';
      default:
        return 'Thank you for your submission! We have received your information and will get back to you soon.';
    }
  };

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Thank You" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <CheckCircle className="mx-auto h-20 w-20 mb-6" />
            <h1 className="mb-4">Thank You!</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Your submission has been received successfully.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="section bg-white">
          <div className="container max-w-3xl text-center">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
              <h2 className="text-2xl font-bold mb-4">Submission Successful</h2>
              <p className="text-lg text-gray-700 mb-8">
                {getFormTypeMessage(formType)}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Go Back
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-church-600 hover:bg-church-700 flex items-center"
                >
                  <Home className="mr-2" size={16} />
                  Return Home
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="section bg-gray-50">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">What's Next?</h3>
                <p className="text-gray-600">
                  We will review your submission and respond within 1-2 business days.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-gray-600">
                  If you have any questions, feel free to contact us at +254 726 410608.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">Stay Connected</h3>
                <p className="text-gray-600">
                  Join us for Sabbath services every Saturday at 11:00 AM.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ThankYou;
