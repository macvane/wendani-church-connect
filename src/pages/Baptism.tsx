import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { sendToGoogleSheet } from '@/utils/googleSheets';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  birthDate: z.string().min(1, { message: "Birth date is required." }),
  preferredDate: z.string().optional(),
  hasBibleStudy: z.boolean().default(false),
  hasBeenBaptized: z.boolean().default(false),
  howDidYouHear: z.string().min(1, { message: "Please tell us how you found out about us." }),
  questions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Baptism = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      preferredDate: '',
      hasBibleStudy: false,
      hasBeenBaptized: false,
      howDidYouHear: '',
      questions: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await sendToGoogleSheet({
        ...data,
      }, 'baptism');
      
      toast({
        title: "Baptism Request Submitted",
        description: "Thank you! Our pastoral team will contact you soon about next steps.",
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
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1559329255-2e7cb2e21ca7?q=80&w=2000" 
              alt="Baptism" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Baptism Request</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Take the first step in your commitment to Christ by requesting baptism.
            </p>
          </div>
        </section>
        
        {/* Form Section */}
        <section className="section bg-white">
          <div className="container max-w-3xl">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Baptism Request Form</h2>
                <p className="text-gray-600">
                  Please complete the form below to request baptism. Our pastoral team will contact you to discuss next steps.
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email address" {...field} />
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Your home address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="hasBeenBaptized"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Previously Baptized</FormLabel>
                            <FormDescription>
                              Have you been baptized before?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasBibleStudy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Bible Study</FormLabel>
                            <FormDescription>
                              Have you completed Bible studies?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* <FormField
                    control={form.control}
                    name="previousChurch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Church (if applicable)</FormLabel>
                        <FormControl>
                          <Input placeholder="Name of your previous church" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  
                  {/* <FormField
                    control={form.control}
                    name="baptismReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to be baptized?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please share your testimony and reasons for wanting to be baptized..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Baptism Date (if any)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="howDidYouHear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you hear about our church?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Friend or Family">Friend or Family</SelectItem>
                              <SelectItem value="Social Media">Social Media</SelectItem>
                              <SelectItem value="Website">Website</SelectItem>
                              <SelectItem value="Community Event">Community Event</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="questions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Questions or Additional Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any questions or additional information you'd like to share..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-church-600 hover:bg-church-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Baptism Request'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>
        
        {/* Additional Information */}
        <section className="section bg-gray-50">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">What to Expect</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-church-600 mr-2">1.</span>
                    <span>After submitting your request, a pastor will contact you within a week.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-church-600 mr-2">2.</span>
                    <span>We'll arrange Bible studies if you haven't completed them.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-church-600 mr-2">3.</span>
                    <span>You'll have an opportunity to share your testimony with the church.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-church-600 mr-2">4.</span>
                    <span>We'll schedule your baptism on a date that works for you and the church.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-church-600 mr-2">5.</span>
                    <span>You'll be provided with all necessary information about the baptism service.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">About Adventist Baptism</h3>
                <p className="text-gray-700 mb-4">
                  Seventh-day Adventist baptism is by full immersion in water, symbolizing the death, burial, and resurrection experience of Jesus Christ and the death of the old life of sin in the believer.
                </p>
                <p className="text-gray-700">
                  Baptism represents a public declaration of your acceptance of Jesus Christ as your Lord and Savior and your decision to join the Seventh-day Adventist Church community.
                </p>
                <div className="mt-4">
                  <Button variant="outline" className="flex items-center">
                    <Calendar className="mr-2" size={16} />
                    View Upcoming Baptism Dates
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Baptism;
