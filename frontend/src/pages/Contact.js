import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Send, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import SEO from '@/components/SEO';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else { toast.error('Failed to send message'); }
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <SEO title="Contact Us" path="/contact" description="Get in touch with Global Hire Assist for visa consultation, application support, or general inquiries. Call, email, or WhatsApp us today." />
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">Contact Us</h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl font-sans leading-relaxed">Have questions? Our team is here to help you with your visa and immigration needs.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-navy font-serif">Contact Information</h2>
              <p className="text-slate-600 font-sans">Reach out to us through any of the following channels.</p>
              <div className="space-y-5">
                <Card className="border border-slate-100">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm font-sans">Office Location</p>
                      <p className="text-slate-600 text-sm font-sans">Mesa, Arizona, USA</p>
                    </div>
                  </CardContent>
                </Card>
                <a href="https://wa.me/14472763403" target="_blank" rel="noopener noreferrer" data-testid="contact-whatsapp">
                  <Card className="card-hover border border-slate-100 cursor-pointer">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm font-sans">WhatsApp</p>
                        <p className="text-slate-600 text-sm font-sans">+1 (447) 276-3403</p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
                <a href="tel:+14472763403" data-testid="contact-phone">
                  <Card className="card-hover border border-slate-100 cursor-pointer">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm font-sans">Phone</p>
                        <p className="text-slate-600 text-sm font-sans">+1 (447) 276-3403</p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
                <a href="mailto:globalhireassist@gmail.com" data-testid="contact-email">
                  <Card className="card-hover border border-slate-100 cursor-pointer">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm font-sans">Email</p>
                        <p className="text-slate-600 text-sm font-sans">globalhireassist@gmail.com</p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border border-slate-100">
                <CardHeader>
                  <CardTitle className="text-2xl text-navy font-serif">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-sans font-medium">Name *</Label>
                        <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" required data-testid="contact-name-input" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-sans font-medium">Email *</Label>
                        <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required data-testid="contact-email-input" className="h-12" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-sans font-medium">Phone</Label>
                        <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 (555) 000-0000" data-testid="contact-phone-input" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-sans font-medium">Subject</Label>
                        <Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" data-testid="contact-subject-input" className="h-12" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Message *</Label>
                      <Textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us about your visa needs..." required data-testid="contact-message-input" className="min-h-[150px]" />
                    </div>
                    <Button type="submit" disabled={loading} data-testid="contact-submit-btn" className="w-full bg-gold text-navy hover:bg-gold-light font-semibold py-6 text-base">
                      {loading ? 'Sending...' : <><Send className="mr-2 h-5 w-5" /> Send Message</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
