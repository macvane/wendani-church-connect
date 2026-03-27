import React, { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';

interface Dependent {
  name: string;
  relationship: string;
}

const Benevolence = () => {
  const apiKey = import.meta.env.VITE_WEB3FORMS_BENEVOLENCE_API_KEY;
  const today = new Date().toISOString().split('T')[0];

  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dependents, setDependents] = useState<Dependent[]>([
    { name: '', relationship: 'Father' },
    { name: '', relationship: 'Mother' },
    { name: '', relationship: 'First Child' },
  ]);

  const handleDependentChange = (
    index: number,
    field: keyof Dependent,
    value: string
  ) => {
    const newDependents = [...dependents];
    newDependents[index][field] = value;
    setDependents(newDependents);
  };

  const getNextChildLabel = (currentDependents: Dependent[]) => {
    const childCount = currentDependents.filter((d) =>
      /child/i.test(d.relationship)
    ).length;

    const labels = [
      'First Child',
      'Second Child',
      'Third Child',
      'Fourth Child',
      'Fifth Child',
      'Sixth Child',
      'Seventh Child',
      'Eighth Child',
      'Ninth Child',
      'Tenth Child',
    ];

    return labels[childCount] || `Child ${childCount + 1}`;
  };

  const addDependent = () => {
    setDependents([
      ...dependents,
      { name: '', relationship: getNextChildLabel(dependents) },
    ]);
  };

  const removeDependent = (index: number) => {
    if (dependents.length > 1) {
      setDependents(dependents.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append('subject', 'New Benevolence Request from Website');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Request Submitted!',
          description: 'Your benevolence request has been sent successfully.',
        });

        formRef.current?.reset();
        setDependents([
          { name: '', relationship: 'Father' },
          { name: '', relationship: 'Mother' },
          { name: '', relationship: 'First Child' },
        ]);

        setTimeout(() => {
          window.location.href = 'http://kahawawendanisda.org/thank-you';
        }, 2000);
      } else {
        console.error('Submission Error:', result);
        toast({
          title: 'Submission Error',
          description: result.message || 'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Network or Fetch Error:', error);
      toast({
        title: 'Network Error',
        description:
          'Could not submit the form. Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Benevolence Form - Kahawa Wendani SDA Church</title>
        <meta
          name="description"
          content="Apply for the Benevolence fund at Kahawa Wendani SDA Church Nairobi."
        />
        <link rel="canonical" href="https://kahawawendanisda.org/benevolence" />
      </Helmet>

      <Header />

      <main className="">
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
              "Bear one another's burdens, and so fulfill the law of Christ." -
              Galatians 6:2
            </p>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title">About Our Benevolence Department</h2>
              <div className="prose max-w-none animate-delay-1">
                <p className="text-lg mb-4">
                  The Benevolence Department at Kahawa Wendani SDA Church is
                  dedicated to offering support to our registered church members
                  during one of life's most difficult moments: the loss of a loved
                  one. Our primary mission is to provide financial assistance to
                  help ease the immediate burdens that accompany bereavement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Benevolence Request Form
                </h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <input type="hidden" name="access_key" value={apiKey} />

                  <div>
                    <h3 className="text-lg font-bold mb-3 border-b border-gray-200 pb-2">
                      Request Type
                    </h3>

                    <p className="text-sm text-gray-600 mb-3">
                      Please indicate whether this is a new benevolence
                      registration or an update to existing details.
                    </p>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="requestType"
                          value="new-registration"
                          required
                        />
                        <span>New Registration</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="requestType"
                          value="update-details"
                          required
                        />
                        <span>Update Existing Details</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">
                      Contributor Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contributorName"
                          className="block font-medium mb-1 text-gray-700"
                        >
                          Contributor Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="contributorName"
                          name="contributorName"
                          placeholder="Full name"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contributorSpouse"
                          className="block font-medium mb-1 text-gray-700"
                        >
                          Spouse of Contributor
                        </label>
                        <input
                          type="text"
                          id="contributorSpouse"
                          name="contributorSpouse"
                          placeholder="Spouse's full name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contributorContact"
                          className="block font-medium mb-1 text-gray-700"
                        >
                          Contributor Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="contributorContact"
                          name="contributorContact"
                          placeholder="+254 700 000000"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="membershipStatus"
                          className="block font-medium mb-1 text-gray-700"
                        >
                          Church Membership Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="membershipStatus"
                          name="membershipStatus"
                          required
                          defaultValue=""
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        >
                          <option value="" disabled>
                            Select Status
                          </option>
                          <option value="registered-member">
                            Registered Member of Wendani Church
                          </option>
                          <option value="sabbath-school-member">
                            Sabbath School Member
                          </option>
                          <option value="regular-attendee">Regular Attendee</option>
                          <option value="visitor">Visitor</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">
                      Contributor&apos;s Spouse Contact (if applicable)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contributorSpouseContact"
                          className="block font-medium mb-1 text-gray-700"
                        >
                          Spouse Contact
                        </label>
                        <input
                          type="tel"
                          id="contributorSpouseContact"
                          name="contributorSpouseContact"
                          placeholder="+254 700 000000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">
                      Dependencies
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      Please list dependants in this order: contributor&apos;s father,
                      contributor&apos;s mother, then children.
                    </p>

                    {dependents.map((dependent, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{dependent.relationship}</h4>
                          {dependents.length > 1 && index >= 2 && (
                            <button
                              type="button"
                              onClick={() => removeDependent(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1 text-gray-700">
                              Name
                            </label>
                            <input
                              type="text"
                              placeholder={`Enter ${dependent.relationship.toLowerCase()} name`}
                              value={dependent.name}
                              onChange={(e) =>
                                handleDependentChange(index, 'name', e.target.value)
                              }
                              name={`dependents[${index}][name]`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block font-medium mb-1 text-gray-700">
                              Relationship
                            </label>
                            <input
                              type="text"
                              value={dependent.relationship}
                              name={`dependents[${index}][relationship]`}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:outline-none"
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
                      + Add Next Child
                    </button>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <h4 className="font-bold mb-2 text-yellow-800">
                      Important Information:
                    </h4>
                    <ul className="list-disc pl-5 text-yellow-800">
                      <li>
                        <span className="font-semibold">Registration fee:</span>{' '}
                        of KES.500 is applicable for new members (M-Pesa
                        No:0114220367)
                      </li>
                      <li>
                        <span className="font-semibold">Contributions:</span>{' '}
                        Members are required to make contributions every time a
                        member is bereaved
                      </li>
                      <li>
                        <span className="font-semibold">Benefit:</span> The committee
                        shall give a total of KES.50,000 (Fifty Thousand), to the
                        bereaved family. The bereaved members hsould not have
                        defaulted the past 3 consecutive cases.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Signature
                    </h3>
                    <p>
                      My signature below guarantees the information provided above
                      is accurate and true.
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label
                          htmlFor="signatureName"
                          className="block font-medium mb-1 text-gray-700"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="signatureName"
                          name="signatureName"
                          required
                          placeholder="Full Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="signatureDate"
                          className="block font-medium mb-1 text-gray-700"
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          id="signatureDate"
                          name="signatureDate"
                          value={today}
                          min={today}
                          max={today}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
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
