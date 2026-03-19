import { useParams, Link } from 'react-router-dom';
import { PROGRAMS_DATA } from '@/pages/Programs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ProgramDetail() {
  const { slug } = useParams();
  const program = PROGRAMS_DATA.find(p => p.slug === slug);

  if (!program) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy">Program Not Found</h2>
          <Button asChild className="mt-4"><Link to="/programs">Back to Programs</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
          <div className="hero-gradient absolute inset-0" />
        </div>
        <div className="relative z-10 container mx-auto px-6 pb-12">
          <Link to="/programs" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 font-sans transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Programs
          </Link>
          <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">{program.badge}</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">{program.title}</h1>
          <div className="flex items-center gap-6 mt-4 text-white/80 font-sans text-sm">
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> {program.duration}</span>
            <span className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-gold" /> Starting at {program.fee}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Overview</h2>
                <p className="text-slate-600 leading-relaxed font-sans text-base">{program.desc}</p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                      <CheckCircle className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                      <span className="text-slate-700 font-sans text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {program.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>
                      <span className="text-slate-600 font-sans">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Application Process</h2>
                <div className="space-y-4">
                  {program.process.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 bg-white">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold text-sm">{i+1}</span>
                      </div>
                      <p className="text-slate-700 font-sans">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border border-slate-100 shadow-sm sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <p className="text-sm text-slate-500 font-sans">Starting from</p>
                    <p className="text-3xl font-bold text-navy font-serif">{program.fee}</p>
                  </div>
                  <Button asChild className="w-full bg-gold text-navy hover:bg-gold-light font-semibold py-6 text-base" data-testid="program-apply-btn">
                    <Link to="/apply">Apply Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-navy text-navy hover:bg-navy/5 font-semibold" data-testid="program-contact-btn">
                    <Link to="/contact">Get Free Consultation</Link>
                  </Button>
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-sans">
                      <Clock className="h-4 w-4 text-gold" /> {program.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-sans">
                      <CheckCircle className="h-4 w-4 text-gold" /> Expert guidance included
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-sans">
                      <CheckCircle className="h-4 w-4 text-gold" /> Document review included
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
