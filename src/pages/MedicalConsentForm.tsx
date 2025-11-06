import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const MedicalConsentForm = () => {
  const [formData, setFormData] = useState({
    name: '', age: '', birthDate: '', gender: '', station: '', phoneNo: '', church: '',
    district: '', clubClass: '', parentGuardian: '', familyInsuranceCompany: '',
    familyInsurancePolicyNumber: '', allergies: '', medications: '', physicalConditions: '',
    dietaryRequirements: '', parentGuardianSignature: '', date: '', daytimeCellphone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // --- THIS IS THE CORRECTED PART ---
    // We are now creating a clean, multi-line plain text string.
    const plainTextMessage = `
UPPER NAIROBI EAST STATION ADVENTURERS
PERMISSION & MEDICAL CONSENT FORM
==================================================

PARTICIPANT'S DETAILS
--------------------------------------------------
Name:                   ${formData.name}
Age:                    ${formData.age}
Birth Date:             ${formData.birthDate}
Gender:                 ${formData.gender}
Station:                ${formData.station}
Phone No.:              ${formData.phoneNo}
Church:                 ${formData.church}
District:               ${formData.district}
Club Class:             ${formData.clubClass}
Parent/Guardian:        ${formData.parentGuardian}

==================================================

EVENT DETAILS
--------------------------------------------------
Event:                  Upper Nairobi East Station Adventurers Family Campout
Event Date:             November 11 – 16 2025
Event Location:         Kamiti Hostels

==================================================

MEDICAL INFORMATION
--------------------------------------------------
Family Insurance Co.:   ${formData.familyInsuranceCompany || 'N/A'}
Insurance Policy #:     ${formData.familyInsurancePolicyNumber || 'N/A'}

Allergies:
${formData.allergies || 'None specified'}

Medications:
${formData.medications || 'None specified'}

Physical Conditions Limiting Participation:
${formData.physicalConditions || 'None specified'}

Dietary Requirements / Allergies:
${formData.dietaryRequirements || 'None specified'}

==================================================

AUTHORIZATION
--------------------------------------------------
Parent/Guardian Signature:  ${formData.parentGuardianSignature}
Date of Signature:          ${formData.date}
Daytime Cellphone:          ${formData.daytimeCellphone}
    `;

    const dataToSend = new FormData();

    dataToSend.append("access_key", "a57bc367-cd90-4dec-8655-22574d4df359");
    dataToSend.append("subject", `Consent Form Submission for ${formData.name}`);
    dataToSend.append("from_name", "Adventurers Campout Form");

    // We send the clean PLAIN TEXT string as the message.
    dataToSend.append("message", plainTextMessage);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: dataToSend,
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();

      if (result.success) {
        toast({
          title: "Form Submitted Successfully",
          description: "Thank you for submitting the consent form.",
        });
        // Reset form
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
    // The JSX for the form remains exactly the same. No changes are needed here.
    <>
      <Helmet>
        <title>Adventurers Family Campout - Consent Form</title>
        <meta name="description" content="Permission and Medical Consent Form for the Upper Nairobi East Station Adventurers Family Campout." />
      </Helmet>
      <Header />
      <main>
        <section className="relative h-[400px] flex items-center justify-center ">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://i.pinimg.com/1200x/01/30/79/013079765dd4203cd3ea804c385791dc.jpg" 
              alt="Prayer" 
              className="w-full h-full object-cover object-bottom"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Adventurers Family Campout</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Permission & Medical Consent Form
            </p>
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
                
                <form onSubmit={handleSubmit} className="space-y-8">
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
                        <p><strong>Event Participation:</strong> I understand that I am required to give my consent before my child can participate in this event. 
By signing this form, I hereby represent that I am the custodial parent or legal guardian of the 
child listed above and that I consent to my child’s participation in this event, including 
transportation to and from the event (if applicable).  </p>
                        <p><strong>Medical Permission:</strong> I also give permission for adult leaders/volunteers to administer emergency treatment, contact 
emergency personnel, and act in my stead in approving necessary medical care until I can 
reasonably be contacted. I understand that should any medical bills be incurred, our family’s 
insurance(s) will be primary and the East Nairobi Field liability insurance will be secondary.</p>
                        <p><strong>Liability Release:</strong> I, on behalf of myself, my spouse, next of kin, executors, heirs, assigns, or anyone else who 
might claim or sue on my or my child’s behalf, fully release and agree not to sue the East Nairobi 
Field and any of its agents, employees, and/or volunteers from any and all liability, including but 
not limited to any claims, losses, or liabilities , personal injury, disability, property damage, 
medical expenses, and/or theft, that may arise from or relate to my child’s participation in the 
event, including transportation to and from the event and any provision of medical care.</p>
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

export default MedicalConsentForm;