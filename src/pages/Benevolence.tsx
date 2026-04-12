import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { benevolenceAPI } from '@/utils/api';

interface Dependent {
  name: string;
  relationship: string;
}

interface FormState {
  requestType: string;
  contributorName: string;
  contributorSpouse: string;
  contributorContact: string;
  contributorSpouseContact: string;
  email: string;
  membershipStatus: string;
  signatureName: string;
}

const EMPTY_FORM: FormState = {
  requestType: '',
  contributorName: '',
  contributorSpouse: '',
  contributorContact: '',
  contributorSpouseContact: '',
  email: '',
  membershipStatus: '',
  signatureName: '',
};

const INITIAL_DEPENDENTS: Dependent[] = [
  { name: '', relationship: 'Father' },
  { name: '', relationship: 'Mother' },
  { name: '', relationship: 'First Child' },
];

const INPUT_CLS =
  'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent';

const Benevolence = () => {
  const today = new Date().toISOString().split('T')[0];
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [dependents, setDependents] = useState<Dependent[]>(INITIAL_DEPENDENTS);

  // Generic field change handler
  const handleField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleDependentName = (index: number, value: string) =>
    setDependents((prev) =>
      prev.map((d, i) => (i === index ? { ...d, name: value } : d))
    );

  const getNextChildLabel = (current: Dependent[]) => {
    const count = current.filter((d) => /child/i.test(d.relationship)).length;
    const labels = [
      'First Child', 'Second Child', 'Third Child', 'Fourth Child', 'Fifth Child',
      'Sixth Child', 'Seventh Child', 'Eighth Child', 'Ninth Child', 'Tenth Child',
    ];
    return labels[count] ?? `Child ${count + 1}`;
  };

  const addDependent = () =>
    setDependents((prev) => [
      ...prev,
      { name: '', relationship: getNextChildLabel(prev) },
    ]);

  const removeDependent = (index: number) =>
    setDependents((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Serializer field names are explicitly camelCase (see BenevolenceSerializer).
    // Send them exactly as the serializer declares: requestType, contributorName, etc.
    const payload = {
      requestType: form.requestType,
      contributorName: form.contributorName,
      contributorSpouse: form.contributorSpouse,
      contributorContact: form.contributorContact,
      contributorSpouseContact: form.contributorSpouseContact,
      email: form.email,
      membershipStatus: form.membershipStatus,
      signatureName: form.signatureName,
      signatureDate: today,
      dependents: dependents
        .filter((d) => d.name.trim() !== '')
        .map((d) => ({ name: d.name, relationship: d.relationship })),
    };

    try {
      await benevolenceAPI.create(
        payload as Parameters<typeof benevolenceAPI.create>[0]
      );

      toast({
        title: 'Request Submitted!',
        description: 'Your benevolence request has been sent successfully.',
      });

      setForm(EMPTY_FORM);
      setDependents(INITIAL_DEPENDENTS);

      setTimeout(() => {
        window.location.href = 'http://kahawawendanisda.org/thank-you';
      }, 2000);
    } catch (error: any) {
      console.error('Benevolence submission error:', error);
      const description =
        error?.payload?.detail ||
        error?.payload?.message ||
        error?.message ||
        'An error occurred. Please try again.';
      toast({ title: 'Submission Error', description, variant: 'destructive' });
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

      <main>
        {/* Hero */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
            <img
              src="https://i0.wp.com/lavingtonsda.org/wp-content/uploads/2024/03/why-does-death-exist-2048x1365-1.jpg?resize=768%2C512&ssl=1"
              alt="Benevolence"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Benevolence Request</h1>
            <p className="text-xl max-w-3xl mx-auto">
              "Bear one another's burdens, and so fulfill the law of Christ." — Galatians 6:2
            </p>
          </div>
        </section>

        {/* About */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title">About Our Benevolence Department</h2>
              <p className="text-lg mb-4">
                The Benevolence Department at Kahawa Wendani SDA Church is dedicated to offering
                support to our registered church members during one of life's most difficult
                moments: the loss of a loved one. Our primary mission is to provide financial
                assistance to help ease the immediate burdens that accompany bereavement.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Benevolence Request Form</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* ── Request Type ── */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 border-b border-gray-200 pb-2">
                      Request Type
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Please indicate whether this is a new benevolence registration or an update
                      to existing details.
                    </p>
                    <div className="flex gap-6">
                      {[
                        { value: 'new-registration', label: 'New Registration' },
                        { value: 'update-details', label: 'Update Existing Details' },
                      ].map(({ value, label }) => (
                        <label key={value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="requestType"
                            value={value}
                            checked={form.requestType === value}
                            onChange={handleField('requestType')}
                            required
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* ── Contributor Information ── */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">
                      Contributor Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div>
                        <label htmlFor="contributorName" className="block font-medium mb-1 text-gray-700">
                          Contributor Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contributorName"
                          type="text"
                          placeholder="Full name"
                          required
                          value={form.contributorName}
                          onChange={handleField('contributorName')}
                          className={INPUT_CLS}
                        />
                      </div>

                      <div>
                        <label htmlFor="contributorSpouse" className="block font-medium mb-1 text-gray-700">
                          Spouse of Contributor
                        </label>
                        <input
                          id="contributorSpouse"
                          type="text"
                          placeholder="Spouse's full name"
                          value={form.contributorSpouse}
                          onChange={handleField('contributorSpouse')}
                          className={INPUT_CLS}
                        />
                      </div>

                      <div>
                        <label htmlFor="contributorContact" className="block font-medium mb-1 text-gray-700">
                          Contributor Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contributorContact"
                          type="tel"
                          placeholder="+254 700 000000"
                          required
                          value={form.contributorContact}
                          onChange={handleField('contributorContact')}
                          className={INPUT_CLS}
                        />
                      </div>

                      <div>
                        <label htmlFor="membershipStatus" className="block font-medium mb-1 text-gray-700">
                          Church Membership Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="membershipStatus"
                          required
                          value={form.membershipStatus}
                          onChange={handleField('membershipStatus')}
                          className={INPUT_CLS}
                        >
                          <option value="" disabled>Select Status</option>
                          <option value="registered-member">Registered Member of Wendani Church</option>
                          <option value="sabbath-school-member">Sabbath School Member</option>
                          <option value="regular-attendee">Regular Attendee</option>
                          <option value="visitor">Visitor</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block font-medium mb-1 text-gray-700">
                          Email Address{' '}
                          <span className="text-gray-400 text-sm font-normal">(optional)</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={handleField('email')}
                          className={INPUT_CLS}
                        />
                      </div>

                    </div>
                  </div>

                  {/* ── Spouse Contact ── */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">
                      Contributor's Spouse Contact <span className="text-sm font-normal text-gray-500">(if applicable)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="contributorSpouseContact" className="block font-medium mb-1 text-gray-700">
                          Spouse Contact
                        </label>
                        <input
                          id="contributorSpouseContact"
                          type="tel"
                          placeholder="+254 700 000000"
                          value={form.contributorSpouseContact}
                          onChange={handleField('contributorSpouseContact')}
                          className={INPUT_CLS}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Dependents ── */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">
                      Dependants
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Please list dependants in this order: contributor's father, contributor's
                      mother, then children.
                    </p>

                    {dependents.map((dependent, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{dependent.relationship}</h4>
                          {index >= 2 && (
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
                            <label className="block font-medium mb-1 text-gray-700">Name</label>
                            <input
                              type="text"
                              placeholder={`Enter ${dependent.relationship.toLowerCase()} name`}
                              value={dependent.name}
                              onChange={(e) => handleDependentName(index, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block font-medium mb-1 text-gray-700">Relationship</label>
                            <input
                              type="text"
                              value={dependent.relationship}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
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

                  {/* ── Important Info ── */}
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <h4 className="font-bold mb-2 text-yellow-800">Important Information:</h4>
                    <ul className="list-disc pl-5 text-yellow-800 space-y-1">
                      <li>
                        <span className="font-semibold">Registration fee:</span> KES 500 applicable
                        for new members (M-Pesa No: 0114220367)
                      </li>
                      <li>
                        <span className="font-semibold">Contributions:</span> Members are required
                        to make contributions every time a member is bereaved.
                      </li>
                      <li>
                        <span className="font-semibold">Benefit:</span> The committee shall give a
                        total of KES 50,000 to the bereaved family. The bereaved member should not
                        have defaulted the past 3 consecutive cases.
                      </li>
                    </ul>
                  </div>

                  {/* ── Signature ── */}
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Signature</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      My signature below guarantees the information provided above is accurate and true.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="signatureName" className="block font-medium mb-1 text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="signatureName"
                          type="text"
                          placeholder="Full Name"
                          required
                          value={form.signatureName}
                          onChange={handleField('signatureName')}
                          className={INPUT_CLS}
                        />
                      </div>
                      <div>
                        <label htmlFor="signatureDate" className="block font-medium mb-1 text-gray-700">
                          Date
                        </label>
                        <input
                          id="signatureDate"
                          type="date"
                          value={today}
                          readOnly
                          className={INPUT_CLS}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Submit ── */}
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