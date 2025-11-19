import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { prayerAPI } from '@/utils/api';

const Prayer = () => {
  const [formData, setFormData] = useState({
    requestType: 'personal request',
    prayerRequest: '',
    wantsVisitation: false,
    fullName: '',
    email: '',
    phone: '',
    prayerCell: 'Garrison',
    generalArea: '',
    visitationMethod: 'call',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const VISITATION_METHODS = [
    { value: 'call', label: 'Call with Pastor' },
    { value: 'home_visit', label: 'Visit at Home' },
  ];

  const PRAYER_CELLS = [
    'Garrison', 'Matopeni', 'Lifestyle', 'Solomon Plaza', 'Kwangethe', 'Area 40',
    'Lower Cleanshelf', 'Upper Claenshelf', 'Mamaland', 'Sukari A', 'Sukari B',
    'Clanne', 'None',
  ];

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
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1️⃣ Submit prayer request to internal API
      const response = await prayerAPI.create({
        full_name: formData.fullName || undefined,
        email: formData.email || undefined,
        phone_number: formData.phone || undefined,
        prayer_type: formData.requestType,
        prayer_request: formData.prayerRequest,
        wants_visitation: formData.wantsVisitation,
        prayer_cell: formData.wantsVisitation ? formData.prayerCell : undefined,
        general_area: formData.wantsVisitation ? formData.generalArea : undefined,
        visitation_method: formData.wantsVisitation ? formData.visitationMethod : undefined,
      });

      if (!response.ok) throw new Error("Internal submission failed");

      // 2️⃣ Prepare plain-text email for Web3Forms
      const plainTextEmail = `
KAHAWA WENDANI SDA CHURCH
PRAYER REQUEST NOTIFICATION
============================================================

REQUEST INFORMATION
------------------------------------------------------------
Prayer Item:       ${formData.requestType}

Prayer Request:
${formData.prayerRequest}

${formData.wantsVisitation ? `
PERSONAL DETAILS
------------------------------------------------------------
Name:               ${formData.fullName}
Email:              ${formData.email || 'Not Provided'}
Phone:              ${formData.phone}



============================================================
VISITATION DETAILS
------------------------------------------------------------
Prayer Cell:        ${formData.prayerCell}
General Area:       ${formData.generalArea || 'Not Provided'}
Visitation Method:  ${VISITATION_METHODS.find(m => m.value === formData.visitationMethod)?.label}
` : ''}

============================================================
NOTES
------------------------------------------------------------
This prayer request was submitted from the church website.
Please handle confidentially.

============================================================
© 2025 Kahawa Wendani SDA Church | Prayer Ministry Team
      `;

      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "afc2fd93-72fa-4be1-8c54-732ec719adfe",
          subject: "New Prayer Request",
          from_name: "Church Website",
          message: plainTextEmail,
        }),
      });

      const web3Result = await web3Response.json();
      if (!web3Result.success) console.error("Web3Forms error:", web3Result);

      toast({
        title: "Prayer Request Submitted",
        description: "Thank you for sharing your prayer request. Our prayer team will be praying for you.",
      });

      // Reset form
      setFormData({
        requestType: 'personal request',
        prayerRequest: '',
        wantsVisitation: false,
        fullName: '',
        email: '',
        phone: '',
        prayerCell: 'Garrison',
        generalArea: '',
        visitationMethod: 'call',
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your prayer request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Prayer - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Submit your prayer request or request a visitation from the pastor." />
      </Helmet>

      <Header />

      <main>

        {/* Hero Section and other sections remain the same */}
        <section className="relative h-[400px] flex items-center justify-center ">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1523803326055-9729b9e02e5a?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
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

         {/* Introduction Section remains the same */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title animate-on-scroll">We Are Here to Pray With You</h2>
              <div className="prose max-w-none animate-on-scroll animate-delay-1">
                 <p className="text-lg mb-4">
                  At Kahawa Wendani SDA Church, we believe in the power of prayer. Whether you're facing personal challenges, health issues, or simply want to give thanks, our prayer team is committed to lifting your requests to God.
                </p>
                <p className="text-lg mb-4">
                  Fill out the form below to submit your prayer request. You can choose whether your request should be kept confidential (seen only by our prayer team leaders) or shared with the larger prayer team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Prayer Request Form</h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* REQUEST TYPE */}
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Request Type *</label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    required
                  >
                    <option value="personal request">Personal Request</option>
                    <option value="family request">Family Request</option>
                    <option value="health & healing">Health & Healing</option>
                    <option value="guidance & direction">Guidance & Direction</option>
                    <option value="thanksgiving">Thanksgiving</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* PRAYER REQUEST */}
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Your Prayer Request *</label>
                  <textarea
                    name="prayerRequest"
                    rows={5}
                    required
                    value={formData.prayerRequest}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    placeholder="Share your prayer request here..."
                  />
                </div>

                {/* VISITATION CHECKBOX */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="wantsVisitation"
                      checked={formData.wantsVisitation}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    I would like a visitation
                  </label>
                </div>

                {/* VISITATION FIELDS */}
                {formData.wantsVisitation && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fullName" className="block font-medium mb-1 text-gray-700">
                          Full Name <span className='font-light text-red-400 text-sm'>*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block font-medium mb-1 text-gray-700">
                          Email Address <span className='font-light text-gray-400 text-sm'>(Optional)</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block font-medium mb-1 text-gray-700">
                        Phone Number <span className='font-light text-red-400 text-sm'>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block font-medium mb-1 text-gray-700">
                        Prayer Cell <span className='font-light text-red-400 text-sm'>*</span>
                      </label>
                      <select
                        name="prayerCell"
                        value={formData.prayerCell}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      >
                        {PRAYER_CELLS.map(cell => <option key={cell} value={cell}>{cell}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block font-medium mb-1 text-gray-700">
                        If none <span className='font-light text-gray-400 text-sm'>(Optional)</span>
                      </label>
                      <textarea 
                        placeholder="Describe general area of residence if not in a prayer cell"
                        name="generalArea" 
                        value={formData.generalArea}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      ></textarea>
                    </div>
                    <select
                      name="visitationMethod"
                      value={formData.visitationMethod}
                      onChange={handleChange}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    >
                      {VISITATION_METHODS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-church-600 text-white rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </section>

        {/* Scripture verses section remains the same */}
        <section className="section bg-white">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Encouraging Scripture Verses</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg text-center animate-on-scroll">
                <p className="text-xl italic mb-4">
                  "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God."
                </p>
                <p className="text-church-600 font-bold">- Philippians 4:6</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center animate-on-scroll animate-delay-1">
                <p className="text-xl italic mb-4">
                  "Call to me and I will answer you, and will tell you great and hidden things that you have not known."
                </p>
                <p className="text-church-600 font-bold">- Jeremiah 33:3</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center animate-on-scroll animate-delay-2">
                <p className="text-xl italic mb-4">
                  "Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you."
                </p>
                <p className="text-church-600 font-bold">- 1 Thessalonians 5:16-18</p>
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
