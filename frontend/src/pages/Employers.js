import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Users, Clock, TrendingUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Employers = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/employers`, data);
      toast({
        title: 'Registration Successful',
        description: 'We will contact you shortly!'
      });
      setSubmitted(true);
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to submit registration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <Users className="w-8 h-8" />, title: 'Pre-Screened Applicants', description: 'Access verified, qualified international workers' },
    { icon: <Clock className="w-8 h-8" />, title: 'Faster Hiring', description: 'Streamlined process saves time and resources' },
    { icon: <TrendingUp className="w-8 h-8" />, title: 'Compliance Support', description: 'Navigate immigration requirements with ease' },
    { icon: <Building className="w-8 h-8" />, title: 'Trusted Partnership', description: 'Reliable service for your staffing needs' }
  ];

  return (
    <div className="font-open-sans">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/7644148/pexels-photo-7644148.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 data-testid="employers-heading" className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">For U.S. Employers</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Hire verified international workers with complete visa support and compliance assistance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="label-uppercase mb-2">Why Partner With Us</p>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-primary">Employer Benefits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-gold/10 text-accent-gold mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-poppins text-xl font-semibold text-primary mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-primary mb-4">Employer Registration</h2>
            <p className="text-slate-600">Fill out the form below and our team will contact you to discuss your hiring needs</p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-poppins text-2xl font-bold text-primary mb-2">Thank You!</h3>
              <p className="text-slate-600">Your registration has been received. We'll be in touch soon.</p>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input 
                      data-testid="input-company-name"
                      id="company_name" 
                      {...register('company_name', { required: 'Company name is required' })} 
                      placeholder="Your company name"
                      className="h-12"
                    />
                    {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contact_person">Contact Person *</Label>
                    <Input 
                      data-testid="input-contact-person"
                      id="contact_person" 
                      {...register('contact_person', { required: 'Contact person is required' })} 
                      placeholder="Full name"
                      className="h-12"
                    />
                    {errors.contact_person && <p className="text-red-500 text-sm mt-1">{errors.contact_person.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      data-testid="input-email"
                      id="email" 
                      type="email" 
                      {...register('email', { required: 'Email is required' })} 
                      placeholder="company@example.com"
                      className="h-12"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      data-testid="input-phone"
                      id="phone" 
                      {...register('phone', { required: 'Phone number is required' })} 
                      placeholder="+1 234 567 8900"
                      className="h-12"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="job_details">Job Details / Hiring Needs</Label>
                  <Textarea 
                    data-testid="textarea-job-details"
                    id="job_details" 
                    {...register('job_details')} 
                    placeholder="Describe the positions you're looking to fill, number of workers needed, and any specific requirements..."
                    rows={5}
                  />
                </div>

                <Button 
                  data-testid="submit-employer-btn"
                  type="submit" 
                  className="w-full bg-accent-gold hover:bg-accent-gold/90 text-white h-12 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Employers;