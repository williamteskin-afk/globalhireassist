import { Shield, Globe, Award, Users, MapPin, Target, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';

const TEAM_VALUES = [
  { icon: Shield, title: 'Integrity', desc: 'We maintain the highest ethical standards in every interaction and transaction.' },
  { icon: Globe, title: 'Global Reach', desc: 'Our network spans across 15+ countries connecting talent with opportunity.' },
  { icon: Heart, title: 'Client First', desc: 'Every decision we make puts our clients\' success and well-being first.' },
  { icon: Award, title: 'Excellence', desc: 'We strive for excellence in every visa application and consultation.' },
];

export default function About() {
  return (
    <div>
      <SEO
        title="About Us"
        path="/about"
        description="Learn about Global Hire Assist, a visa consultancy based in Mesa, Arizona dedicated to connecting talented individuals with opportunities in the United States."
      />
      {/* Hero */}
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">About Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">
              Your Trusted Partner in<br /><span className="text-gold">Global Immigration</span>
            </h1>
            <p className="text-white/80 text-lg mt-6 leading-relaxed font-sans max-w-xl">
              Based in Mesa, Arizona, Global Hire Assist is dedicated to connecting talented individuals with life-changing opportunities in the United States.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mt-3 leading-snug">Bridging Talent with Opportunity</h2>
              <p className="text-slate-600 mt-6 leading-relaxed font-sans">
                At Global Hire Assist, we believe that borders should not limit potential. Our mission is to simplify the complex world of visa processing and international recruitment, making it accessible to everyone.
              </p>
              <p className="text-slate-600 mt-4 leading-relaxed font-sans">
                We work closely with U.S. employers, government agencies, and international partners to create pathways for skilled workers, students, and travelers to achieve their American dreams.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gold" />
                  <span className="text-navy font-semibold font-sans">Mesa, Arizona, USA</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1758873271761-6cfe9b4f000c?w=600&q=80"
                alt="Team meeting"
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gold/20 rounded-lg -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-navy/10 rounded-lg -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-3">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_VALUES.map((v, i) => (
              <Card key={i} className="card-hover border border-slate-100 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                    <v.icon className="h-7 w-7 text-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-navy font-serif">{v.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed font-sans">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-navy text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Why Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 leading-snug">Why Choose Global Hire Assist?</h2>
              <div className="mt-8 space-y-6">
                {[
                  { icon: Target, text: 'Personalized visa strategy for each applicant' },
                  { icon: Users, text: 'Direct connections with verified U.S. employers' },
                  { icon: Shield, text: 'Transparent pricing with no hidden fees' },
                  { icon: Award, text: '98% visa approval success rate' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <p className="text-white/80 font-sans leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
                <div className="text-3xl font-bold text-gold font-serif">500+</div>
                <p className="text-white/60 text-sm mt-1 font-sans">Clients Served</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
                <div className="text-3xl font-bold text-gold font-serif">15+</div>
                <p className="text-white/60 text-sm mt-1 font-sans">Countries</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
                <div className="text-3xl font-bold text-gold font-serif">5+</div>
                <p className="text-white/60 text-sm mt-1 font-sans">Years Experience</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
                <div className="text-3xl font-bold text-gold font-serif">24/7</div>
                <p className="text-white/60 text-sm mt-1 font-sans">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
