
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { sendToGoogleSheet } from '@/utils/googleSheets';

const ChildDedication = () => {
  const [formData, setFormData] = useState({
    childName: '',
    dateOfBirth: '',
    gender: '',
    fatherName: '',
    fatherEmail: '',
    fatherPhone: '',
    motherName: '',
    motherEmail: '',
    motherPhone: '',
    address: '',
    dedicationDate: '',
    additionalInfo: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendToGoogleSheet({
        ...formData,
      }, 'dedication');
      
      toast({
        title: "Dedication Request Submitted",
        description: "Thank you for your submission. We will contact you soon regarding the child dedication ceremony.",
      });
      
      setFormData({
        childName: '',
        dateOfBirth: '',
        gender: '',
        fatherName: '',
        fatherEmail: '',
        fatherPhone: '',
        motherName: '',
        motherEmail: '',
        motherPhone: '',
        address: '',
        dedicationDate: '',
        additionalInfo: '',
      });
    } catch (error) {
      console.error("Error submitting dedication request:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
            <img 
              src="https://plus.unsplash.com/premium_photo-1725408058301-c1b959db6cc9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Child Dedication" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Child Dedication</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Register your child for a special dedication ceremony at our church.
            </p>
          </div>
        </section>
        
        {/* Info Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title ">About Child Dedication</h2>
              <div className="prose max-w-none  animate-delay-1">
                <p className="text-lg mb-4">
                  Child dedication is a ceremony in which parents make a public commitment before God, their family, and the church congregation to raise their child according to God's Word and God's ways.
                </p>
                <p className="text-lg">
                  At Kahawa Wendani SDA Church, we perform child dedications during the first Sabbath of every month. To register your child for dedication, please fill out the form below.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Registration Form */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Child Dedication Registration Form</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Child Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="childName" className="block font-medium mb-1 text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="childName" 
                          name="childName" 
                          placeholder='Full name'
                          value={formData.childName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dateOfBirth" className="block font-medium mb-1 text-gray-700">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="date" 
                          id="dateOfBirth" 
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="gender" className="block font-medium mb-1 text-gray-700">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select 
                          id="gender" 
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Father's Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fatherName" className="block font-medium mb-1 text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="fatherName" 
                          name="fatherName" 
                          placeholder="Father's full name"
                          value={formData.fatherName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="fatherEmail" className="block font-medium mb-1 text-gray-700">
                          Email Address 
                        </label>
                        <input 
                          type="email" 
                          id="fatherEmail" 
                          name="fatherEmail"
                          placeholder="father'semail@gmail.com"
                          value={formData.fatherEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="fatherPhone" className="block font-medium mb-1 text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          id="fatherPhone" 
                          name="fatherPhone"
                          placeholder="Father's number"
                          value={formData.fatherPhone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Mother's Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="motherName" className="block font-medium mb-1 text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="motherName" 
                          name="motherName" 
                          placeholder="Mother's full name"
                          value={formData.motherName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="motherEmail" className="block font-medium mb-1 text-gray-700">
                          Email Address 
                        </label>
                        <input 
                          type="email" 
                          id="motherEmail" 
                          name="motherEmail"
                          placeholder="mother'semail@gmail.com"
                          value={formData.motherEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="motherPhone" className="block font-medium mb-1 text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          id="motherPhone" 
                          name="motherPhone"
                          placeholder="Mother's number"
                          value={formData.motherPhone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="address" className="block font-medium mb-1 text-gray-700">
                          Home Address <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="address" 
                          name="address" 
                          placeholder="Current residence"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dedicationDate" className="block font-medium mb-1 text-gray-700">
                          Preferred Dedication Date <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="date" 
                          id="dedicationDate" 
                          name="dedicationDate"
                          value={formData.dedicationDate}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="additionalInfo" className="block font-medium mb-1 text-gray-700">
                          Additional Information
                        </label>
                        <textarea 
                          id="additionalInfo" 
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                          placeholder="Any additional information we should know..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Information Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="section-title ">What to Expect</h2>
              
              <div className="bg-gray-50 rounded-lg p-8  animate-delay-1">
                <h3 className="text-xl font-bold mb-4">On the Day of Dedication</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-church-600 flex items-center justify-center text-white shrink-0 mt-0.5 mr-3">
                      <span>1</span>
                    </div>
                    <p>
                      Please arrive early. 
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-church-600 flex items-center justify-center text-white shrink-0 mt-0.5 mr-3">
                      <span>2</span>
                    </div>
                    <p>
                      The pastor will invite families forward during the service for the dedication ceremony.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-church-600 flex items-center justify-center text-white shrink-0 mt-0.5 mr-3">
                      <span>3</span>
                    </div>
                    <p>
                      Parents will be asked to make a commitment to raise their child in a Godly home.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-church-600 flex items-center justify-center text-white shrink-0 mt-0.5 mr-3">
                      <span>4</span>
                    </div>
                    <p>
                      The pastor and elders will pray for your child and your family.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-church-600 flex items-center justify-center text-white shrink-0 mt-0.5 mr-3">
                      <span>5</span>
                    </div>
                    <p>
                      You will receive a dedication certificate.
                    </p>
                  </li>
                </ul>
                
                <div className="mt-8 bg-white p-4 rounded-md border border-gray-200">
                  <h4 className="font-bold mb-2">Important Note:</h4>
                  <p>
                    After submitting this form, you will be contacted by our children's ministry leader to confirm the dedication date and discuss any questions you may have.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ChildDedication;
