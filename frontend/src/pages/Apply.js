import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Send, CheckCircle } from 'lucide-react';
import SEO from '@/components/SEO';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const VISA_TYPES = [
  'H-2A Agricultural Work Visa',
  'H-2B Non-Agricultural Work Visa',
  'Tourist Visa (B-2)',
  'Visit Visa (B-1/B-2)',
  'Study Visa (F-1)',
];

export default function Apply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.name || '',
    email: user?.email || '',
    phone: '',
    visa_type: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.visa_type) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
      } else {
        toast.error('Failed to submit application');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full mx-4 text-center shadow-sm border border-slate-100">
          <CardContent className="p-10">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy font-serif">Application Submitted!</h2>
            <p className="text-slate-600 mt-3 font-sans">We have received your application. Our team will review it and get back to you within 2-3 business days.</p>
            <div className="flex gap-3 justify-center mt-8">
              <Button onClick={() => navigate('/membership')} className="bg-gold text-navy hover:bg-gold-light font-semibold">View Payment Plans</Button>
              <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-navy text-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <SEO title="Apply Now" path="/apply" description="Start your visa application with Global Hire Assist. Apply for H-2A, H-2B, Tourist, Visit, or Study visas with expert guidance." />
          <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Apply Now</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 leading-tight">Start Your Application</h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl font-sans">Fill out the form below and our team will guide you through the process.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-sm border border-slate-100 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-navy font-serif">Application Form</CardTitle>
                <p className="text-slate-500 text-sm font-sans">All fields marked with * are required</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} data-testid="apply-form" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="font-sans font-medium">Full Name *</Label>
                      <Input
                        id="full_name" value={form.full_name} required
                        onChange={e => setForm({...form, full_name: e.target.value})}
                        placeholder="Enter your full name"
                        data-testid="apply-name-input"
                        className="h-12 border-slate-200 focus:border-gold focus:ring-gold/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-sans font-medium">Email Address *</Label>
                      <Input
                        id="email" type="email" value={form.email} required
                        onChange={e => setForm({...form, email: e.target.value})}
                        placeholder="you@example.com"
                        data-testid="apply-email-input"
                        className="h-12 border-slate-200 focus:border-gold focus:ring-gold/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-sans font-medium">Phone Number *</Label>
                      <Input
                        id="phone" value={form.phone} required
                        onChange={e => setForm({...form, phone: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                        data-testid="apply-phone-input"
                        className="h-12 border-slate-200 focus:border-gold focus:ring-gold/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Type of Visa *</Label>
                      <Select value={form.visa_type} onValueChange={v => setForm({...form, visa_type: v})} required>
                        <SelectTrigger className="h-12 border-slate-200 focus:border-gold" data-testid="apply-visa-select">
                          <SelectValue placeholder="Select visa type" />
                        </SelectTrigger>
                        <SelectContent>
                          {VISA_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-sans font-medium">Additional Message</Label>
                    <Textarea
                      id="message" value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      placeholder="Any additional information or questions..."
                      data-testid="apply-message-input"
                      className="min-h-[120px] border-slate-200 focus:border-gold focus:ring-gold/50"
                    />
                  </div>
                  <Button type="submit" disabled={loading} data-testid="apply-submit-btn" className="w-full bg-gold text-navy hover:bg-gold-light font-semibold py-6 text-base">
                    {loading ? 'Submitting...' : <><Send className="mr-2 h-5 w-5" /> Submit Application</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
