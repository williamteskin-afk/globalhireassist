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
import { FileText, CreditCard, Users, Mail, Newspaper, Briefcase, BarChart3, Plus, Trash2, Pencil, Eye, ExternalLink, Image, X } from 'lucide-react';

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
  const [editingPost, setEditingPost] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobDialog, setJobDialog] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', location: '', description: '', visa_type: '', positions: 1 });

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
      const jobsData = await fetch(`${API}/jobs`).then(r => r.json()).catch(() => []);
      setStats(s); setApplications(a); setPayments(p); setBlogs(b); setEmployers(e); setContacts(c); setSubscribers(sub); setJobs(jobsData);
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

  const openCreateBlog = () => {
    setEditingPost(null);
    setBlogForm({ title: '', content: '', excerpt: '', category: '', image_url: '' });
    setBlogDialog(true);
  };

  const openEditBlog = (post) => {
    setEditingPost(post);
    setBlogForm({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || '',
      image_url: post.image_url || '',
    });
    setBlogDialog(true);
  };

  const saveBlogPost = async () => {
    if (!blogForm.title || !blogForm.content) { toast.error('Title and content required'); return; }
    try {
      if (editingPost) {
        const res = await fetch(`${API}/blog/${editingPost.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, ...authHeaders,
          body: JSON.stringify(blogForm)
        });
        if (res.ok) {
          setBlogs(prev => prev.map(b => b.id === editingPost.id ? { ...b, ...blogForm } : b));
          setBlogDialog(false);
          setEditingPost(null);
          toast.success('Blog post updated');
        } else { toast.error('Failed to update post'); }
      } else {
        const res = await fetch(`${API}/blog`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, ...authHeaders,
          body: JSON.stringify(blogForm)
        });
        if (res.ok) {
          const post = await res.json();
          setBlogs(prev => [post, ...prev]);
          setBlogDialog(false);
          toast.success('Blog post published');
        } else { toast.error('Failed to create post'); }
      }
    } catch { toast.error('Something went wrong'); }
  };

  const confirmDeleteBlog = async () => {
    if (!deleteConfirm) return;
    try {
      await fetch(`${API}/blog/${deleteConfirm.id}`, { method: 'DELETE', ...authHeaders });
      setBlogs(prev => prev.filter(b => b.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      toast.success('Post deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const createJob = async () => {
    if (!jobForm.title || !jobForm.location || !jobForm.description || !jobForm.visa_type) {
      toast.error('Title, location, description & visa type required'); return;
    }
    try {
      const res = await fetch(`${API}/jobs`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, ...authHeaders,
        body: JSON.stringify({ ...jobForm, positions: parseInt(jobForm.positions) || 1 })
      });
      if (res.ok) {
        const job = await res.json();
        setJobs(prev => [job, ...prev]);
        setJobForm({ title: '', location: '', description: '', visa_type: '', positions: 1 });
        setJobDialog(false);
        toast.success('Job listing created');
      }
    } catch { toast.error('Failed to create job'); }
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
              <TabsTrigger value="jobs" className="font-sans text-sm">Jobs</TabsTrigger>
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
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg font-serif text-navy">Blog Posts ({blogs.length})</CardTitle>
                    <p className="text-sm text-slate-500 font-sans mt-1">Create, edit, and manage your blog content</p>
                  </div>
                  <Button size="sm" onClick={openCreateBlog} className="bg-gold text-navy hover:bg-gold-light" data-testid="create-blog-btn">
                    <Plus className="h-4 w-4 mr-1" /> New Post
                  </Button>
                </CardHeader>
                <CardContent>
                  {blogs.length === 0 ? (
                    <div className="text-center py-16">
                      <Newspaper className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-sans">No blog posts yet.</p>
                      <Button onClick={openCreateBlog} className="mt-4 bg-gold text-navy hover:bg-gold-light font-semibold">Create Your First Post</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {blogs.map(b => (
                        <div key={b.id} className="group rounded-lg border border-slate-100 bg-white overflow-hidden hover:shadow-md transition-shadow" data-testid={`blog-card-${b.id}`}>
                          {b.image_url ? (
                            <div className="relative h-36 overflow-hidden bg-slate-100">
                              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              {b.category && <Badge className="absolute top-2 left-2 bg-navy/90 text-white text-xs">{b.category}</Badge>}
                            </div>
                          ) : (
                            <div className="h-36 bg-gradient-to-br from-navy/5 to-gold/5 flex items-center justify-center">
                              <Image className="h-10 w-10 text-slate-300" />
                              {b.category && <Badge className="absolute top-2 left-2 bg-navy/90 text-white text-xs">{b.category}</Badge>}
                            </div>
                          )}
                          <div className="p-4">
                            <h4 className="font-bold text-navy font-serif text-sm leading-snug line-clamp-2">{b.title}</h4>
                            <p className="text-slate-500 text-xs font-sans mt-1.5 line-clamp-2">{b.excerpt || b.content?.substring(0, 100)}</p>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                              <span className="text-xs text-slate-400 font-sans">{new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-navy" onClick={() => setPreviewPost(b)} data-testid={`preview-blog-${b.id}`}>
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-gold" onClick={() => openEditBlog(b)} data-testid={`edit-blog-${b.id}`}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <a href={`/blog/${b.id}`} target="_blank" rel="noopener noreferrer">
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-navy" data-testid={`view-blog-${b.id}`}>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Button>
                                </a>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-500" onClick={() => setDeleteConfirm(b)} data-testid={`delete-blog-${b.id}`}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Create / Edit Blog Dialog */}
              <Dialog open={blogDialog} onOpenChange={(open) => { setBlogDialog(open); if (!open) setEditingPost(null); }}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-navy text-xl">
                      {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </DialogTitle>
                    <p className="text-sm text-slate-500 font-sans">{editingPost ? 'Update your post details below' : 'Fill in the details to publish a new blog post'}</p>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-2">
                    {/* Main Content - Left */}
                    <div className="md:col-span-3 space-y-4">
                      <div>
                        <Label className="font-sans font-medium text-sm">Title *</Label>
                        <Input value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Enter a compelling title..." data-testid="blog-title-input" className="mt-1.5 h-11" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Label className="font-sans font-medium text-sm">Content *</Label>
                          <span className="text-xs text-slate-400 font-sans">{blogForm.content.length} characters</span>
                        </div>
                        <Textarea value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Write your blog post content here. Use line breaks to separate paragraphs..." className="min-h-[280px] font-sans text-sm leading-relaxed" data-testid="blog-content-input" />
                      </div>
                    </div>
                    {/* Sidebar - Right */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <Label className="font-sans font-medium text-sm">Category</Label>
                        <Select value={blogForm.category} onValueChange={v => setBlogForm({...blogForm, category: v})}>
                          <SelectTrigger className="mt-1.5 h-11" data-testid="blog-category-select"><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            {['Work Visa', 'Tips', 'News', 'Study Abroad', 'Travel', 'Success Story', 'Immigration Law', 'Employer Guide'].map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Label className="font-sans font-medium text-sm">Excerpt</Label>
                          <span className="text-xs text-slate-400 font-sans">{blogForm.excerpt.length}/160</span>
                        </div>
                        <Textarea value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value.slice(0, 160)})} placeholder="A brief summary for previews..." className="min-h-[80px] text-sm" maxLength={160} />
                      </div>
                      <div>
                        <Label className="font-sans font-medium text-sm">Featured Image URL</Label>
                        <Input value={blogForm.image_url} onChange={e => setBlogForm({...blogForm, image_url: e.target.value})} placeholder="https://images.unsplash.com/..." className="mt-1.5" />
                        {blogForm.image_url && (
                          <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-100 h-32">
                            <img src={blogForm.image_url} alt="Preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                          </div>
                        )}
                      </div>
                      {editingPost && (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 font-sans space-y-1">
                          <p><strong>Post ID:</strong> {editingPost.id}</p>
                          <p><strong>Author:</strong> {editingPost.author}</p>
                          <p><strong>Created:</strong> {new Date(editingPost.created_at).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                    <Button variant="outline" onClick={() => { setBlogDialog(false); setEditingPost(null); }}>Cancel</Button>
                    <Button onClick={saveBlogPost} className="bg-gold text-navy hover:bg-gold-light font-semibold px-8" data-testid="blog-save-btn">
                      {editingPost ? 'Save Changes' : 'Publish Post'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <Dialog open={!!deleteConfirm} onOpenChange={open => !open && setDeleteConfirm(null)}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-navy">Delete Blog Post?</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-slate-600 font-sans">
                    Are you sure you want to delete <strong>"{deleteConfirm?.title}"</strong>? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button onClick={confirmDeleteBlog} className="bg-red-600 text-white hover:bg-red-700 font-semibold" data-testid="confirm-delete-blog-btn">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Preview Dialog */}
              <Dialog open={!!previewPost} onOpenChange={open => !open && setPreviewPost(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                  {previewPost && (
                    <>
                      <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {previewPost.category && <Badge className="bg-navy/10 text-navy text-xs">{previewPost.category}</Badge>}
                          <span className="text-xs text-slate-400 font-sans">{new Date(previewPost.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <DialogTitle className="font-serif text-navy text-2xl leading-snug">{previewPost.title}</DialogTitle>
                        {previewPost.excerpt && <p className="text-slate-500 text-sm font-sans italic mt-1">{previewPost.excerpt}</p>}
                      </DialogHeader>
                      {previewPost.image_url && (
                        <img src={previewPost.image_url} alt={previewPost.title} className="w-full h-48 object-cover rounded-lg mt-2" />
                      )}
                      <div className="text-slate-700 text-sm font-sans leading-relaxed whitespace-pre-line mt-2 max-h-[40vh] overflow-y-auto">
                        {previewPost.content}
                      </div>
                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                        <Button variant="outline" onClick={() => { setPreviewPost(null); openEditBlog(previewPost); }}>
                          <Pencil className="h-4 w-4 mr-1" /> Edit Post
                        </Button>
                        <a href={`/blog/${previewPost.id}`} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-navy text-white hover:bg-navy-light">
                            <ExternalLink className="h-4 w-4 mr-1" /> View on Site
                          </Button>
                        </a>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
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

            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <Card className="border border-slate-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-serif text-navy">Job Listings ({jobs.length})</CardTitle>
                  <Dialog open={jobDialog} onOpenChange={setJobDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gold text-navy hover:bg-gold-light" data-testid="create-job-btn"><Plus className="h-4 w-4 mr-1" /> New Job</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle className="font-serif text-navy">Create Job Listing</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div><Label className="font-sans">Job Title *</Label><Input value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="e.g. Farm Worker, Hotel Staff" data-testid="job-title-input" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><Label className="font-sans">Location *</Label><Input value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Texas, USA" data-testid="job-location-input" /></div>
                          <div><Label className="font-sans">Positions</Label><Input type="number" min="1" value={jobForm.positions} onChange={e => setJobForm({...jobForm, positions: e.target.value})} data-testid="job-positions-input" /></div>
                        </div>
                        <div>
                          <Label className="font-sans">Visa Type *</Label>
                          <Select value={jobForm.visa_type} onValueChange={v => setJobForm({...jobForm, visa_type: v})}>
                            <SelectTrigger data-testid="job-visa-select"><SelectValue placeholder="Select visa type" /></SelectTrigger>
                            <SelectContent>
                              {['H-2A Agricultural', 'H-2B Non-Agricultural', 'Other'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div><Label className="font-sans">Description *</Label><Textarea value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} placeholder="Job responsibilities, requirements, benefits..." className="min-h-[150px]" data-testid="job-desc-input" /></div>
                        <Button onClick={createJob} className="w-full bg-gold text-navy hover:bg-gold-light font-semibold" data-testid="job-save-btn">Publish Job Listing</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Title</TableHead><TableHead>Location</TableHead><TableHead>Visa Type</TableHead><TableHead>Positions</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {jobs.map(j => (
                        <TableRow key={j.id}>
                          <TableCell className="font-sans font-medium">{j.title}</TableCell>
                          <TableCell className="font-sans text-sm">{j.location}</TableCell>
                          <TableCell><Badge variant="outline">{j.visa_type}</Badge></TableCell>
                          <TableCell className="font-sans">{j.positions}</TableCell>
                          <TableCell><Badge className={STATUS_COLORS[j.status]}>{j.status}</Badge></TableCell>
                          <TableCell className="font-sans text-sm">{new Date(j.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                      {jobs.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No job listings yet. Create your first one!</TableCell></TableRow>}
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
