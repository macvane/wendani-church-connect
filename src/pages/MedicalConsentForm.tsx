import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast'; // Assuming you have a toast hook
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const MedicalConsentForm  = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    birthDate: '',
    gender: '',
    station: '',
    phoneNo: '',
    church: '',
    district: '',
    clubClass: '',
    parentGuardian: '',
    familyInsuranceCompany: '',
    familyInsurancePolicyNumber: '',
    allergies: '',
    medications: '',
    physicalConditions: '',
    dietaryRequirements: '',
    parentGuardianSignature: '',
    date: '',
    daytimeCellphone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- CHANGE IS IN THIS FUNCTION ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This is the template string. It remains the same.
    const emailHtmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
          <h1 style="text-align: center; color: #333; margin-top: 0;">PERMISSION & MEDICAL CONSENT FORM</h1>
          <h2 style="text-align: center; color: #555; border-bottom: 2px solid #eee; padding-bottom: 10px;">UPPER NAIROBI EAST STATION ADVENTURERS</h2>
          <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px;">Participant's Details</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Age:</strong> ${formData.age}</p>
          <p><strong>Birth Date:</strong> ${formData.birthDate}</p>
          <p><strong>Gender:</strong> ${formData.gender}</p>
          <p><strong>Station:</strong> ${formData.station}</p>
          <p><strong>Phone No.:</strong> ${formData.phoneNo}</p>
          <p><strong>Church:</strong> ${formData.church}</p>
          <p><strong>District:</strong> ${formData.district}</p>
          <p><strong>Club Class:</strong> ${formData.clubClass}</p>
          <p><strong>Parent/Guardian:</strong> ${formData.parentGuardian}</p>
          <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">Event Details</h3>
          <p><strong>Event:</strong> Upper Nairobi East Station Adventurers Family Campout</p>
          <p><strong>Event Date:</strong> November 11 – 16 2025</p>
          <p><strong>Event Location:</strong> Kamiti Hostels</p>
          <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">Medical Information</h3>
          <p><strong>Family Insurance Company:</strong> ${formData.familyInsuranceCompany || 'N/A'}</p>
          <p><strong>Family Insurance Policy Number:</strong> ${formData.familyInsurancePolicyNumber || 'N/A'}</p>
          <p><strong>Allergies:</strong><br>${formData.allergies.replace(/\n/g, '<br>') || 'None specified'}</p>
          <p><strong>Medications:</strong><br>${formData.medications.replace(/\n/g, '<br>') || 'None specified'}</p>
          <p><strong>Physical Conditions Limiting Participation:</strong><br>${formData.physicalConditions.replace(/\n/g, '<br>') || 'None specified'}</p>
          <p><strong>Dietary Requirements and/or Allergies:</strong><br>${formData.dietaryRequirements.replace(/\n/g, '<br>') || 'None specified'}</p>
          <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">Authorization</h3>
          <p><strong>Parent/Guardian Signature (Full Name):</strong> ${formData.parentGuardianSignature}</p>
          <p><strong>Date of Signature:</strong> ${formData.date}</p>
          <p><strong>Daytime Cellphone Number:</strong> ${formData.daytimeCellphone}</p>
      </div>
    `;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Append the fully rendered HTML to the form data
    data.append('submission_details_html', emailHtmlTemplate);

    // Let's set a nice subject line as well
    data.append('subject', `Consent Form Submission for ${formData.name}`);
    
    // We remove the raw template field as it's not needed
    if (data.has('template')) {
      data.delete('template');
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Form Submitted Successfully",
          description: "Thank you for submitting the consent form.",
        });
        setFormData({
            name: '', age: '', birthDate: '', gender: '', station: '', phoneNo: '', church: '',
            district: '', clubClass: '', parentGuardian: '', familyInsuranceCompany: '',
            familyInsurancePolicyNumber: '', allergies: '', medications: '', physicalConditions: '',
            dietaryRequirements: '', parentGuardianSignature: '', date: '', daytimeCellphone: ''
        });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Helmet>
        <title>Adventurers Family Campout - Consent Form</title>
        <meta name="description" content="Permission and Medical Consent Form for the Upper Nairobi East Station Adventurers Family Campout." />
      </Helmet>
      <Header />
      <main>
        <section className="relative h-[300px] flex items-center justify-center bg-gray-700">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1533130093345-151b6a454c15?q=80&w=1470"
              alt="Adventurers Campout" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Adventurers Family Campout</h1>
            <p className="text-xl mt-2">Permission & Medical Consent Form</p>
          </div>
        </section>

        <section className="section bg-gray-50 py-12 md:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">UPPER NAIROBI EAST STATION ADVENTURERS</h2>
                    <p className="text-gray-600">Event: Upper Nairobi East Station Adventurers Family Campout</p>
                    <p className="text-gray-600">Date: November 11 – 16 2025 | Location: Kamiti Hostels</p>
                </div>
                
                <form onSubmit={handleSubmit} action="https://api.web3forms.com/submit" method="POST" className="space-y-8">
                  <input type="hidden" name="access_key" value="a57bc367-cd90-4dec-8655-22574d4df359" />
                  <input type="hidden" name="from_name" value="Adventurers Campout Form" />
                  {/* The hidden template input is no longer here */}

                  {/* All other form sections remain exactly the same */}
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Participant's Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries({ name: 'Name', age: 'Age', birthDate: 'Birth Date', gender: 'Gender', station: 'Station', phoneNo: 'Phone No.', church: 'Church', district: 'District', clubClass: 'Club Class', parentGuardian: 'Parent / Guardian Name(s)' }).map(([key, label]) => (
                            <div key={key} className={['clubClass', 'parentGuardian'].includes(key) ? 'md:col-span-2' : ''}>
                                <label htmlFor={key} className="block font-medium mb-1 text-gray-700">{label} <span className="text-red-500">*</span></label>
                                {key === 'gender' ? (
                                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white">
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                ) : (
                                    <input type={key === 'age' ? 'number' : key === 'birthDate' ? 'date' : 'text'} id={key} name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                                )}
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Medical Information</h3>
                    <div className="space-y-6">
                        {Object.entries({ familyInsuranceCompany: 'Family Insurance Company', familyInsurancePolicyNumber: 'Family Insurance Policy Number', allergies: 'Allergies: Please list all allergies your child has', medications: 'Medications: Please list all medications your child takes', physicalConditions: 'Physical Conditions: List any conditions that limit participation', dietaryRequirements: 'Dietary Requirements and/or Allergies to be observed' }).map(([key, label]) => (
                            <div key={key}>
                                <label htmlFor={key} className="block font-medium mb-1 text-gray-700">{label}</label>
                                {key.includes('Insurance') ? (
                                    <input type="text" id={key} name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"/>
                                ) : (
                                    <textarea id={key} name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
                                )}
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                     <h3 className="text-lg font-semibold mb-4 text-gray-800">Consent and Signature</h3>
                    <div className="prose prose-sm max-w-none text-gray-600">
                        <p><strong>Event Participation:</strong> I consent to my child's participation in this event, including transportation to and from the event (if applicable).</p>
                        <p><strong>Medical Permission:</strong> I give permission for adult leaders/volunteers to administer emergency treatment and contact emergency personnel. I understand our family's insurance is primary.</p>
                        <p><strong>Liability Release:</strong> On behalf of myself and my child, I fully release and agree not to sue the East Nairobi Field, its agents, and volunteers from any and all liability arising from my child's participation in this event.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                         <div>
                            <label htmlFor="parentGuardianSignature" className="block font-medium mb-1 text-gray-700">Parent/Guardian Signature (Type Full Name) <span className="text-red-500">*</span></label>
                            <input type="text" id="parentGuardianSignature" name="parentGuardianSignature" value={formData.parentGuardianSignature} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"/>
                        </div>
                        <div>
                            <label htmlFor="date" className="block font-medium mb-1 text-gray-700">Date <span className="text-red-500">*</span></label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"/>
                        </div>
                        <div>
                            <label htmlFor="daytimeCellphone" className="block font-medium mb-1 text-gray-700">Daytime Cellphone Number <span className="text-red-500">*</span></label>
                            <input type="tel" id="daytimeCellphone" name="daytimeCellphone" value={formData.daytimeCellphone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"/>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button type="submit" disabled={isSubmitting} className={`px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                      {isSubmitting ? 'Submitting...' : 'Submit Consent Form'}
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

export default MedicalConsentForm ;