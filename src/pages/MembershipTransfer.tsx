import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { membershipAPI } from '@/utils/api';
import { Helmet } from 'react-helmet-async';

// Form schema
const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Valid phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(2, 'Address is required'),
  transferType: z.enum(['transferIn', 'transferOut'], {
    required_error: 'Please select a transfer type',
  }),
  fromChurch: z.string().min(2, 'Church name is required'),
  fromDistrict: z.string().min(2, 'District name is required'),
  fromConference: z.string().min(2, 'Conference name is required'),
  fromPoBox: z.string().optional(),
  toChurch: z.string().min(2, 'Church name is required'),
  toDistrict: z.string().min(2, 'District name is required'),
  toConference: z.string().min(2, 'Conference name is required'),
  toPoBox: z.string().optional(),
  additionalNotes: z.string().optional(),
  minute_number: z.string().min(2, "Church Board Minute Number is required"),
  first_reading: z.string().optional(),
  church_business_minute: z.string().optional(),
  second_reading: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const MembershipTransfer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      transferType: 'transferIn',
      fromChurch: '',
      fromDistrict: '',
      fromConference: '',
      fromPoBox: '',
      toChurch: 'Kahawa Wendani SDA Church',
      toDistrict: 'Kahawa District',
      toConference: 'Central Kenya Conference',
      toPoBox: '25685 - 00100', // Predefined P.O. Box default
      additionalNotes: '',
      minute_number: '',
    },
  });

  const { setValue } = form;
  const transferType = form.watch('transferType');

  useEffect(() => {
    if (transferType === 'transferIn') {
      // Set the "To" fields for Kahawa Wendani
      setValue('toChurch', 'Kahawa Wendani SDA Church', { shouldValidate: true });
      setValue('toDistrict', 'Kahawa District', { shouldValidate: true });
      setValue('toConference', 'Central Kenya Conference', { shouldValidate: true });
      setValue('toPoBox', ' 25685 - 00100', { shouldValidate: true });
      
      // Clear the "From" fields
      setValue('fromChurch', '', { shouldValidate: true });
      setValue('fromDistrict', '', { shouldValidate: true });
      setValue('fromConference', '', { shouldValidate: true });
      setValue('fromPoBox', '', { shouldValidate: true });

    } else if (transferType === 'transferOut') {
      // Set the "From" fields for Kahawa Wendani
      setValue('fromChurch', 'Kahawa Wendani SDA Church', { shouldValidate: true });
      setValue('fromDistrict', 'Kahawa District', { shouldValidate: true });
      setValue('fromConference', 'Central Kenya Conference', { shouldValidate: true });
      setValue('fromPoBox', '25685 - 00100', { shouldValidate: true });
      
      // Clear the "To" fields
      setValue('toChurch', '', { shouldValidate: true });
      setValue('toDistrict', '', { shouldValidate: true });
      setValue('toConference', '', { shouldValidate: true });
      setValue('toPoBox', '', { shouldValidate: true });
    }
  }, [transferType, setValue]);


  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await membershipAPI.create({
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phone,
        date_of_birth: data.dateOfBirth,
        physical_address: data.address,
        from_church_name: data.fromChurch,
        from_district_name: data.fromDistrict,
        from_conference_name: data.fromConference,
        from_address: data.fromPoBox || '',
        to_church_name: data.toChurch,
        to_district_name: data.toDistrict,
        to_conference_name: data.toConference,
        to_address: data.toPoBox || '',
        additional_notes: data.additionalNotes || undefined,
        board_minute_number: data.minute_number,
        first_reading_date: data.first_reading || undefined,
        second_reading_date: data.second_reading || undefined,
        business_number: data.church_business_minute || undefined,
      });

      if (response.ok) {
        toast({
          title: "Form Submitted",
          description: "Your membership transfer request has been submitted successfully.",
        });
        form.reset();
      } else {
        throw new Error('Failed to submit membership transfer request');
      }
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
      <Helmet>
        <title>Membership - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Officially join our church family or request a transfer of your membership." />
        <link rel="canonical" href="https://kahawawendanisda.org/membership-transfer" />
      </Helmet>
      <Header />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                  <input type='hidden' name='subject' value='Membership Transfer Form' />
                  {/* Personal Information fields */}
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
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="Your name"
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
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="youremail@example.com"
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
                                required
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
                                required
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
                              required
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

                  {/* Transfer Details */}
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
                              value={field.value}
                              className="space-y-3 pt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="transferIn" id="transferIn" />
                                <label htmlFor="transferIn" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Transfer my membership to Kahawa Wendani SDA Church
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="transferOut" id="transferOut" />
                                <label htmlFor="transferOut" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Transfer my membership from Kahawa Wendani SDA Church
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
                        Transferring From
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
                                  placeholder="Previous church name"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  {...field}
                                  readOnly={transferType === 'transferOut'}
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
                                  placeholder="District name"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  {...field}
                                  readOnly={transferType === 'transferOut'}
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
                                  placeholder="Conference name"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  {...field}
                                  readOnly={transferType === 'transferOut'}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="fromPoBox"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>P.O. Box <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="P.O. Box"
                                {...field}
                                readOnly={transferType === 'transferOut'}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* "To" Church Details */}
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium text-lg mt-2">
                        Transferring To
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
                                  placeholder="New church name"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  {...field}
                                  readOnly={transferType === 'transferIn'}
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
                                  placeholder="District name"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  {...field}
                                  readOnly={transferType === 'transferIn'}
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
                                  placeholder="Conference name"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                  {...field}
                                  readOnly={transferType === 'transferIn'}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="toPoBox"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>P.O. Box <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="P.O. Box"
                                {...field}
                                readOnly={transferType === 'transferIn'}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className='pt-4 border-t'>
                       <h4 className="font-medium text-lg mt-2">
                        Church Board Details (Church Transferring From)
                      </h4>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name="minute_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Church Board Minute Number <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="Board minute number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="first_reading"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Reading Date <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input
                                type="date"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="Board minute number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name="second_reading"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Second Reading Date <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input
                                type="date"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="Board minute number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="church_business_minute"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Church Business Minute Number <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                                placeholder="Business Minute Number"
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