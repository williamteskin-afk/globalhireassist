import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Send, Globe, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO = "https://customer-assets.emergentagent.com/job_hire-assist-portal/artifacts/z27n0xxm_22178.png";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/newsletter/subscribe`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      toast.success(data.message);
      setEmail('');
    } catch {
      toast.error('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer data-testid="footer" className="bg-navy text-white">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <img src={LOGO} alt="Global Hire Assist" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-white/70 text-sm leading-relaxed mt-3">
              Connecting talented individuals with life-changing work and travel opportunities across the United States.
            </p>
            <p className="text-gold font-semibold text-sm mt-4 italic font-serif">Your Trusted Visa Partner</p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-5 text-gold">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {[['/', 'Home'], ['/about', 'About Us'], ['/programs', 'Programs'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} className="text-white/70 hover:text-gold text-sm transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" /> {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-5 text-gold">Contact Info</h4>
            <div className="flex flex-col gap-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span>Mesa, Arizona, USA</span>
              </div>
              <a href="https://wa.me/14472763403" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold transition-colors" data-testid="footer-whatsapp">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                +1 (447) 276-3403
              </a>
              <a href="mailto:globalhireassist@gmail.com" className="flex items-center gap-3 hover:text-gold transition-colors" data-testid="footer-email">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                globalhireassist@gmail.com
              </a>
              <a href="https://globalhireassist.com" className="flex items-center gap-3 hover:text-gold transition-colors">
                <Globe className="h-4 w-4 text-gold shrink-0" />
                globalhireassist.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-5 text-gold">Newsletter</h4>
            <p className="text-white/70 text-sm mb-4">Get visa updates and tips delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} data-testid="newsletter-form" className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                required
                data-testid="newsletter-email-input"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-10 text-sm focus:border-gold"
              />
              <Button type="submit" disabled={loading} data-testid="newsletter-submit-btn" size="icon" className="bg-gold text-navy hover:bg-gold-light shrink-0 h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Global Hire Assist. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/membership" className="hover:text-gold transition-colors">Membership</Link>
            <Link to="/employers" className="hover:text-gold transition-colors">For Employers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
