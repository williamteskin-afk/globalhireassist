import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CreditCard, ArrowRight, Clock } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  processing: 'bg-purple-100 text-purple-800',
};

export default function UserDashboard() {
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { login(); return; }
    fetch(`${API}/my/applications`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setApplications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, login]);

  if (authLoading || !user) return null;

  return (
    <div className="bg-slate-50 min-h-screen" data-testid="user-dashboard">
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome, {user.name}</h1>
          <p className="text-white/70 mt-2 font-sans">{user.email}</p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6 space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="bg-gold text-navy hover:bg-gold-light font-semibold py-8 text-base">
              <Link to="/apply"><FileText className="mr-2 h-5 w-5" /> New Application</Link>
            </Button>
            <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy/5 font-semibold py-8 text-base">
              <Link to="/membership"><CreditCard className="mr-2 h-5 w-5" /> View Plans</Link>
            </Button>
            <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy/5 font-semibold py-8 text-base">
              <Link to="/contact"><ArrowRight className="mr-2 h-5 w-5" /> Get Support</Link>
            </Button>
          </div>

          {/* Applications */}
          <Card className="shadow-sm border border-slate-100">
            <CardHeader>
              <CardTitle className="text-xl text-navy font-serif">My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500 font-sans py-8 text-center">Loading...</p>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-sans">No applications yet.</p>
                  <Button asChild className="mt-4 bg-gold text-navy hover:bg-gold-light"><Link to="/apply">Submit Your First Application</Link></Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-white" data-testid={`application-${app.id}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-navy" />
                        </div>
                        <div>
                          <p className="font-semibold text-navy font-sans">{app.visa_type}</p>
                          <p className="text-slate-500 text-sm font-sans flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-800'} data-testid={`status-${app.id}`}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
