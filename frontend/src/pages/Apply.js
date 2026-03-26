import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Apply = () => {
  const [step, setStep] = useState(1);
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const { toast } = useToast();
  const navigate = useNavigate();

  const visaType = watch('visa_type');

  const onSubmitApplication = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/applications`, data);
      setApplicationData(response.data);
      setStep(2);
      toast({
        title: 'Application Submitted',
        description: 'Please proceed to payment to complete your application.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to submit application',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (packageId) => {
    setLoading(true);
    try {
      const originUrl = window.location.origin;
      const response = await axios.post(`${BACKEND_URL}/api/payments/checkout`, {
        package_id: packageId,
        origin_url: originUrl,
        user_email: applicationData?.email,
        metadata: {
          application_id: applicationData?.id,
          full_name: applicationData?.full_name
        }
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error.response?.data?.detail || 'Failed to initiate payment',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return (
    <div className="font-open-sans min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 data-testid="apply-heading" className="font-poppins text-4xl sm:text-5xl font-bold mb-4">Apply for Your Visa</h1>
          <p className="text-lg text-white/90">Complete your application in 2 simple steps</p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-accent-gold' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-accent-gold text-white' : 'bg-slate-200'}`}>
              1
            </div>
            <span className="font-semibold hidden sm:inline">Application Form</span>
          </div>
          <div className="w-16 h-1 bg-slate-200"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-accent-gold' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-accent-gold text-white' : 'bg-slate-200'}`}>
              2
            </div>
            <span className="font-semibold hidden sm:inline">Payment</span>
          </div>
        </div>
      </div>

      {/* Step 1: Application Form */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="font-poppins text-2xl font-bold text-primary mb-6">Application Details</h2>
            <form onSubmit={handleSubmit(onSubmitApplication)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input 
                    data-testid="input-full-name"
                    id="full_name" 
                    {...register('full_name', { required: 'Full name is required' })} 
                    placeholder="Enter your full name"
                    className="h-12"
                  />
                  {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    data-testid="input-email"
                    id="email" 
                    type="email" 
                    {...register('email', { required: 'Email is required' })} 
                    placeholder="your@email.com"
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

                <div>
                  <Label htmlFor="visa_type">Visa Type *</Label>
                  <Select onValueChange={(value) => setValue('visa_type', value)}>
                    <SelectTrigger data-testid="select-visa-type" className="h-12">
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work-visa">Work Visa (H-2A / H-2B)</SelectItem>
                      <SelectItem value="tourist-visa">Tourist Visa</SelectItem>
                      <SelectItem value="visit-visa">Visit Visa</SelectItem>
                      <SelectItem value="study-visa">Study Visa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.visa_type && <p className="text-red-500 text-sm mt-1">{errors.visa_type.message}</p>}
                </div>

                <div>
                  <Label htmlFor="country">Country of Residence</Label>
                  <Input 
                    data-testid="input-country"
                    id="country" 
                    {...register('country')} 
                    placeholder="Your country"
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additional_info">Additional Information</Label>
                <Textarea 
                  data-testid="textarea-additional-info"
                  id="additional_info" 
                  {...register('additional_info')} 
                  placeholder="Any additional details you'd like to share..."
                  rows={4}
                />
              </div>

              <Button 
                data-testid="submit-application-btn"
                type="submit" 
                className="w-full bg-accent-gold hover:bg-accent-gold/90 text-white h-12 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Continue to Payment'}
              </Button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h2 className="font-poppins text-2xl font-bold text-primary">Application Submitted Successfully</h2>
                <p className="text-slate-600">Application ID: {applicationData?.id}</p>
              </div>
            </div>

            <div className="mb-8 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-poppins font-semibold text-primary mb-2">Your Details:</h3>
              <p className="text-slate-600">Name: {applicationData?.full_name}</p>
              <p className="text-slate-600">Email: {applicationData?.email}</p>
              <p className="text-slate-600">Visa Type: {applicationData?.visa_type}</p>
            </div>

            <h3 className="font-poppins text-xl font-bold text-primary mb-6">Select Payment Package</h3>
            
            <div className="space-y-4">
              <div 
                data-testid="package-basic"
                className="border-2 border-slate-200 rounded-xl p-6 hover:border-accent-gold transition-all cursor-pointer"
                onClick={() => handlePayment('basic_application')}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-poppins text-lg font-bold text-primary">Basic Application Fee</h4>
                  <div className="text-right">
                    <p className="font-poppins text-3xl font-bold text-accent-gold">$50</p>
                    <p className="text-xs text-slate-500">One-time payment</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Application processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Document review
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Basic support
                  </li>
                </ul>
                <Button data-testid="pay-basic-btn" className="w-full bg-accent-gold hover:bg-accent-gold/90" disabled={loading}>
                  {loading ? 'Processing...' : 'Pay with Stripe'}
                </Button>
              </div>

              <div 
                data-testid="package-express"
                className="border-2 border-slate-200 rounded-xl p-6 hover:border-accent-gold transition-all cursor-pointer"
                onClick={() => handlePayment('express_processing')}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-poppins text-lg font-bold text-primary">Express Processing</h4>
                  <div className="text-right">
                    <p className="font-poppins text-3xl font-bold text-accent-gold">$100</p>
                    <p className="text-xs text-slate-500">One-time payment</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Priority processing (2x faster)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Dedicated case manager
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    24/7 premium support
                  </li>
                </ul>
                <Button data-testid="pay-express-btn" className="w-full bg-accent-gold hover:bg-accent-gold/90" disabled={loading}>
                  {loading ? 'Processing...' : 'Pay with Stripe'}
                </Button>
              </div>

              <div 
                data-testid="package-premium"
                className="border-2 border-accent-gold rounded-xl p-6 bg-accent-gold/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-poppins text-lg font-bold text-primary">Premium Support</h4>
                    <p className="text-sm text-slate-600">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins text-3xl font-bold text-accent-gold">$25</p>
                    <p className="text-xs text-slate-500">Per month</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Ongoing case updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    WhatsApp support line
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Immigration consultation
                  </li>
                </ul>
                <Button 
                  data-testid="pay-premium-btn"
                  onClick={() => handlePayment('premium_support')} 
                  className="w-full bg-accent-gold hover:bg-accent-gold/90" 
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Subscribe with Stripe'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Apply;
