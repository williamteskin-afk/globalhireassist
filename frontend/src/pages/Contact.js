import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/contact`, data);
      toast({
        title: 'Message Sent',
        description: 'We will get back to you soon!'
      });
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-open-sans">
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 data-testid="contact-heading" className="font-poppins text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-white/90">Get in touch with our team. We're here to help!</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-poppins text-3xl font-bold text-primary mb-6">Get In Touch</h2>
              <p className="text-slate-600 mb-8">
                Have questions about our visa services? We're here to help. Reach out to us through any of the following channels.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-primary mb-1">Email</h3>
                    <a href="mailto:globalhireassist@gmail.com" className="text-slate-600 hover:text-accent-gold transition-colors">
                      globalhireassist@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-primary mb-1">WhatsApp</h3>
                    <a href="https://wa.me/14472763403" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-accent-gold transition-colors">
                      +1 447 276 3403
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-primary mb-1">Location</h3>
                    <p className="text-slate-600">Mesa, Arizona, USA</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-poppins font-semibold text-primary mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                <h2 className="font-poppins text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8" />
                    </div>
                    <h3 className="font-poppins text-xl font-bold text-primary mb-2">Message Sent!</h3>
                    <p className="text-slate-600">We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <Input 
                        data-testid="input-name"
                        id="name" 
                        {...register('name', { required: 'Name is required' })} 
                        placeholder="John Doe"
                        className="h-12"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        data-testid="input-email"
                        id="email" 
                        type="email" 
                        {...register('email', { required: 'Email is required' })} 
                        placeholder="john@example.com"
                        className="h-12"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        data-testid="textarea-message"
                        id="message" 
                        {...register('message', { required: 'Message is required' })} 
                        placeholder="How can we help you?"
                        rows={6}
                      />
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                    </div>

                    <Button 
                      data-testid="submit-contact-btn"
                      type="submit" 
                      className="w-full bg-accent-gold hover:bg-accent-gold/90 text-white h-12 text-lg font-semibold"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;