import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SEO from '@/components/SEO';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/blog`)
      .then(r => r.json())
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SEO title="Blog" path="/blog" description="Stay informed with the latest visa news, immigration tips, success stories, and updates from Global Hire Assist." />
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <span className="text-gold font-semibold uppercase tracking-wider text-sm font-sans">Our Blog</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">Visa Updates & Tips</h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl font-sans leading-relaxed">Stay informed with the latest visa news, tips, and success stories.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-list">
              {[1,2,3].map(i => (
                <Card key={i} className="overflow-hidden"><CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-3"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
                </CardContent></Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl text-slate-600 font-sans">No blog posts yet. Check back soon!</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-list">
              {posts.map(post => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group">
                  <Card className="card-hover overflow-hidden border border-slate-100 h-full">
                    {post.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {post.category && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-navy/90 text-white text-xs">{post.category}</Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-navy mb-2 font-serif line-clamp-2">{post.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-sans line-clamp-3">{post.excerpt || post.content?.substring(0, 150)}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-sans">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <span className="inline-flex items-center gap-1 text-gold font-semibold text-sm group-hover:gap-2 transition-all font-sans">
                          Read <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
