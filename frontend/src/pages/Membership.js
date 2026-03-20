import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PLANS = [
  {
    id: 'consultation',
    name: 'Visa Consultation',
    price: '$75',
    desc: 'One-on-one consultation with an immigration expert.',
    features: ['30-minute consultation session', 'Visa eligibility assessment', 'Document checklist', 'Personalized advice'],
    popular: false,
  },
  {
    id: 'processing',
    name: 'Application Processing',
    price: '$150',
    desc: 'Full application processing and document support.',
    features: ['Complete application filing', 'Document review & preparation', 'Interview preparation', 'Status tracking', 'Priority support'],
    popular: true,
  },
  {
    id: 'premium_membership',
    name: 'Premium Support',
    price: '$25',
    period: '/month',
    desc: 'Ongoing premium support for your immigration journey.',
    features: ['Unlimited consultations', 'Priority application processing', 'Dedicated case manager', 'SMS/Email notifications', 'Job opportunity alerts'],
    popular: false,
  },
];

export default function Membership() {
  const [loading, setLoading] = useState('');

  const handleCheckout = async (packageId) => {
    setLoading(packageId);
    try {
      const res = await fetch(`${API}/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ package_id: packageId, origin_url: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch {
      toast.error('Payment error. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div>
      <SEO title="Service Plans & Pricing" path="/membership" description="Transparent pricing for visa consultation, application processing, and premium support. Choose the plan that fits your immigration needs." />
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
          <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Pricing</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">Service Plans</h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl mx-auto font-sans leading-relaxed">Choose the plan that fits your immigration needs. Transparent pricing with no hidden fees.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map(plan => (
              <Card key={plan.id} className={`card-hover relative overflow-hidden ${plan.popular ? 'border-2 border-gold shadow-lg scale-105' : 'border border-slate-100 shadow-sm'}`} data-testid={`plan-${plan.id}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="bg-gold text-navy rounded-none rounded-bl-lg px-4 py-1 text-xs font-semibold">
                      <Star className="h-3 w-3 mr-1 fill-navy" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-lg text-navy font-serif">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-navy font-serif">{plan.price}</span>
                    {plan.period && <span className="text-slate-500 text-sm font-sans">{plan.period}</span>}
                  </div>
                  <p className="text-slate-500 text-sm mt-2 font-sans">{plan.desc}</p>
                </CardHeader>
                <CardContent className="pt-4 pb-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-sans">
                        <CheckCircle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                        <span className="text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loading === plan.id}
                    data-testid={`checkout-${plan.id}-btn`}
                    className={`w-full font-semibold py-6 ${plan.popular ? 'bg-gold text-navy hover:bg-gold-light' : 'bg-navy text-white hover:bg-navy-light'}`}
                  >
                    {loading === plan.id ? 'Processing...' : <>Get Started <ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
