import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  birthDate: z.string().min(1, { message: "Birth date is required." }),
  hasBibleStudy: z.boolean().default(false),
  hasBeenBaptized: z.boolean().default(false),
  questions: z.string().optional().or(z.literal('')),
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
      birthDate: '',
      hasBibleStudy: false,
      hasBeenBaptized: false,
      questions: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Prepare payload for backend
      const payload = {
        full_name: data.fullName,
        email: data.email || '', // optional
        phone_number: Number(data.phone),
        date_of_birth: data.birthDate,
        is_baptised: data.hasBeenBaptized,
        is_study: data.hasBibleStudy,
        additional_information: data.questions || '', // optional
      };

      const response = await fetch('http://127.0.0.1:8000/form/baptisms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Baptism Request Submitted",
          description: "Thank you! Our pastoral team will contact you soon about next steps.",
        });
        form.reset();
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        toast({
          title: "Submission Failed",
          description: errorData.detail || "There was a problem submitting your request.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting baptism form:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Baptism Form - Kahawa Wendani SDA Church</title>
        <meta
          name="description"
          content="Ready to take the next step in your faith journey? Register for baptism at Kahawa Wendani SDA Church in Nairobi."
        />
        <link rel="canonical" href="https://kahawawendanisda.org/baptism" />
      </Helmet>
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
                          <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} required />
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
                          <FormLabel>Email (optional)</FormLabel>
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
                          <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} required />
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
                          <FormLabel>Date of Birth <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="date" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="hasBeenBaptized"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Previously Baptized</FormLabel>
                            <FormDescription>Have you been baptized before?</FormDescription>
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
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Bible Study</FormLabel>
                            <FormDescription>Have you completed Bible studies?</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="questions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Questions or Additional Information (optional)</FormLabel>
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

        {/* Info Section */}
        <section className="section bg-gray-50">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">What to Expect</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>After submitting, a pastor will contact you within a week.</li>
                  <li>We'll arrange Bible studies if needed.</li>
                  <li>You’ll have a chance to share your testimony.</li>
                  <li>We’ll schedule your baptism at a suitable date.</li>
                  <li>All details about the service will be shared in advance.</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">About Adventist Baptism</h3>
                <p className="text-gray-700 mb-4">
                  Seventh-day Adventist baptism is by full immersion, symbolizing the death and resurrection of Jesus Christ and a new life in Him.
                </p>
                <p className="text-gray-700">
                  It represents your public declaration of faith and your decision to join the Seventh-day Adventist Church community.
                </p>
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
