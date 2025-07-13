import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// If you still want toasts for general app messages, you can keep useToast
// import { useToast } from '@/hooks/use-toast'; 

interface Dependent {
  name: string;
  phone: string;
  relationship: string;
}

const Benevolence = () => {
  // Make sure this API key is correctly set in your .env file
  const apiKey = import.meta.env.VITE_WEB3FORMS_API_KEY; 
  
  // No longer strictly needed for Web3Forms direct submission, 
  // but good for showing immediate button state
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [dependents, setDependents] = useState<Dependent[]>([
    { name: '', phone: '', relationship: '' }
  ]);

  const handleDependentChange = (index: number, field: keyof Dependent, value: string) => {
    const newDependents = [...dependents];
    newDependents[index][field] = value;
    setDependents(newDependents);
  };

  const addDependent = () => {
    setDependents([...dependents, { name: '', phone: '', relationship: '' }]);
  };

  const removeDependent = (index: number) => {
    // Ensure at least one dependent field remains
    if (dependents.length > 1) {
      setDependents(dependents.filter((_, i) => i !== index));
    }
  };

  // Optional: A local submit handler to manage isSubmitting state
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // action="https://api.web3forms.com/submit"
    // No need for a custom fetch here.
    // Web3Forms will handle redirection after submission.
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
              src="https://i0.wp.com/lavingtonsda.org/wp-content/uploads/2024/03/why-does-death-exist-2048x1365-1.jpg?resize=768%2C512&ssl=1" 
              alt="Benevolence" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Benevolence Request</h1>
            <p className="text-xl max-w-3xl mx-auto">
              "Bear one another's burdens, and so fulfill the law of Christ." - Galatians 6:2
            </p>
          </div>
        </section>
        
        {/* Info Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title">About Our Benevolence Ministry</h2>
              <div className="prose max-w-none animate-delay-1">
                <p className="text-lg mb-4">
                  The Benevolence Ministry at Kahawa Wendani SDA Church seeks to provide temporary financial assistance to individuals and families experiencing economic hardship. We aim to help those in need while encouraging financial responsibility and self-sufficiency.
                </p>
                <p className="text-lg">
                  If you are facing a financial emergency or need assistance with basic necessities, please complete the form below. All requests are confidential and will be reviewed by our Benevolence Committee.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Request Form */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Benevolence Request Form</h2>
                
                {/* Add onSubmit handler to the form if you want to manage isSubmitting state */}
                <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
                  <input type="hidden" name="access_key" value={apiKey}></input>
                  {/* Web3Forms redirect URL */}
                  <input type="hidden" name="redirect" value="https://wendani-v2.vercel.app/thank-you" />
                  <input type="hidden" name="subject" value="Benevolence Registration Form" />
                  
                  {/* Head of Family Information */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Head of Family Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="headOfFamilyName" className="block font-medium mb-1 text-gray-700">
                          Head of Family Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="headOfFamilyName" 
                          name="headOfFamilyName" // Keep name for Web3Forms
                          placeholder="Full name"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="headOfFamilyPhone" className="block font-medium mb-1 text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          id="headOfFamilyPhone" 
                          name="headOfFamilyPhone" // Keep name for Web3Forms
                          placeholder="+254 700 000000"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="headOfFamilyEmail" className="block font-medium mb-1 text-gray-700">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          id="headOfFamilyEmail" 
                          name="headOfFamilyEmail" // Keep name for Web3Forms
                          placeholder="youremail@gmail.com"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="membershipStatus" className="block font-medium mb-1 text-gray-700">
                          Church Membership Status <span className="text-red-500">*</span>
                        </label>
                        <select 
                          id="membershipStatus" 
                          name="membershipStatus" // Keep name for Web3Forms
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        >
                          <option value="">Select Status</option>
                          <option value="registered-member">Registered Member of Wendani Church</option>
                          <option value="sabbath-school-member">Sabbath School Member</option>
                          <option value="regular-attendee">Regular Attendee</option>
                          <option value="visitor">Visitor</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Spouse Information */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Spouse Information (if applicable)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="spouseName" className="block font-medium mb-1 text-gray-700">
                          Spouse Name
                        </label>
                        <input 
                          type="text" 
                          id="spouseName" 
                          name="spouseName" // Keep name for Web3Forms
                          placeholder="Spouse's full name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="spouseChurch" className="block font-medium mb-1 text-gray-700">
                          Church They Attend
                        </label>
                        <input 
                          type="text" 
                          id="spouseChurch" 
                          name="spouseChurch" // Keep name for Web3Forms
                          placeholder="Church name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dependents - MODIFIED SECTION */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Dependents Information</h3>
                    <p className="text-sm text-gray-600 mb-4">List the dependents you are applying for (children, relatives, etc.)</p>
                    
                    {dependents.map((dependent, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Dependent {index + 1}</h4>
                          {dependents.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDependent(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-medium mb-1 text-gray-700">Name</label>
                            <input 
                              type="text" 
                              placeholder="Dependent's name"
                              value={dependent.name}
                              onChange={(e) => handleDependentChange(index, 'name', e.target.value)}
                              // *** IMPORTANT CHANGE HERE ***
                              name={`dependents[${index}][name]`} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block font-medium mb-1 text-gray-700">Phone Number</label>
                            <input 
                              type="tel" 
                              placeholder="Phone number"
                              value={dependent.phone}
                              onChange={(e) => handleDependentChange(index, 'phone', e.target.value)}
                              // *** IMPORTANT CHANGE HERE ***
                              name={`dependents[${index}][phone]`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block font-medium mb-1 text-gray-700">Relationship</label>
                            <input 
                              type="text" 
                              placeholder="e.g., Son, Daughter, Relative"
                              value={dependent.relationship}
                              onChange={(e) => handleDependentChange(index, 'relationship', e.target.value)}
                              // *** IMPORTANT CHANGE HERE ***
                              name={`dependents[${index}][relationship]`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addDependent}
                      className="text-church-600 hover:text-church-700 font-medium text-sm"
                    >
                      + Add Another Dependent
                    </button>
                  </div>
                  
                  {/* Request Details */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Request Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="reason" className="block font-medium mb-1 text-gray-700">
                          Reason for Request <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                          id="reason" 
                          name="reason" // Keep name for Web3Forms
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                          placeholder="Please explain your situation and the reason for your request..."
                        ></textarea>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="additionalInfo" className="block font-medium mb-1 text-gray-700">
                          Additional Information
                        </label>
                        <textarea 
                          id="additionalInfo" 
                          name="additionalInfo" // Keep name for Web3Forms
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                          placeholder="Any additional information that might be helpful for us to know..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <h4 className="font-bold mb-2 text-yellow-800">Important Information:</h4>
                    <ul className="list-disc pl-5 text-yellow-800">
                      <li>All information provided will be kept confidential</li>
                      <li>The Benevolence Committee typically reviews requests weekly</li>
                      <li>You will be contacted for additional information</li>
                      <li>Assistance is provided based on committee approval</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Ways to Help */}
        {/* <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title">Ways to Support Our Benevolence Fund</h2>
              <p className="section-subtitle animate-delay-1">
                Your generosity helps us provide assistance to those in need in our church and community.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="h-16 w-16 bg-church-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Financial Gifts</h3>
                  <p className="text-gray-600">
                    Donate to our benevolence fund through the church's regular giving channels.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg text-center animate-delay-1">
                  <div className="h-16 w-16 bg-church-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Volunteer</h3>
                  <p className="text-gray-600">
                    Join our benevolence committee or help with specific assistance projects.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg text-center animate-delay-2">
                  <div className="h-16 w-16 bg-church-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pray</h3>
                  <p className="text-gray-600">
                    Pray for those facing financial hardship and for wisdom for our benevolence committee.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <a href="/contact" className="btn btn-primary btn-lg">
                  Contact Us to Learn More
                </a>
              </div>
            </div>
          </div>
        </section> */}
        
      </main>
      
      <Footer />
    </>
  );
};

export default Benevolence;