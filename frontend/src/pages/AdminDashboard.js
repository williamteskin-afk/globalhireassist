import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { FileText, CreditCard, Users, Mail, Newspaper, Briefcase, BarChart3, Plus, Trash2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800', reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800',
  processing: 'bg-purple-100 text-purple-800', initiated: 'bg-gray-100 text-gray-800',
  paid: 'bg-green-100 text-green-800', active: 'bg-green-100 text-green-800',
};

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="border border-slate-100">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
          <Icon className="h-6 w-6 text-navy" />
        </div>
        <div>
          <p className="text-2xl font-bold text-navy font-serif">{value}</p>
          <p className="text-slate-500 text-sm font-sans">{label}</p>
          {sub && <p className="text-gold text-xs font-sans font-semibold">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [blogDialog, setBlogDialog] = useState(false);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', excerpt: '', category: '', image_url: '' });

  const authHeaders = { credentials: 'include' };

  useEffect(() => {
    if (authLoading) return;
    if (!user?.is_admin) { navigate('/'); return; }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const loadData = async () => {
    const opts = { ...authHeaders };
    try {
      const [s, a, p, b, e, c, sub] = await Promise.all([
        fetch(`${API}/admin/stats`, opts).then(r => r.ok ? r.json() : null),
        fetch(`${API}/applications`, opts).then(r => r.ok ? r.json() : []),
        fetch(`${API}/payments`, opts).then(r => r.ok ? r.json() : []),
        fetch(`${API}/blog`).then(r => r.json()),
        fetch(`${API}/employers`, opts).then(r => r.ok ? r.json() : []),
        fetch(`${API}/contact`, opts).then(r => r.ok ? r.json() : []),
        fetch(`${API}/newsletter/subscribers`, opts).then(r => r.ok ? r.json() : []),
      ]);
      setStats(s); setApplications(a); setPayments(p); setBlogs(b); setEmployers(e); setContacts(c); setSubscribers(sub);
    } catch { toast.error('Failed to load data'); }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      await fetch(`${API}/applications/${appId}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, ...authHeaders,
        body: JSON.stringify({ status })
      });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  const createBlogPost = async () => {
    if (!blogForm.title || !blogForm.content) { toast.error('Title and content required'); return; }
    try {
      const res = await fetch(`${API}/blog`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, ...authHeaders,
        body: JSON.stringify(blogForm)
      });
      if (res.ok) {
        const post = await res.json();
        setBlogs(prev => [post, ...prev]);
        setBlogForm({ title: '', content: '', excerpt: '', category: '', image_url: '' });
        setBlogDialog(false);
        toast.success('Blog post created');
      }
    } catch { toast.error('Failed to create post'); }
  };

  const deleteBlogPost = async (postId) => {
    try {
      await fetch(`${API}/blog/${postId}`, { method: 'DELETE', ...authHeaders });
      setBlogs(prev => prev.filter(b => b.id !== postId));
      toast.success('Post deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (authLoading || !user?.is_admin) return null;

  return (
    <div className="bg-slate-50 min-h-screen" data-testid="admin-dashboard">
      <section className="bg-navy text-white py-8">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><BarChart3 className="h-7 w-7 text-gold" /> Admin Dashboard</h1>
            <p className="text-white/60 text-sm font-sans mt-1">Manage applications, content, and more</p>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-8">
        <div className="container mx-auto px-6 space-y-6">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <StatCard icon={FileText} label="Applications" value={stats.applications?.total || 0} sub={`${stats.applications?.pending || 0} pending`} />
              <StatCard icon={CreditCard} label="Payments" value={stats.payments?.total || 0} sub={`${stats.payments?.paid || 0} paid`} />
              <StatCard icon={Briefcase} label="Employers" value={stats.employers || 0} />
              <StatCard icon={Briefcase} label="Jobs" value={stats.jobs || 0} />
              <StatCard icon={Mail} label="Messages" value={stats.contacts || 0} />
              <StatCard icon={Users} label="Subscribers" value={stats.subscribers || 0} />
              <StatCard icon={Newspaper} label="Blog Posts" value={stats.blog_posts || 0} />
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="applications" data-testid="admin-tabs">
            <TabsList className="bg-white border border-slate-200 p-1 flex-wrap h-auto">
              <TabsTrigger value="applications" className="font-sans text-sm">Applications</TabsTrigger>
              <TabsTrigger value="blog" className="font-sans text-sm">Blog</TabsTrigger>
              <TabsTrigger value="payments" className="font-sans text-sm">Payments</TabsTrigger>
              <TabsTrigger value="employers" className="font-sans text-sm">Employers</TabsTrigger>
              <TabsTrigger value="contacts" className="font-sans text-sm">Messages</TabsTrigger>
              <TabsTrigger value="subscribers" className="font-sans text-sm">Subscribers</TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card className="border border-slate-100">
                <CardHeader><CardTitle className="text-lg font-serif text-navy">Visa Applications ({applications.length})</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Visa Type</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {applications.map(app => (
                        <TableRow key={app.id}>
                          <TableCell className="font-sans font-medium">{app.full_name}</TableCell>
                          <TableCell className="font-sans text-sm">{app.email}</TableCell>
                          <TableCell className="font-sans text-sm">{app.phone}</TableCell>
                          <TableCell className="font-sans text-sm">{app.visa_type}</TableCell>
                          <TableCell className="font-sans text-sm">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                          <TableCell><Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge></TableCell>
                          <TableCell>
                            <Select value={app.status} onValueChange={v => updateAppStatus(app.id, v)}>
                              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {['pending','reviewing','processing','approved','rejected'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {applications.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">No applications yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog">
              <Card className="border border-slate-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-serif text-navy">Blog Posts ({blogs.length})</CardTitle>
                  <Dialog open={blogDialog} onOpenChange={setBlogDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gold text-navy hover:bg-gold-light" data-testid="create-blog-btn"><Plus className="h-4 w-4 mr-1" /> New Post</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle className="font-serif text-navy">Create Blog Post</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div><Label className="font-sans">Title</Label><Input value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Post title" data-testid="blog-title-input" /></div>
                        <div><Label className="font-sans">Category</Label><Input value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} placeholder="e.g. Work Visa, Tips" /></div>
                        <div><Label className="font-sans">Excerpt</Label><Input value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} placeholder="Short summary" /></div>
                        <div><Label className="font-sans">Image URL</Label><Input value={blogForm.image_url} onChange={e => setBlogForm({...blogForm, image_url: e.target.value})} placeholder="https://..." /></div>
                        <div><Label className="font-sans">Content</Label><Textarea value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Write your post..." className="min-h-[200px]" data-testid="blog-content-input" /></div>
                        <Button onClick={createBlogPost} className="w-full bg-gold text-navy hover:bg-gold-light font-semibold" data-testid="blog-save-btn">Publish Post</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead>Action</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {blogs.map(b => (
                        <TableRow key={b.id}>
                          <TableCell className="font-sans font-medium">{b.title}</TableCell>
                          <TableCell><Badge variant="outline">{b.category || 'General'}</Badge></TableCell>
                          <TableCell className="font-sans text-sm">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" onClick={() => deleteBlogPost(b.id)} className="text-red-500 hover:text-red-700" data-testid={`delete-blog-${b.id}`}><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {blogs.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-400">No posts yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card className="border border-slate-100">
                <CardHeader><CardTitle className="text-lg font-serif text-navy">Payment Transactions ({payments.length})</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Package</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Email</TableHead><TableHead>Date</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {payments.map(p => (
                        <TableRow key={p.id || p.session_id}>
                          <TableCell className="font-sans font-medium">{p.package_name}</TableCell>
                          <TableCell className="font-sans">${p.amount?.toFixed(2)} {p.currency?.toUpperCase()}</TableCell>
                          <TableCell><Badge className={STATUS_COLORS[p.payment_status]}>{p.payment_status}</Badge></TableCell>
                          <TableCell className="font-sans text-sm">{p.user_email || '-'}</TableCell>
                          <TableCell className="font-sans text-sm">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                      {payments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">No payments yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employers Tab */}
            <TabsContent value="employers">
              <Card className="border border-slate-100">
                <CardHeader><CardTitle className="text-lg font-serif text-navy">Employer Registrations ({employers.length})</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Company</TableHead><TableHead>Contact</TableHead><TableHead>Industry</TableHead><TableHead>Workers</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {employers.map(e => (
                        <TableRow key={e.id}>
                          <TableCell className="font-sans font-medium">{e.company_name}</TableCell>
                          <TableCell className="font-sans text-sm">{e.contact_person}<br/><span className="text-slate-400">{e.email}</span></TableCell>
                          <TableCell className="font-sans text-sm">{e.industry}</TableCell>
                          <TableCell className="font-sans">{e.workers_needed}</TableCell>
                          <TableCell><Badge className={STATUS_COLORS[e.status]}>{e.status}</Badge></TableCell>
                          <TableCell className="font-sans text-sm">{new Date(e.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                      {employers.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No registrations yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <Card className="border border-slate-100">
                <CardHeader><CardTitle className="text-lg font-serif text-navy">Contact Messages ({contacts.length})</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Subject</TableHead><TableHead>Message</TableHead><TableHead>Date</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {contacts.map(c => (
                        <TableRow key={c.id}>
                          <TableCell className="font-sans font-medium">{c.name}</TableCell>
                          <TableCell className="font-sans text-sm">{c.email}</TableCell>
                          <TableCell className="font-sans text-sm">{c.subject || '-'}</TableCell>
                          <TableCell className="font-sans text-sm max-w-xs truncate">{c.message}</TableCell>
                          <TableCell className="font-sans text-sm">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                      {contacts.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">No messages yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscribers Tab */}
            <TabsContent value="subscribers">
              <Card className="border border-slate-100">
                <CardHeader><CardTitle className="text-lg font-serif text-navy">Newsletter Subscribers ({subscribers.length})</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {subscribers.map(s => (
                        <TableRow key={s.id}>
                          <TableCell className="font-sans">{s.email}</TableCell>
                          <TableCell className="font-sans text-sm">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                      {subscribers.length === 0 && <TableRow><TableCell colSpan={2} className="text-center py-8 text-slate-400">No subscribers yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
