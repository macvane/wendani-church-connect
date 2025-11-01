// import React, { useState } from 'react';
// import Header from '@/components/layout/Header';
// import Footer from '@/components/layout/Footer';
// import { Helmet } from 'react-helmet-async';
// import { useToast } from '@/hooks/use-toast';
// import { benevolenceAPI } from '@/utils/api';

// interface Dependent {
//   name: string;
//   phone: string;
//   age: string | number;
//   relationship: string;
// }

// const Benevolence = () => {
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     headOfFamilyName: '',
//     headOfFamilyPhone: '',
//     headOfFamilyEmail: '',
//     membershipStatus: '',
//     spouseName: '',
//     spouseChurch: '',
//     additionalInfo: '',
//   });
//   const [dependents, setDependents] = useState<Dependent[]>([
//     { name: '', phone: '', age: '', relationship: '' }
//   ]);

//   const handleDependentChange = (index: number, field: keyof Dependent, value: string) => {
//     const newDependents = [...dependents];
//     newDependents[index][field] = value;
//     setDependents(newDependents);
//   };

//   const addDependent = () => {
//     setDependents([...dependents, { name: '', phone: '', age: '', relationship: '' }]);
//   };

//   const removeDependent = (index: number) => {
//     if (dependents.length > 1) {
//       setDependents(dependents.filter((_, i) => i !== index));
//     }
//   };
  
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await benevolenceAPI.create({
//         head_full_name: formData.headOfFamilyName,
//         head_phone_number: formData.headOfFamilyPhone,
//         email: formData.headOfFamilyEmail,
//         membership_status: formData.membershipStatus,
//         spouse_name: formData.spouseName || undefined,
//         church_name: formData.spouseChurch || undefined,
//         additional: formData.additionalInfo || undefined,
//         dependents: dependents.map((d) => ({
//   name: d.name,
//   phone_number: d.phone,
//   age: Number(d.age), // Convert string to number
//   relationship: d.relationship,
// })),
//       });

//       if (response.ok) {
//         toast({
//           title: "Request Submitted!",
//           description: "Your benevolence request has been sent successfully.",
//         });
        
//         // Reset form
//         setFormData({
//           headOfFamilyName: '',
//           headOfFamilyPhone: '',
//           headOfFamilyEmail: '',
//           membershipStatus: '',
//           spouseName: '',
//           spouseChurch: '',
//           additionalInfo: '',
//         });
//         setDependents([{ name: '', phone: '', age: '',  relationship: '' }]);
//       } else {
//         throw new Error('Failed to submit benevolence request');
//       }
//     } catch (error) {
//       console.error("Error submitting benevolence request:", error);
//       toast({
//         title: "Submission Failed",
//         description: "Could not submit the form. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   return (
//     <>
//       <Helmet>
//         <title>Benevolence Form - Kahawa Wendani SDA Church</title>
//         <meta name="description" content="Apply for the Benevolence fund at Kahawa Wendani SDA Church Nairobi." />
//         <link rel="canonical" href="https://kahawawendanisda.org/benevolence" />
//       </Helmet>

//       <Header />
      
//       <main className="">
//         {/* Hero Section */}
//         <section className="relative h-[300px] flex items-center justify-center">
//           <div className="absolute inset-0">
//             <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
//             <img 
//               src="https://i0.wp.com/lavingtonsda.org/wp-content/uploads/2024/03/why-does-death-exist-2048x1365-1.jpg?resize=768%2C512&ssl=1" 
//               alt="Benevolence" 
//               className="w-full h-full object-cover object-center"
//             />
//           </div>
//           <div className="container relative z-20 text-white text-center">
//             <h1 className="mb-4">Benevolence Request</h1>
//             <p className="text-xl max-w-3xl mx-auto">
//               "Bear one another's burdens, and so fulfill the law of Christ." - Galatians 6:2
//             </p>
//           </div>
//         </section>
        
//         {/* Info Section */}
//         <section className="section bg-white">
//           <div className="container">
//             <div className="max-w-3xl mx-auto text-center">
//               <h2 className="section-title">About Our Benevolence Department</h2>
//               <div className="prose max-w-none animate-delay-1">
//                 <p className="text-lg mb-4">
//                   The Benevolence Department at Kahawa Wendani SDA Church is dedicated to offering support to our registered church members during one of life's most difficult moments: the loss of a loved one. Our primary mission is to provide financial assistance to help ease the immediate burdens that accompany bereavement.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
        
//         {/* Request Form */}
//         {/* Request Form */}
//         <section className="section bg-gray-50">
//           <div className="container">
//             <div className="max-w-4xl mx-auto">
//               <div className="bg-white rounded-lg shadow-md p-8">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Benevolence Request Form</h2>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Head of Family */}
//                   <div>
//                     <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">
//                       Head of Family Information
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Name */}
//                       <div>
//                         <label className="block font-medium mb-1 text-gray-700">
//                           Head of Family Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="Full name"
//                           value={formData.headOfFamilyName}
//                           onChange={(e) => setFormData({ ...formData, headOfFamilyName: e.target.value })}
//                           required
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
//                         />
//                       </div>

//                       {/* Phone */}
//                       <div>
//                         <label className="block font-medium mb-1 text-gray-700">
//                           Phone Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="tel"
//                           placeholder="+254 700 000000"
//                           value={formData.headOfFamilyPhone}
//                           onChange={(e) => setFormData({ ...formData, headOfFamilyPhone: e.target.value })}
//                           required
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
//                         />
//                       </div>

//                       {/* Email */}
//                       <div>
//                         <label className="block font-medium mb-1 text-gray-700">
//                           Email Address <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="email"
//                           placeholder="youremail@gmail.com"
//                           value={formData.headOfFamilyEmail}
//                           onChange={(e) => setFormData({ ...formData, headOfFamilyEmail: e.target.value })}
//                           required
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
//                         />
//                       </div>

//                       {/* Membership Status - aligned to backend */}
//                       <div>
//                         <label className="block font-medium mb-1 text-gray-700">
//                           Church Membership Status <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                           value={formData.membershipStatus}
//                           onChange={(e) => setFormData({ ...formData, membershipStatus: e.target.value })}
//                           required
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
//                         >
//                           <option value="" disabled>Select Status</option>
//                           <option value="visitor">Visitor</option>
//                           <option value="church_member">Church Member</option>
//                           <option value="sabbath_school_member">Sabbath School Member</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Dependents */}
//                   <div>
//                     <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Dependents Information</h3>
                    
//                     <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
//                       <h4 className="font-semibold text-blue-800 mb-2">Who Qualifies as a Dependent?</h4>
//                       <ul className="list-disc pl-5 text-blue-800 text-sm space-y-1">
//                         <li>Children under the age of 18 years old</li>
//                         <li>Children up to 21 years old if they are currently enrolled in college</li> 
//                       </ul>
//                     </div>
                    
//                     <p className="text-sm text-gray-600 mb-4">List the dependents you are applying for (children, relatives, etc.)</p>
//                     {dependents.map((dependent, index) => (
//                       <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
//                         <div className="flex justify-between items-center mb-3">
//                           <h4 className="font-medium">Dependent {index + 1}</h4>
//                           {dependents.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeDependent(index)}
//                               className="text-red-600 hover:text-red-800 text-sm"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                           <div>
//                             <label className="block font-medium mb-1 text-gray-700">Name</label>
//                             <input
//                               type="text"
//                               placeholder="Dependent's name"
//                               value={dependent.name}
//                               onChange={(e) => handleDependentChange(index, 'name', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
//                             />
//                           </div>

//                           <div>
//                             <label className="block font-medium mb-1 text-gray-700">Phone Number</label>
//                             <input
//                               type="tel"
//                               placeholder="Phone number"
//                               value={dependent.phone}
//                               onChange={(e) => handleDependentChange(index, 'phone', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
//                             />
//                           </div>

//                           <div>
//                             <label className="block font-medium mb-1 text-gray-700">Age</label>
//                             <input
//                               type="number"
//                               min="0"
//                               required
//                               placeholder="Age"
//                               value={dependent.age}
//                               onChange={(e) => handleDependentChange(index, 'age', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
//                             />
//                           </div>

//                           <div>
//                             <label className="block font-medium mb-1 text-gray-700">Relationship</label>
//                             <input
//                               type="text"
//                               placeholder="e.g. Son, Daughter"
//                               value={dependent.relationship}
//                               onChange={(e) => handleDependentChange(index, 'relationship', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-600"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     <button
//                       type="button"
//                       onClick={addDependent}
//                       className="text-church-600 hover:text-church-700 font-medium text-sm"
//                     >
//                       + Add Another Dependent
//                     </button>
//                   </div>

//                   {/* Submit */}
//                   <div className="flex justify-center pt-4">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
//                     >
//                       {isSubmitting ? 'Submitting...' : 'Submit Request'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </section>
        
//       </main>
      
//       <Footer />
//     </>
//   );
// };

// export default Benevolence;

import React, { useState, useRef } from 'react'; // Import useRef
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast'; // Re-enabled useToast for feedback

interface Dependent {
  name: string;
  phone: string;
  relationship: string;
}

const Benevolence = () => {
  const apiKey = import.meta.env.VITE_WEB3FORMS_BENEVOLENCE_API_KEY;
  
  // A ref to the form element to allow us to reset it after submission
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast(); // Initialize the toast hook

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
    if (dependents.length > 1) {
      setDependents(dependents.filter((_, i) => i !== index));
    }
  };
  
  // *** NEW: The onSubmit handler for the form ***
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitting(true);

    // Create FormData from the form element. This automatically collects all named inputs.
    const formData = new FormData(e.currentTarget);
    formData.append("subject", "New Benevolence Request from Website"); // Add subject
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Request Submitted!",
          description: "Your benevolence request has been sent successfully.",
        });
        
        // Clear the form for the next user
        formRef.current?.reset(); // Reset all standard form fields
        setDependents([{ name: '', phone: '', relationship: '' }]); // Reset the dependents state
        
        // Redirect to the thank-you page after a short delay
        setTimeout(() => {
          window.location.href = 'http://kahawawendanisda.org/thank-you';
        }, 2000);

      } else {
        console.error("Submission Error:", result);
        toast({
          title: "Submission Error",
          description: result.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
      toast({
        title: "Network Error",
        description: "Could not submit the form. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      // Set submitting to false whether it succeeded or failed
      // but delay it slightly if redirecting to avoid a flicker
      setTimeout(() => setIsSubmitting(false), 2000); 
    }
  };


  return (
    <>
      <Helmet>
        <title>Benevolence Form - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Apply for the Benevolence fund at Kahawa Wendani SDA Church Nairobi." />
        <link rel="canonical" href="https://kahawawendanisda.org/benevolence" />
      </Helmet>

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
              <h2 className="section-title">About Our Benevolence Department</h2>
              <div className="prose max-w-none animate-delay-1">
                <p className="text-lg mb-4">
                  The Benevolence Department at Kahawa Wendani SDA Church is dedicated to offering support to our registered church members during one of life's most difficult moments: the loss of a loved one. Our primary mission is to provide financial assistance to help ease the immediate burdens that accompany bereavement.
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
                
                {/* *** MODIFIED: Attached ref and onSubmit handler, removed action/method *** */}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* The access key is still required by Web3Forms */}
                  <input type="hidden" name="access_key" value={apiKey} />
                  {/* *** REMOVED: Hidden inputs for redirect and subject are now handled in JS *** */}
                  
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
                          name="headOfFamilyName"
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
                          name="headOfFamilyPhone"
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
                          name="headOfFamilyEmail"
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
                          name="membershipStatus"
                          required
                          defaultValue="" // Set default value for select
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        >
                          <option value="" disabled>Select Status</option>
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
                          name="spouseName"
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
                          name="spouseChurch"
                          placeholder="Church name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dependents Section */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Dependents Information</h3>
                    
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Who Qualifies as a Dependent?</h4>
                      <ul className="list-disc pl-5 text-blue-800 text-sm space-y-1">
                        <li>Children under the age of 18 years old</li>
                        <li>Children up to 21 years old if they are currently enrolled in college</li> 
                      </ul>
                    </div>
                    
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
                      {/* <div className="md:col-span-2">
                        <label htmlFor="reason" className="block font-medium mb-1 text-gray-700">
                          Reason for Request <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                          id="reason" 
                          name="reason"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                          placeholder="Please explain your situation and the reason for your request..."
                        ></textarea>
                      </div> */}
                      
                      <div className="md:col-span-2">
                        <label htmlFor="additionalInfo" className="block font-medium mb-1 text-gray-700">
                          Additional Information <span className='text-sm'>(Optional)</span>
                        </label>
                        <textarea 
                          id="additionalInfo" 
                          name="additionalInfo"
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
        
      </main>
      
      <Footer />
    </>
  );
};

export default Benevolence;