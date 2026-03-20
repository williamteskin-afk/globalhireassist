import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import SEO from '@/components/SEO';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/blog/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="container mx-auto px-6 py-20">
      <Skeleton className="h-8 w-1/3 mb-4" /><Skeleton className="h-64 w-full mb-6" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4 mt-2" />
    </div>
  );

  if (!post) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy">Post Not Found</h2>
        <Button asChild className="mt-4"><Link to="/blog">Back to Blog</Link></Button>
      </div>
    </div>
  );

  return (
    <div>
      <SEO
        title={post.title}
        path={`/blog/${id}`}
        description={post.excerpt || post.content?.substring(0, 160)}
        image={post.image_url}
        type="article"
      />
      <section className="bg-navy text-white py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 font-sans transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          {post.category && <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">{post.category}</Badge>}
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 mt-4 text-white/60 text-sm font-sans">
            <span className="flex items-center gap-2"><User className="h-4 w-4" /> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          {post.image_url && (
            <img src={post.image_url} alt={post.title} className="w-full h-64 md:h-80 object-cover rounded-lg mb-10" />
          )}
          <div className="prose prose-slate max-w-none font-sans text-slate-700 leading-relaxed whitespace-pre-line" data-testid="blog-post-content">
            {post.content}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100">
            <Button asChild className="bg-gold text-navy hover:bg-gold-light font-semibold">
              <Link to="/apply">Apply for a Visa</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
