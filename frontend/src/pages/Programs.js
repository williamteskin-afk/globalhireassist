import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const PROGRAMS_DATA = [
  {
    slug: 'h2a-visa', title: 'H-2A Agricultural Work Visa', shortTitle: 'H-2A Work Visa',
    desc: 'The H-2A program allows U.S. employers to bring foreign nationals to fill temporary agricultural jobs. Ideal for seasonal farm workers.',
    image: 'https://images.unsplash.com/photo-1752242931857-93f947f304b7?w=600&q=80', badge: 'Agricultural',
    features: ['Seasonal agricultural work', 'Employer-sponsored housing', 'Transportation provided', 'Guaranteed wage rates', 'Opportunity to return for subsequent seasons'],
    requirements: ['Valid passport', 'Job offer from U.S. employer', 'No criminal record', 'Proof of agricultural experience', 'Medical examination clearance'],
    process: ['Employer files labor certification with DOL', 'Employer files Form I-129 with USCIS', 'Worker applies for H-2A visa at U.S. Embassy', 'Visa interview and biometrics', 'Visa issuance and travel to the U.S.'],
    duration: 'Up to 1 year (extendable to 3 years)', fee: '$150.00'
  },
  {
    slug: 'h2b-visa', title: 'H-2B Non-Agricultural Work Visa', shortTitle: 'H-2B Work Visa',
    desc: 'The H-2B program enables employers to hire foreign workers for temporary non-agricultural jobs such as hospitality, landscaping, and construction.',
    image: 'https://images.unsplash.com/photo-1759038085950-1234ca8f5fed?w=600&q=80', badge: 'Non-Agricultural',
    features: ['Hospitality and tourism jobs', 'Landscaping positions', 'Construction work', 'Seafood processing', 'Amusement and recreation'],
    requirements: ['Valid passport', 'Job offer for temporary non-agricultural work', 'Employer\'s temporary labor certification', 'No criminal record', 'Proof of ties to home country'],
    process: ['Employer applies for temporary labor certification', 'Employer files Form I-129', 'Worker applies at U.S. Embassy', 'Visa interview', 'Travel to the United States'],
    duration: 'Up to 1 year (extendable to 3 years)', fee: '$150.00'
  },
  {
    slug: 'tourist-visa', title: 'Tourist Visa (B-2)', shortTitle: 'Tourist Visa',
    desc: 'The B-2 visa allows individuals to enter the United States for tourism, vacation, or visiting family and friends.',
    image: 'https://images.unsplash.com/photo-1702306257553-3edb907edd0a?w=600&q=80', badge: 'B-2 Visa',
    features: ['Tourism and sightseeing', 'Visiting family and friends', 'Medical treatment', 'Participation in social events', 'Leisure activities'],
    requirements: ['Valid passport (6+ months validity)', 'Completed DS-160 form', 'Proof of financial capability', 'Evidence of ties to home country', 'Travel itinerary'],
    process: ['Complete DS-160 online application', 'Pay MRV fee', 'Schedule visa interview', 'Attend interview at U.S. Embassy', 'Receive visa decision'],
    duration: 'Up to 6 months per visit', fee: '$75.00'
  },
  {
    slug: 'visit-visa', title: 'Visit Visa (B-1/B-2)', shortTitle: 'Visit Visa',
    desc: 'Combined business and pleasure visa for short-term visits to the United States including business meetings and tourism.',
    image: 'https://images.unsplash.com/photo-1702306257553-3edb907edd0a?w=600&q=80', badge: 'B-1/B-2 Visa',
    features: ['Business meetings and conferences', 'Tourism and sightseeing', 'Visiting family', 'Medical treatment', 'Short-term training'],
    requirements: ['Valid passport', 'DS-160 confirmation', 'Financial proof', 'Invitation letter (if applicable)', 'Return ticket or itinerary'],
    process: ['Fill out DS-160 application', 'Pay visa application fee', 'Book interview appointment', 'Attend consular interview', 'Collect visa'],
    duration: 'Up to 6 months', fee: '$75.00'
  },
  {
    slug: 'study-visa', title: 'Study Visa (F-1)', shortTitle: 'Study Visa',
    desc: 'The F-1 visa allows international students to pursue full-time academic studies at accredited U.S. educational institutions.',
    image: 'https://images.unsplash.com/photo-1758270703250-80a6387439ba?w=600&q=80', badge: 'F-1 Visa',
    features: ['Full-time academic studies', 'Optional Practical Training (OPT)', 'On-campus employment', 'Cultural exchange opportunities', 'Path to further education'],
    requirements: ['Acceptance letter from SEVP-certified school', 'Form I-20 from institution', 'Proof of financial support', 'English proficiency (TOEFL/IELTS)', 'Valid passport'],
    process: ['Get accepted by a SEVP-certified school', 'Receive Form I-20', 'Pay SEVIS fee', 'Complete DS-160 and schedule interview', 'Attend visa interview'],
    duration: 'Duration of study program', fee: '$75.00'
  },
];

export default function Programs() {
  return (
    <div>
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Our Programs</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">Visa Programs</h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl font-sans leading-relaxed">
            Choose from our range of visa programs designed to meet your travel, work, and education goals.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="program-cards">
            {PROGRAMS_DATA.map(p => (
              <Link key={p.slug} to={`/programs/${p.slug}`} className="group">
                <Card className="card-hover overflow-hidden border border-slate-100 bg-white h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-navy/90 text-white text-xs">{p.badge}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-navy mb-2 font-serif">{p.shortTitle}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-sans mb-4">{p.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold font-sans">{p.fee}</span>
                      <span className="inline-flex items-center gap-1 text-navy font-semibold text-sm group-hover:gap-2 transition-all font-sans">
                        Details <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild className="bg-gold text-navy hover:bg-gold-light font-semibold px-8 py-6 text-base">
              <Link to="/apply">Start Your Application <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
