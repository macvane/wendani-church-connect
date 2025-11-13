import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Home, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';

const MpesaSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionData = location.state?.transactionData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Helmet>
        <title>Payment Successful - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Your M-Pesa payment has been successfully processed." />
        <link rel="canonical" href="https://kahawawendanisda.org/mpesa-success" />
      </Helmet>
      
      <div className="max-w-2xl w-full">
        <Card className="shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Payment Successful!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your generous contribution to Kahawa Wendani SDA Church.
              </p>
            </div>

            {transactionData && (
              <div className="bg-muted rounded-lg p-6 mb-8 space-y-3">
                <div className="flex items-center justify-center mb-4">
                  <Receipt className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Transaction Details</h2>
                </div>
                
                {transactionData.mpesa_receipt_number && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Receipt Number:</span>
                    <span className="font-semibold">{transactionData.mpesa_receipt_number}</span>
                  </div>
                )}
                
                {transactionData.amount && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">KES {transactionData.amount}</span>
                  </div>
                )}
                
                {transactionData.purpose && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Purpose:</span>
                    <span className="font-semibold">{transactionData.purpose}</span>
                  </div>
                )}
                
                {transactionData.phone_number && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Phone Number:</span>
                    <span className="font-semibold">{transactionData.phone_number}</span>
                  </div>
                )}

                {transactionData.transaction_date && (
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-semibold">
                      {new Date(transactionData.transaction_date).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                A confirmation has been sent to your phone via SMS.
                Your contribution helps us continue God's mission and serve our community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/donate')}
                variant="outline"
                className="flex items-center"
              >
                <Receipt className="mr-2" size={16} />
                Make Another Donation
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <Home className="mr-2" size={16} />
                Return Home
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 mt-8 border-t border-border">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-muted-foreground text-sm">
                  Contact us at{' '}
                  <a 
                    href="mailto:info@kahawawendanisda.org"
                    className="text-primary hover:underline"
                  >
                    info@kahawawendanisda.org
                  </a>
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Join Us</h3>
                <p className="text-muted-foreground text-sm">
                  Sabbath services every Saturday at 08:00 AM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MpesaSuccess;
