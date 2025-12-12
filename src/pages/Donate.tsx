import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { mpesaAPI } from "@/utils/api";
import { Helmet } from "react-helmet-async";
import { PiggyBank, Loader2 } from "lucide-react";

interface PurposeInfo {
  label: string;
  description?: string;
}

const PURPOSES_MAP: Record<string, PurposeInfo> = {
  Tithe: { label: "God's Tithe 10%", description: "" },
  Offering: { label: "Combined Offering 10%+", description: "50% retained at local church level for local activities. 50% remitted to conference for support of conference development and world mission activities." },
  "Local Church Budget (LCB)": { label: "Local Church Budget (LCB)", description: "Supports the local church congregation and its ministries, outreach programs, utilities, repairs and maintenance." },
  "Camp Offering": { label: "Camp Meeting Offering", description: "" },
  "Camp Expenses": { label: "Camp Meeting Expenses", description: "Meets the cost of camp meeting event." },
  Evangelism: { label: "Evangelism (Outreach)", description: "Support missionary work" },
  "Station Dev": { label: "Station Development", description: "Station improvement projects" },
  Other: { label: "Other", description: "Specify your custom purpose eg DEV" },
};

const PURPOSE_OPTIONS = [
  "Tithe",
  "Offering",
  "Local Church Budget (LCB)",
  "Camp Offering",
  "Camp Expenses",
  "Evangelism",
  "Station Dev",
  "Other",
];

const Donate = () => {
  const { toast } = useToast();

  const [payerInfo, setPayerInfo] = useState({ name: "", phone_number: "", email: "" });
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handlePayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayerInfo({ ...payerInfo, [e.target.name]: e.target.value });
  };

  const handleAmountChange = (purpose: string, value: string) => {
    setAmounts(prev => ({ ...prev, [purpose]: value }));
  };

  const totalAmount = PURPOSE_OPTIONS.reduce((sum, p) => sum + (Number(amounts[p]) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!payerInfo.name || !payerInfo.phone_number) {
      toast({ title: "Missing Information", description: "Please enter your name and phone number.", variant: "destructive" });
      return;
    }

    if (totalAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter at least one amount.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const purposesPayload = PURPOSE_OPTIONS.filter(p => Number(amounts[p]) > 0).map(p => ({
        purpose: p,
        amount: Number(amounts[p]),
        ...(p === "Other" && amounts["Other_details"] ? { other_purpose_details: amounts["Other_details"] } : {}),
      }));

      const response = await mpesaAPI.initiatePayment({
        name: payerInfo.name,
        phone_number: payerInfo.phone_number,
        email: payerInfo.email || undefined,
        purposes: purposesPayload,
      });

      if (response.ok) {
        const data = await response.json();
        const checkoutId = data.checkout_request_id;
        if (!checkoutId) throw new Error("No checkout_request_id returned from backend");
        setCheckoutRequestId(checkoutId);
        setPaymentStatus("processing");
        toast({ title: "Payment Initiated", description: "Check your phone for M-Pesa prompt." });
      } else {
        const data = await response.json();
        toast({ title: "Payment Failed", description: data.message || "Try again", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Payment Failed", description: "Try again", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
  if (!checkoutRequestId) return;

  let cancelled = false;

  const poll = async () => {
    if (cancelled) return;

    try {
      const response = await mpesaAPI.pollCoopStatus(checkoutRequestId);

      if (!response.ok) {
        console.error("Polling failed:", await response.text());
        setTimeout(poll, 3000);
        return;
      }

      const data = await response.json();

      switch (data.status) {
        case "SUCCESS":
          setPaymentStatus("success");
          setStatusMessage("Payment completed successfully!");
          setCheckoutRequestId(null);
          break;

        case "FAILED":
          setPaymentStatus("failed");
          setStatusMessage(data.coop_message_details || "Payment failed.");
          setCheckoutRequestId(null);
          break;

        case "PROCESSING":
          // Transaction is still pending, poll again
          setPaymentStatus("processing");
          setTimeout(poll, 3000);
          break;

        default:
          // Unknown status, also keep polling
          setPaymentStatus("processing");
          setTimeout(poll, 3000);
      }

    } catch (error) {
      console.error("Polling error:", error);
      setTimeout(poll, 3000);
    }
  };

  poll();

  return () => { cancelled = true; };
}, [checkoutRequestId]);

  const handleCloseModal = () => {
    setPaymentStatus("idle");
    setStatusMessage("");
  };

  return (
    <>
      <Helmet>
        <title>Tithes & Offerings - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Support the mission and ministry of Kahawa Wendani SDA Church. Give your tithes and offerings securely online." />
      </Helmet>

      <Header />
      <main>
        {/* Hero Section */}
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
              {/* Donation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-3">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Full Name"  name="name" value={payerInfo.name} onChange={handlePayerChange} />
            </div>
            <div className="flex flex-col space-y-3">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input id="phone_number" placeholder="Mpesa Number" name="phone_number" value={payerInfo.phone_number} onChange={handlePayerChange} />
            </div>
            {/* <div className="flex flex-col">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" name="email" value={payerInfo.email} onChange={handlePayerChange} />
            </div> */}
          </div>

          {/* Purposes */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
  {PURPOSE_OPTIONS.map((purpose) => {
    const info = PURPOSES_MAP[purpose];
    return (
      <div key={purpose} className="flex flex-col bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
        <Label className="my-3 font-medium">{info.label}</Label>
        {info.description && (
          <p className="text-sm text-muted-foreground mb-1">{info.description}</p>
        )}
        <div className="flex gap-2 items-center">
          {purpose === "Other" && (
            <Input
              type="text"
              placeholder="Specify purpose"
              value={amounts["Other_details"] || ""}
              onChange={e => setAmounts({ ...amounts, Other_details: e.target.value })}
              className="flex-1"
            />
          )}
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={amounts[purpose] || ""}
            onChange={e => handleAmountChange(purpose, e.target.value)}
            className={`flex-1 ${amounts[purpose] ? "border-green-400 bg-green-50" : ""}`}
          />
        </div>
      </div>
    );
  })}
</div>


          {/* Total */}
          <div className="text-right font-semibold text-lg">
            Total Giving: KES {totalAmount}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full py-2 text-lg">
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Proceed to M-Pesa Payment"}
          </Button>
        </form>
        <div className="mt-8 bg-muted rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Alternative: Manual M-Pesa</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Paybill Number:</strong> 400222
                </p>
                <p className="text-sm">
                  <strong>Account Number:</strong> 441211# TITHE or OFFERING specify purpose after #
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Payment Confirmation Modal */}
        <Dialog open={paymentStatus !== "idle"} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                {paymentStatus === "processing" && "Processing Payment"}
                {paymentStatus === "success" && "Payment Successful"}
                {paymentStatus === "failed" && "Payment Failed"}
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                {paymentStatus === "processing" && "Please complete the payment on your phone."}
                {paymentStatus === "success" && "Thank you for your giving!"}
                {paymentStatus === "failed" && statusMessage}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-6">
              {paymentStatus === "processing" && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
              {paymentStatus === "success" && <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">✓</div>}
              {paymentStatus === "failed" && <div className="h-16 w-16 bg-red-500 rounded-full flex items-center justify-center">✕</div>}
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </>
  );
};

export default Donate;
