import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const Prayer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: 'personal request',
    prayerRequest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Build payload safely
    const payload: Record<string, any> = {
      full_name: formData.name?.trim() || null,
      email: formData.email?.trim() || null,
      phone_number:
        formData.phone && !isNaN(Number(formData.phone))
          ? Number(formData.phone)
          : null,
      prayer_type: formData.requestType || 'personal request',
      prayer_request: formData.prayerRequest?.trim() || '',
    };

    // Only check required ones on frontend
    if (!payload.prayer_type || !payload.prayer_request) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please select a request type and write your prayer request.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    console.log('Submitting payload:', payload);

    const response = await fetch('http://127.0.0.1:8000/form/prayers/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Backend response:', data);

    if (!response.ok) {
      throw new Error(
        data.detail ||
          Object.values(data)?.[0]?.[0] ||
          'Failed to submit prayer request.'
      );
    }

    toast({
      title: 'Prayer Request Submitted 🙏',
      description:
        'Your request has been received. Our team will pray for you shortly.',
    });

    // Reset on success
    setFormData({
      name: '',
      email: '',
      phone: '',
      requestType: 'personal request',
      prayerRequest: '',
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    toast({
      title: 'Submission Failed',
      description: error.message || 'Please try again later.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <>
      <Helmet>
        <title>Prayer - Kahawa Wendani SDA Church</title>
        <meta
          name="description"
          content="Let us pray for you. Submit your confidential prayer request to the prayer ministry team at Kahawa Wendani SDA Church."
        />
      </Helmet>

      <Header />
      <main>
        {/* Hero section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1523803326055-9729b9e02e5a?q=80&w=1471&auto=format&fit=crop"
              alt="Prayer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Prayer Requests</h1>
            <p className="text-xl max-w-3xl mx-auto">
              "Don't worry about anything; instead, pray about everything." - Philippians 4:6
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title animate-on-scroll">We Are Here to Pray With You</h2>
              <div className="prose max-w-none animate-on-scroll animate-delay-1">
                <p className="text-lg mb-4">
                  At Kahawa Wendani SDA Church, we believe in the power of prayer. Whether you're facing
                  personal challenges, health issues, or simply want to give thanks, our prayer team is
                  committed to lifting your requests to God.
                </p>
                <p className="text-lg mb-4">
                  Fill out the form below to submit your prayer request. You can choose whether your
                  request should be kept confidential or shared with the prayer team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prayer form */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Prayer Request Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
                        Your Name <span className="font-light text-gray-400 text-sm">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block font-medium mb-1 text-gray-700">
                        Email Address <span className="font-light text-gray-400 text-sm">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="youremail@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-medium mb-1 text-gray-700">
                      Phone Number <span className="font-light text-gray-400 text-sm">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="requestType" className="block font-medium mb-1 text-gray-700">
                      Request Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="requestType"
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
                    >
                      <option value="personal request">Personal Request</option>
                      <option value="family request">Family Request</option>
                      <option value="health & healing">Health & Healing</option>
                      <option value="guidance & direction">Guidance & Direction</option>
                      <option value="thanksgiving">Thanksgiving</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="prayerRequest" className="block font-medium mb-1 text-gray-700">
                      Your Prayer Request <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="prayerRequest"
                      name="prayerRequest"
                      value={formData.prayerRequest}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
                      placeholder="Please share your prayer request here..."
                    ></textarea>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Prayer;
