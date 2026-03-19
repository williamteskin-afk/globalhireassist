import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, MapPin, Users, Search, ArrowRight, Clock, Filter } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const VISA_FILTERS = ['All', 'H-2A', 'H-2B', 'Tourist', 'Visit', 'Study'];

const VISA_BADGE_COLORS = {
  'H-2A': 'bg-green-100 text-green-800',
  'H-2B': 'bg-blue-100 text-blue-800',
  'Tourist': 'bg-purple-100 text-purple-800',
  'Visit': 'bg-orange-100 text-orange-800',
  'Study': 'bg-teal-100 text-teal-800',
};

function getBadgeColor(visaType) {
  for (const [key, val] of Object.entries(VISA_BADGE_COLORS)) {
    if (visaType?.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return 'bg-slate-100 text-slate-800';
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [visaFilter, setVisaFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API}/jobs`)
      .then(r => r.json())
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const matchesSearch = !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase()) ||
      j.description?.toLowerCase().includes(search.toLowerCase());
    const matchesVisa = visaFilter === 'All' ||
      j.visa_type?.toLowerCase().includes(visaFilter.toLowerCase());
    return matchesSearch && matchesVisa;
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Opportunities</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">Job Listings</h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl font-sans leading-relaxed">
            Browse verified job opportunities from our U.S. employer partners. Find the right position for your skills and goals.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs by title, location..."
                data-testid="jobs-search-input"
                className="pl-10 h-11 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
              <Select value={visaFilter} onValueChange={setVisaFilter}>
                <SelectTrigger className="w-44 h-11" data-testid="jobs-visa-filter">
                  <SelectValue placeholder="Visa Type" />
                </SelectTrigger>
                <SelectContent>
                  {VISA_FILTERS.map(v => <SelectItem key={v} value={v}>{v === 'All' ? 'All Visa Types' : `${v} Visa`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 md:py-20 bg-slate-50 min-h-[50vh]">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i}><CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" />
                </CardContent></Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy font-serif">
                {jobs.length === 0 ? 'No Job Listings Yet' : 'No Jobs Match Your Search'}
              </h3>
              <p className="text-slate-500 mt-2 font-sans max-w-md mx-auto">
                {jobs.length === 0
                  ? 'New positions are added regularly. Check back soon or subscribe to our newsletter for updates.'
                  : 'Try adjusting your search or filters to see more results.'}
              </p>
              {jobs.length === 0 && (
                <div className="flex gap-3 justify-center mt-6">
                  <Button asChild className="bg-gold text-navy hover:bg-gold-light font-semibold">
                    <Link to="/apply">Apply for a Visa</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-navy text-navy">
                    <Link to="/programs">View Programs</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm font-sans mb-6">{filtered.length} position{filtered.length !== 1 ? 's' : ''} available</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="jobs-grid">
                {filtered.map(job => (
                  <Card
                    key={job.id}
                    className="card-hover border border-slate-100 bg-white cursor-pointer"
                    onClick={() => setSelected(job)}
                    data-testid={`job-card-${job.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg font-bold text-navy font-serif leading-snug">{job.title}</h3>
                        <Badge className={`${getBadgeColor(job.visa_type)} text-xs shrink-0`}>{job.visa_type}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-sans mb-4">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-gold" /> {job.positions} position{job.positions !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-slate-600 text-sm font-sans line-clamp-3 leading-relaxed">{job.description}</p>
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(job.created_at).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1 text-gold font-semibold text-sm font-sans">
                          View Details <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Job Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getBadgeColor(selected.visa_type)}>{selected.visa_type}</Badge>
                  <Badge variant="outline" className="text-xs">{selected.status}</Badge>
                </div>
                <DialogTitle className="text-xl font-serif text-navy leading-snug">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-2">
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 font-sans">
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {selected.location}</span>
                  <span className="flex items-center gap-2"><Users className="h-4 w-4 text-gold" /> {selected.positions} position{selected.positions !== 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> Posted {new Date(selected.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-navy text-sm font-sans mb-2">Job Description</h4>
                  <p className="text-slate-600 text-sm font-sans leading-relaxed whitespace-pre-line">{selected.description}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button asChild className="flex-1 bg-gold text-navy hover:bg-gold-light font-semibold py-5" data-testid="job-apply-btn">
                    <Link to="/apply" onClick={() => setSelected(null)}>Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="border-navy text-navy" data-testid="job-contact-btn">
                    <Link to="/contact" onClick={() => setSelected(null)}>Contact Us</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
