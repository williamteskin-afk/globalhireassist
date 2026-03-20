import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, Send, CheckCircle, Users, Briefcase, Shield } from 'lucide-react';
import SEO from '@/components/SEO';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INDUSTRIES = ['Agriculture', 'Hospitality', 'Construction', 'Landscaping', 'Manufacturing', 'Seafood Processing', 'Other'];

export default function EmployerPartnership() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_person: '', email: '', phone: '', industry: '', workers_needed: 1, job_description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_name || !form.contact_person || !form.email || !form.phone || !form.industry) {
      toast.error('Please fill in all required fields'); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/employers/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, workers_needed: parseInt(form.workers_needed) })
      });
      if (res.ok) { setSubmitted(true); toast.success('Registration submitted!'); }
      else { toast.error('Registration failed'); }
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full mx-4 text-center shadow-sm border border-slate-100">
          <CardContent className="p-10">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy font-serif">Registration Submitted!</h2>
            <p className="text-slate-600 mt-3 font-sans">Our team will review your registration and reach out within 1-2 business days.</p>
            <Button onClick={() => setSubmitted(false)} className="mt-6 bg-gold text-navy hover:bg-gold-light">Submit Another</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <SEO title="Employer Partnership" path="/employers" description="Partner with Global Hire Assist to find reliable, pre-screened international workers for your business. Register as an employer today." />
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">For Employers</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">Employer Partnership</h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl font-sans leading-relaxed">Partner with us to find reliable, pre-screened workers for your business needs.</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Pre-Screened Workers', desc: 'Access a pool of qualified, vetted candidates ready to work.' },
              { icon: Briefcase, title: 'Visa Compliance', desc: 'We handle all visa paperwork and regulatory compliance for you.' },
              { icon: Shield, title: 'Ongoing Support', desc: '24/7 support throughout the employment period.' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-4 p-6">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <b.icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-navy font-serif">{b.title}</h3>
                  <p className="text-slate-600 text-sm mt-1 font-sans">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-sm border border-slate-100 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-navy font-serif flex items-center gap-2"><Building2 className="h-6 w-6 text-gold" /> Employer Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} data-testid="employer-form" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Company Name *</Label>
                      <Input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} placeholder="Your company name" required data-testid="employer-company-input" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Contact Person *</Label>
                      <Input value={form.contact_person} onChange={e => setForm({...form, contact_person: e.target.value})} placeholder="Full name" required data-testid="employer-contact-input" className="h-12" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Email *</Label>
                      <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="company@example.com" required data-testid="employer-email-input" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Phone *</Label>
                      <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 (555) 000-0000" required data-testid="employer-phone-input" className="h-12" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Industry *</Label>
                      <Select value={form.industry} onValueChange={v => setForm({...form, industry: v})}>
                        <SelectTrigger className="h-12" data-testid="employer-industry-select"><SelectValue placeholder="Select industry" /></SelectTrigger>
                        <SelectContent>{INDUSTRIES.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Workers Needed</Label>
                      <Input type="number" min="1" value={form.workers_needed} onChange={e => setForm({...form, workers_needed: e.target.value})} data-testid="employer-workers-input" className="h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans font-medium">Job Description</Label>
                    <Textarea value={form.job_description} onChange={e => setForm({...form, job_description: e.target.value})} placeholder="Describe the job positions and requirements..." data-testid="employer-job-input" className="min-h-[120px]" />
                  </div>
                  <Button type="submit" disabled={loading} data-testid="employer-submit-btn" className="w-full bg-gold text-navy hover:bg-gold-light font-semibold py-6 text-base">
                    {loading ? 'Submitting...' : <><Send className="mr-2 h-5 w-5" /> Submit Registration</>}
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
