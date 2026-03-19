import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';

const LOGO = "https://customer-assets.emergentagent.com/job_hire-assist-portal/artifacts/z27n0xxm_22178.png";

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/blog', label: 'Blog' },
  { to: '/employers', label: 'Employers' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header data-testid="navbar" className="glass-header sticky top-0 z-50 border-b border-slate-200/60">
      <div className="container mx-auto px-6 flex items-center justify-between h-16 lg:h-18">
        <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="nav-logo">
          <img src={LOGO} alt="Global Hire Assist" className="h-10 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              data-testid={`nav-${link.label.toLowerCase()}-link`}
              className={`text-sm font-medium transition-colors hover:text-navy ${
                location.pathname === link.to ? 'text-navy font-semibold' : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/apply')}
            data-testid="nav-apply-btn"
            className="border-gold text-navy hover:bg-gold/10 font-semibold"
          >
            Apply Now
          </Button>

          {!loading && (user ? (
            <DropdownMenu>
              <DropdownMenuTrigger data-testid="user-menu-trigger" className="focus:outline-none">
                <Avatar className="h-9 w-9 border-2 border-gold/30">
                  <AvatarImage src={user.picture} alt={user.name} />
                  <AvatarFallback className="bg-navy text-white text-xs">{user.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/dashboard')} data-testid="nav-dashboard-link">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                {user.is_admin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} data-testid="nav-admin-link">
                    <Shield className="mr-2 h-4 w-4" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} data-testid="logout-button">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={login}
              data-testid="login-button"
              className="bg-navy text-white hover:bg-navy-light font-semibold"
            >
              <User className="mr-2 h-4 w-4" /> Sign In
            </Button>
          ))}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 pt-12">
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-base font-medium py-2 border-b border-slate-100 transition-colors ${
                    location.pathname === link.to ? 'text-navy font-semibold' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button onClick={() => { navigate('/apply'); setOpen(false); }} className="mt-4 bg-gold text-navy hover:bg-gold-light font-semibold">
                Apply Now
              </Button>
              {!loading && (user ? (
                <>
                  <Button variant="outline" onClick={() => { navigate('/dashboard'); setOpen(false); }}>Dashboard</Button>
                  <Button variant="ghost" onClick={() => { logout(); setOpen(false); }}>Logout</Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => { login(); setOpen(false); }}>Sign In</Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
