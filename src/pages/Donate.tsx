
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendToGoogleSheet } from "@/utils/googleSheets";
import Footer from "@/components/layout/Footer";

const Donate = () => {
  const [donationData, setDonationData] = useState({
    name: '',
    email: '',
    amount: '',
    purpose: 'tithe',
    phoneNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonationData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendToGoogleSheet({
        ...donationData,
      }, 'donation');
      
      toast({
        title: "Donation Information Recorded",
        description: "Thank you for your generosity. Your donation information has been recorded.",
      });
      
      setDonationData({
        name: '',
        email: '',
        amount: '',
        purpose: 'tithe',
        phoneNumber: '',
        message: '',
      });
    } catch (error) {
      console.error("Error recording donation:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem recording your donation information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Adjusted Positioning */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1633158829875-e5316a358c6f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Donate Hero Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Support God's Ministry</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Your generosity helps us spread God's love and make a difference in our community
            </p>
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <PiggyBank className="mx-auto h-16 w-16 text-church-600 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Worship Through Giving</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your support enables us to continue God's mission and serve our community. 
                All donations are securely processed through M-Pesa.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">Give via M-Pesa</h3>
                <p className="text-gray-600">Coming soon: Direct M-Pesa integration</p>
              </div>

              <Button 
                disabled
                className="w-full bg-church-600 hover:bg-church-700 text-white py-4 rounded-lg text-lg font-medium"
              >
                Donate Now (Coming Soon)
              </Button>

              <div className="mt-6 text-center text-gray-600">
                <p className="text-sm">
                  For manual M-Pesa donations, use our Paybill:
                  <br />
                  <span className="font-semibold">Paybill Number: 400222</span>
                  <br />
                  <span className="font-semibold">Account Number: 441211# (TITHE or OFFERING or LCB)</span>
                </p>
              </div>
            </div>
            
            {/* Donation Records Form */}
            {/* <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mt-8">
              <h3 className="text-xl font-semibold mb-4 text-center">Record Your Donation</h3>
              <p className="text-gray-600 mb-6 text-center">
                After making your donation via M-Pesa, please fill out this form to help us record your contribution correctly.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={donationData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={donationData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={donationData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (KES)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={donationData.amount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Donation
                  </label>
                  <select
                    id="purpose"
                    name="purpose"
                    value={donationData.purpose}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="tithe">Tithe</option>
                    <option value="offering">Offering</option>
                    <option value="lcb">Local Church Budget</option>
                    <option value="construction">Church Construction</option>
                    <option value="other">Other Purpose</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={donationData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-church-600 hover:bg-church-700 text-white py-4 rounded-lg text-lg font-medium"
                >
                  {isSubmitting ? 'Submitting...' : 'Record Donation'}
                </Button>
              </form>
            </div> */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Donate;
