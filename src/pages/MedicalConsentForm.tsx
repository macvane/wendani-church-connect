import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const MedicalConsentForm = () => {
  // Example array of names (replace or fetch dynamically if needed)
  const participantNames = [
  "Keelan Sobera",
  "Shane Charles",
  "Myra Mona",
  "Desmond Munene",
  "Hailey Waithithi",
  "Aaron Moturi",
  "Pendo Nyaboke",
  "Amanda Kimberly",
  "Johnson Andrew",
  "Reuben Hepha",
  "Joshua Siocha",
  "Caleb Siocha",
  "Raynelle Makambi",
  "Pascal Jared Kael",
  "Enock Thomas",
  "Naya Orioki",
  "Nima Orioki",
  "Sonia Maggie",
  "Gaddiel Kyle",
  "Geen Jaime",
  "Shalom Omondi",
  "Ariela Kemunto",
  "Anna Simiyu",
  "Abdiel Otuke",
  "Atarah Mor Ouma",
  "Adah Mich Ouma",
  "Jordan Mason",
  "Abigail Hawi",
  "Joemuel Ouma",
  "Rayden Momanyi",
  "Lyte Gladden",
  "James Mich",
  "Zoey Maya",
  "Ramah Agutu",
  "Tamara Ann",
  "Lesnah Thomas",
  "Bravinn Enock"
];


  const clubClasses = [
    { label: "Little Lamb (4 years)", value: "Little Lamb" },
    { label: "Early Bird (5 years)", value: "Early Bird" },
    { label: "Busy Bee (6 years)", value: "Busy Bee" },
    { label: "Sunbeam (7 years)", value: "Sunbeam" },
    { label: "Builder (8 years)", value: "Builder" },
    { label: "Helping Hand (9 years)", value: "Helping Hand" }
  ];

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    birthDate: '',
    gender: '',
    station: 'Upper Nairobi East',
    phoneNo: '',
    church: 'Kahawa Wendani',
    district: 'Kahawa',
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const plainTextMessage = `
                     UPPER NAIROBI EAST STATION ADVENTURERS
                   PERMISSION & MEDICAL CONSENT FORM
======================================================================

CHILD'S DETAILS
----------------------------------------------------------------------
Name:                        ${formData.name}
Age:                         ${formData.age}
Birth Date:                  ${formData.birthDate}
Gender:                      ${formData.gender}
Station:                     ${formData.station}
Phone No.:                   ${formData.phoneNo}
Church:                      ${formData.church}
District:                    ${formData.district}
Club Class:                  ${formData.clubClass}
Parent/Guardian(s):          ${formData.parentGuardian}

======================================================================

EVENT DETAILS
----------------------------------------------------------------------
Event:                       Upper Nairobi East Station Adventurers Family Campout
Event Date:                  November 11 – 16, 2025
Event Location:              Kamiti Hostels

======================================================================

MEDICAL INFORMATION
----------------------------------------------------------------------
Family Insurance Company:     ${formData.familyInsuranceCompany || 'N/A'}
Policy Number:                ${formData.familyInsurancePolicyNumber || 'N/A'}

Allergies:
${formData.allergies || 'None specified'}

Medications:
${formData.medications || 'None specified'}

Physical Conditions Limiting Participation:
${formData.physicalConditions || 'None specified'}

Dietary Requirements / Allergies:
${formData.dietaryRequirements || 'None specified'}

======================================================================

AUTHORIZATION
----------------------------------------------------------------------
Event Participation:
I understand that I am required to give my consent before my child can 
participate in this event. By signing this form, I represent that I am the 
custodial parent or legal guardian of the child listed above and consent to 
their participation, including transportation to and from the event.

Medical Permission:
I also give permission for adult leaders/volunteers to administer emergency 
treatment, contact emergency personnel, and act in my stead in approving 
necessary medical care until I can be reasonably contacted. I understand that 
our family’s insurance will be primary and the East Nairobi Field liability 
insurance will be secondary.

Liability Release:
I, on behalf of myself, my spouse, next of kin, executors, heirs, assigns, or 
anyone else who might claim or sue on my or my child’s behalf, fully release 
and agree not to sue the East Nairobi Field and any of its agents, employees, 
and/or volunteers from any and all liability, including but not limited to 
claims, losses, or damages arising from or relating to my child’s participation 
in the event, including transportation and any provision of medical care.

======================================================================

Parent/Guardian Signature:   ${formData.parentGuardianSignature}
Date of Signature:           ${formData.date}
Daytime Cellphone:           ${formData.daytimeCellphone}

======================================================================
`;


    const dataToSend = new FormData();
    dataToSend.append("access_key", "a57bc367-cd90-4dec-8655-22574d4df359");
    dataToSend.append("subject", `Consent Form Submission for ${formData.name}`);
    dataToSend.append("from_name", "Adventurers Campout Form");
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
        setFormData({
          name: '',
          age: '',
          birthDate: '',
          gender: '',
          station: 'Upper Nairobi East',
          phoneNo: '',
          church: 'Kahawa Wendani',
          district: 'Kahawa',
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
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Child's Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Name selection */}
                      <div>
                        <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        >
                          <option value="" disabled>Select Name</option>
                          {participantNames.map((n, i) => (
                            <option key={i} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>

                      {/* Age */}
                      <div>
                        <label htmlFor="age" className="block font-medium mb-1 text-gray-700">Age <span className="text-red-500">*</span></label>
                        <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                      </div>

                      {/* Birth Date */}
                      <div>
                        <label htmlFor="birthDate" className="block font-medium mb-1 text-gray-700">Birth Date <span className="text-red-500">*</span></label>
                        <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} max={new Date(Date.now() - 86400000).toISOString().split("T")[0]} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                      </div>

                      {/* Gender */}
                      <div>
                        <label htmlFor="gender" className="block font-medium mb-1 text-gray-700">Gender <span className="text-red-500">*</span></label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white">
                          <option value="" disabled>Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      {/* Station prefilled */}
                      <div>
                        <label htmlFor="station" className="block font-medium mb-1 text-gray-700">Station</label>
                        <input type="text" id="station" name="station" value={formData.station} readOnly disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700" />
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phoneNo" className="block font-medium mb-1 text-gray-700">Phone No. <span className="text-red-500">*</span></label>
                        <input type="tel" id="phoneNo" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                      </div>

                      {/* Church prefilled */}
                      <div>
                        <label htmlFor="church" className="block font-medium mb-1 text-gray-700">Church</label>
                        <input type="text" id="church" name="church" value={formData.church} readOnly disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700" />
                      </div>

                      {/* District prefilled */}
                      <div>
                        <label htmlFor="district" className="block font-medium mb-1 text-gray-700">District</label>
                        <input type="text" id="district" name="district" value={formData.district} readOnly disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700" />
                      </div>

                      {/* Club Class */}
                      <div className="md:col-span-2">
                        <label htmlFor="clubClass" className="block font-medium mb-1 text-gray-700">Club Class <span className="text-red-500">*</span></label>
                        <select
                          id="clubClass"
                          name="clubClass"
                          value={formData.clubClass}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        >
                          <option value="" disabled>Select Club Class</option>
                          {clubClasses.map((cls, i) => (
                            <option key={i} value={cls.value}>{cls.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Parent Guardian */}
                      <div className="md:col-span-2">
                        <label htmlFor="parentGuardian" className="block font-medium mb-1 text-gray-700">Parent / Guardian Name(s) <span className="text-red-500">*</span></label>
                        <input type="text" id="parentGuardian" name="parentGuardian" value={formData.parentGuardian} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                      </div>

                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Medical Information</h3>
                    <div className="space-y-6">
                      {Object.entries({
                        familyInsuranceCompany: 'Family Insurance Company',
                        familyInsurancePolicyNumber: 'Family Insurance Policy Number',
                        allergies: 'Allergies: Please list all allergies your child has',
                        medications: 'Medications: Please list all medications your child takes',
                        physicalConditions: 'Physical Conditions: List any conditions that limit participation',
                        dietaryRequirements: 'Dietary Requirements and/or Allergies to be observed'
                      }).map(([key, label]) => (
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

                  {/* Consent and Signature */}
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
                          event, including transportation to and from the event and any provision of medical care.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                         <div>
                            <label htmlFor="parentGuardianSignature" className="block font-medium mb-1 text-gray-700">Parent/Guardian Signature <span className="text-red-500">*</span></label>
                            <input type="text" placeholder='Type Full Name' id="parentGuardianSignature" name="parentGuardianSignature" value={formData.parentGuardianSignature} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"/>
                        </div>
                        <div>
                            <label htmlFor="date" className="block font-medium mb-1 text-gray-700">Date <span className="text-red-500">*</span></label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} max="2025-11-10" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"/>
                        </div>
                        <div>
                            <label htmlFor="daytimeCellphone" className="block font-medium mb-1 text-gray-700">Daytime Cellphone Number <span className="text-red-500">*</span></label>
                            <input type="tel" placeholder='Your CellPhone Number' id="daytimeCellphone" name="daytimeCellphone" value={formData.daytimeCellphone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"/>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button type="submit" disabled={isSubmitting} className={`px-8 py-3 bg-primary text-white rounded-md font-semibold transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
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
