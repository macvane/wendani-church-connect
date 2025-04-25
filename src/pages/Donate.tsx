
import React from "react";
import Header from "@/components/layout/Header";
import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

const Donate = () => {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Adjusted Positioning */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="/placeholder.svg" 
              alt="Donate Hero Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Ministry</h1>
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
              <h2 className="text-3xl font-bold mb-4">Make a Donation</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your support enables us to continue our mission and serve our community. 
                All donations are securely processed through M-Pesa.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">Donate via M-Pesa</h3>
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
                  <span className="font-semibold">Paybill Number: XXXXX</span>
                  <br />
                  <span className="font-semibold">Account Number: Your Name</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Donate;
