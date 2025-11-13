import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { PiggyBank, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { mpesaAPI } from "@/utils/api";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

const PURPOSE_OPTIONS = [
  { value: 'Tithe', label: 'Tithe' },
  { value: 'Offering', label: 'Offering' },
  { value: 'Local Church Budget (LCB)', label: 'Local Church Budget (LCB)' },
  { value: 'Camp Offering', label: 'Camp Offering' },
  { value: 'Camp Expenses', label: 'Camp Expenses' },
  { value: 'Evangelism', label: 'Evangelism' },
  { value: 'Station Dev', label: 'Station Development' },
  { value: 'Other', label: 'Other' },
];

const Donate = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    purpose: '',
    other_purpose_details: '',
    amount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePurposeChange = (value: string) => {
    setFormData(prev => ({ ...prev, purpose: value, other_purpose_details: '' }));
  };
  
  // Poll for transaction status
  useEffect(() => {
    if (!checkoutRequestId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await mpesaAPI.getTransactionStatus(checkoutRequestId);
        if (response.ok) {
          const data = await response.json();
          
          if (data.status === 'completed' || data.status === 'success') {
            setIsProcessing(false);
            setCheckoutRequestId(null);
            navigate('/mpesa-success', { state: { transactionData: data } });
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            setIsProcessing(false);
            setCheckoutRequestId(null);
            toast({
              title: "Payment Failed",
              description: data.message || "The payment was not completed. Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      setIsProcessing(false);
      setCheckoutRequestId(null);
      toast({
        title: "Payment Timeout",
        description: "Payment verification timed out. Please check your transaction history.",
        variant: "destructive",
      });
    }, 300000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [checkoutRequestId, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone_number || !formData.purpose || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.purpose === 'Other' && !formData.other_purpose_details) {
      toast({
        title: "Missing Information",
        description: "Please specify your purpose when selecting 'Other'.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await mpesaAPI.initiatePayment({
        name: formData.name,
        phone_number: formData.phone_number,
        email: formData.email || undefined,
        purpose: formData.purpose,
        other_purpose_details: formData.purpose === 'Other' ? formData.other_purpose_details : undefined,
        amount: amount,
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Payment Initiated",
          description: "Please enter your M-Pesa PIN on your phone to complete the payment.",
        });
        
        setCheckoutRequestId(data.checkout_request_id || data.CheckoutRequestID);
        setIsProcessing(true);
      } else {
        const errorData = await response.json();
        toast({
          title: "Payment Failed",
          description: errorData.message || "There was a problem initiating the payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Payment Failed",
        description: "There was a problem initiating the payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tithes & Offerings - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Support the mission and ministry of Kahawa Wendani SDA Church in Nairobi. Give your tithes and offerings securely online." />
        <link rel="canonical" href="https://kahawawendanisda.org/donate" />
      </Helmet>
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

        {/* Donation Form Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <PiggyBank className="mx-auto h-16 w-16 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Worship Through Giving</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your support enables us to continue God's mission and serve our community. 
                All donations are securely processed through M-Pesa.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      placeholder="254712345678"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose *</Label>
                    <Select value={formData.purpose} onValueChange={handlePurposeChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        {PURPOSE_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="1000"
                      min="1"
                      step="1"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {formData.purpose === 'Other' && (
                  <div className="space-y-2">
                    <Label htmlFor="other_purpose_details">Please specify purpose *</Label>
                    <Input
                      id="other_purpose_details"
                      name="other_purpose_details"
                      type="text"
                      placeholder="Specify your purpose"
                      value={formData.other_purpose_details}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to M-Pesa Payment'
                    )}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  You will receive an M-Pesa prompt on your phone to complete the payment.
                </p>
              </form>
            </div>

            {/* Manual M-Pesa Info */}
            <div className="mt-8 bg-muted rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Alternative: Manual M-Pesa</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Paybill Number:</strong> 247247
                </p>
                <p className="text-sm">
                  <strong>Account Number:</strong> 0110251033500
                </p>
                <p className="text-sm text-muted-foreground">
                  After making a manual payment, you can use the form above to record your donation for our records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Processing Dialog */}
        <Dialog open={isProcessing} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Processing Payment</DialogTitle>
              <DialogDescription className="text-center">
                Please complete the payment on your phone
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground text-center">
                Waiting for payment confirmation from M-Pesa...
              </p>
              <p className="text-xs text-muted-foreground text-center">
                This may take up to 2 minutes. Please don't close this window.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </>
  );
};

export default Donate;
