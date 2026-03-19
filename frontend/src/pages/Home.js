import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Globe, FileText, Users, Star, CheckCircle, Phone, Briefcase, MapPin } from 'lucide-react';

const HERO_BG = "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=1920&q=80";

const SERVICES = [
  { icon: FileText, title: 'Visa Processing', desc: 'Expert guidance through every step of your visa application process.' },
  { icon: Briefcase, title: 'Job Placement', desc: 'Direct connections with verified U.S. employers seeking international talent.' },
  { icon: Shield, title: 'Document Support', desc: 'Complete document preparation and verification for your application.' },
  { icon: Users, title: 'Consultation', desc: 'One-on-one sessions with experienced immigration consultants.' },
];

const PROGRAMS = [
  { slug: 'h2a-visa', title: 'H-2A Work Visa', desc: 'Temporary agricultural work opportunities in the United States.', image: 'https://images.unsplash.com/photo-1752242931857-93f947f304b7?w=600&q=80', badge: 'Agricultural' },
  { slug: 'h2b-visa', title: 'H-2B Work Visa', desc: 'Non-agricultural seasonal work in hospitality, landscaping & more.', image: 'https://images.unsplash.com/photo-1759038085950-1234ca8f5fed?w=600&q=80', badge: 'Non-Agricultural' },
  { slug: 'tourist-visa', title: 'Tourist Visa', desc: 'Explore the USA with a B-2 tourist visa for leisure travel.', image: 'https://images.unsplash.com/photo-1702306257553-3edb907edd0a?w=600&q=80', badge: 'B-2 Visa' },
  { slug: 'study-visa', title: 'Study Visa', desc: 'Pursue education at top American universities and colleges.', image: 'https://images.unsplash.com/photo-1758270703250-80a6387439ba?w=600&q=80', badge: 'F-1 Visa' },
];

const STATS = [
  { value: '500+', label: 'Successful Applications' },
  { value: '15+', label: 'Partner Countries' },
  { value: '98%', label: 'Success Rate' },
  { value: '24/7', label: 'Support Available' },
];

const TESTIMONIALS = [
  { name: 'Carlos M.', role: 'H-2A Worker', text: 'Global Hire Assist made my dream of working in America a reality. The process was smooth and professional from start to finish.' },
  { name: 'Maria L.', role: 'Study Visa Holder', text: 'Their guidance on the F-1 visa application was invaluable. I am now studying at my dream university in the US.' },
  { name: 'James K.', role: 'U.S. Employer', text: 'As an employer, finding reliable seasonal workers was always a challenge. Global Hire Assist connects us with hardworking, pre-screened candidates.' },
];

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Home() {
  const [latestJobs, setLatestJobs] = useState([]);
  useEffect(() => {
    fetch(`${API}/jobs`).then(r => r.json()).then(d => setLatestJobs(d.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="USA Skyline" className="w-full h-full object-cover" />
          <div className="hero-gradient absolute inset-0" />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-3xl animate-fade-in-up">
            <Badge className="bg-gold/20 text-gold border-gold/30 font-sans uppercase tracking-wider text-xs px-4 py-1 mb-6">
              Your Trusted Visa Partner
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Your Gateway to<br />
              <span className="text-gold">Global Opportunities</span>
            </h1>
            <p className="text-white/80 text-lg mt-6 max-w-xl leading-relaxed font-sans">
              Connecting talented individuals with life-changing work and travel opportunities across the United States.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Button asChild className="bg-gold text-navy hover:bg-gold-light font-semibold px-8 py-6 text-base shadow-lg" data-testid="hero-apply-btn">
                <Link to="/apply">Apply Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-base font-semibold" data-testid="hero-explore-btn">
                <Link to="/programs">Explore Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-32 bg-white" data-testid="services-section">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-3">Comprehensive Visa Services</h2>
            <p className="text-slate-600 mt-4 leading-relaxed font-sans">From consultation to visa approval, we handle every aspect of your immigration journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <Card key={i} className="card-hover border border-slate-100 shadow-sm bg-white group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-navy/5 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                    <s.icon className="h-7 w-7 text-navy group-hover:text-gold transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2 font-serif">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-sans">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 md:py-32 bg-slate-50" data-testid="programs-section">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Our Programs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-3">Visa Programs We Support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="program-cards">
            {PROGRAMS.map(p => (
              <Link key={p.slug} to={`/programs/${p.slug}`} className="group">
                <Card className="card-hover overflow-hidden border-0 shadow-sm bg-white h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-navy/90 text-white text-xs">{p.badge}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-navy mb-2 font-serif">{p.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-sans">{p.desc}</p>
                    <span className="inline-flex items-center gap-1 text-gold font-semibold text-sm mt-4 group-hover:gap-2 transition-all font-sans">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-navy text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gold font-serif">{s.value}</div>
                <p className="text-white/70 text-sm mt-2 font-sans">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {latestJobs.length > 0 && (
        <section className="py-20 md:py-28 bg-white" data-testid="latest-jobs-section">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Latest Openings</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mt-3">Job Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestJobs.map(job => (
                <Link key={job.id} to="/jobs" className="group">
                  <Card className="card-hover border border-slate-100 h-full">
                    <CardContent className="p-6">
                      <Badge className="bg-navy/10 text-navy text-xs mb-3">{job.visa_type}</Badge>
                      <h3 className="text-lg font-bold text-navy font-serif mb-2">{job.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 font-sans mb-3">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-gold" /> {job.positions} pos.</span>
                      </div>
                      <p className="text-slate-600 text-sm font-sans line-clamp-2">{job.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy/5 font-semibold">
                <Link to="/jobs">View All Jobs <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-1 bg-gold mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-navy">Ready to Start Your Journey?</h2>
            <p className="text-slate-600 mt-4 text-lg leading-relaxed font-sans">Take the first step toward your American dream. Our team is ready to guide you.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button asChild className="bg-gold text-navy hover:bg-gold-light font-semibold px-8 py-6 text-base" data-testid="cta-apply-btn">
                <Link to="/apply">Start Your Application</Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-navy text-navy hover:bg-navy/5 px-8 py-6 text-base font-semibold" data-testid="cta-contact-btn">
                <Link to="/contact"><Phone className="mr-2 h-5 w-5" /> Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-slate-50" data-testid="testimonials-section">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-3">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="bg-white border-l-4 border-l-gold border-t-0 border-r-0 border-b-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-gold text-gold" />)}
                  </div>
                  <p className="text-slate-600 italic leading-relaxed font-serif text-sm">"{t.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm font-sans">{t.name}</p>
                      <p className="text-slate-500 text-xs font-sans">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliates */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm mb-4 font-sans">Trusted partners for your journey</p>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="https://www.worldnomads.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-navy transition-colors text-sm font-sans" data-testid="affiliate-insurance">
              <CheckCircle className="h-4 w-4 text-gold" /> Travel Insurance
            </a>
            <a href="https://www.skyscanner.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-navy transition-colors text-sm font-sans" data-testid="affiliate-flights">
              <CheckCircle className="h-4 w-4 text-gold" /> Flight Booking
            </a>
            <a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-navy transition-colors text-sm font-sans" data-testid="affiliate-relocation">
              <CheckCircle className="h-4 w-4 text-gold" /> Relocation Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
