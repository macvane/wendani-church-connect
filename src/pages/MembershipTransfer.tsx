
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { sendToGoogleSheet } from '@/utils/googleSheets';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form schema
const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(2, "Address is required"),
  transferType: z.enum(["transferIn", "transferOut"], {
    required_error: "Please select a transfer type",
  }),
  fromChurch: z.string().min(2, "Church name is required"),
  fromDistrict: z.string().min(2, "District name is required"),
  fromConference: z.string().min(2, "Conference name is required"),
  toChurch: z.string().min(2, "Church name is required"),
  toDistrict: z.string().min(2, "District name is required"),
  toConference: z.string().min(2, "Conference name is required"),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const MembershipTransfer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      transferType: "transferIn",
      fromChurch: "",
      fromDistrict: "",
      fromConference: "",
      toChurch: "",
      toDistrict: "",
      toConference: "",
      additionalNotes: "",
    },
  });

  const transferType = form.watch("transferType");
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await sendToGoogleSheet({
        ...data,
      }, 'membership');
      
      toast({
        title: "Form Submitted",
        description: "Your membership transfer request has been submitted successfully.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1453486030486-0faf83940b41?q=80&w=1374&auto=format&fit=crop"
              alt="Membership Transfer" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Membership Transfer</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Request to transfer your membership to or from our church.
            </p>
          </div>
        </section>
        
        <section className="container py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-10">Membership Transfer Form</h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input 
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="John Doe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input 
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="john@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input 
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="+254 700 000000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input 
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Physical Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <input 
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                              placeholder="Your current address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold mt-2">Transfer Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="transferType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What Would You Like to Do? <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3 pt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="transferIn" id="transferIn" />
                                <label htmlFor="transferIn" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Transfer my membership from another church to Kahawa Wendani SDA Church
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="transferOut" id="transferOut" />
                                <label htmlFor="transferOut" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Transfer my membership from Kahawa Wendani SDA Church to another church
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* "From" Church Details */}
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium text-lg mt-2">
                        {transferType === "transferIn" ? "Transferring From (Current Church)" : "Transferring From (Kahawa Wendani SDA Church)"}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="fromChurch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Church Name <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <input 
                                  type="text"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  placeholder="Church name"
                                  value={transferType === "transferOut" ? "Kahawa Wendani SDA Church" : field.value}
                                  onChange={field.onChange}
                                  readOnly={transferType === "transferOut"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="fromDistrict"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>District <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <input 
                                  type="text"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  placeholder="District name"
                                  value={transferType === "transferOut" ? "Kahawa Wendani District" : field.value}
                                  onChange={field.onChange}
                                  readOnly={transferType === "transferOut"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="fromConference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Conference <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <input 
                                  type="text"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  placeholder="Conference name"
                                  value={transferType === "transferOut" ? "Central Kenya Conference" : field.value}
                                  onChange={field.onChange}
                                  readOnly={transferType === "transferOut"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    {/* "To" Church Details */}
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium text-lg mt-2">
                        {transferType === "transferIn" ? "Transferring To (Kahawa Wendani SDA Church)" : "Transferring To (New Church)"}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="toChurch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Church Name <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <input 
                                  type="text"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  placeholder="Church name"
                                  value={transferType === "transferIn" ? "Kahawa Wendani SDA Church" : field.value}
                                  onChange={field.onChange}
                                  readOnly={transferType === "transferIn"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="toDistrict"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>District <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <input 
                                  type="text"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  placeholder="District name"
                                  value={transferType === "transferIn" ? "Kahawa Wendani District" : field.value}
                                  onChange={field.onChange}
                                  readOnly={transferType === "transferIn"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="toConference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Conference <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <input 
                                  type="text"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  placeholder="Conference name"
                                  value={transferType === "transferIn" ? "Central Kenya Conference" : field.value}
                                  onChange={field.onChange}
                                  readOnly={transferType === "transferIn"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="w-full min-h-32"
                              placeholder="Any additional information you'd like to provide..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Transfer Request'}
                  </button>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default MembershipTransfer;
