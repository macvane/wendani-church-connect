
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

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
    <div className="min-h-screen bg-gradient-to-br from-church-50 to-church-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Thank You - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Welcome to Kahawa Wendani SDA Church, a vibrant Seventh-day Adventist community in Nairobi. Join us for worship and fellowship." />
        <link rel="canonical" href="https://kahawawendanisda.org/thank-you" />
      </Helmet>
      <div className="max-w-2xl w-full">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-8">
            <CheckCircle className="mx-auto h-20 w-20 text-church-600 mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600 mb-8">
              {getFormTypeMessage(formType)}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center border-church-300 text-church-600 hover:bg-church-50"
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

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-200">
            
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2 text-church-700">Need Help?</h3>
              <p className="text-gray-600 text-sm">
                If you have any questions, feel free to contact us at <span className='text-church-700'><a href="mailto:info@kahawawendanisda.org">info@kahawawendanisda.org</a></span>
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2 text-church-700">Stay Connected</h3>
              <p className="text-gray-600 text-sm">
                Join us for Sabbath services every Saturday at 08:00 AM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
