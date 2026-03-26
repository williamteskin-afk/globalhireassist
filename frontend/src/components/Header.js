import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center" data-testid="logo-link">
            <span className="font-poppins text-2xl font-bold text-primary">Global Hire Assist</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={`font-semibold hover:text-accent-gold transition-colors ${isActive('/') ? 'text-accent-gold' : 'text-primary'}`} data-testid="nav-home">
              Home
            </Link>
            <Link to="/about" className={`font-semibold hover:text-accent-gold transition-colors ${isActive('/about') ? 'text-accent-gold' : 'text-primary'}`} data-testid="nav-about">
              About Us
            </Link>
            <div className="relative" onMouseEnter={() => setIsProgramsOpen(true)} onMouseLeave={() => setIsProgramsOpen(false)}>
              <button className="font-semibold text-primary hover:text-accent-gold transition-colors flex items-center gap-1" data-testid="nav-programs">
                Programs <ChevronDown className="w-4 h-4" />
              </button>
              {isProgramsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2">
                  <Link to="/programs/work-visa" className="block px-4 py-3 text-primary hover:bg-slate-50 hover:text-accent-gold transition-colors" data-testid="nav-work-visa">
                    Work Visa (H-2A / H-2B)
                  </Link>
                  <Link to="/programs/tourist-visa" className="block px-4 py-3 text-primary hover:bg-slate-50 hover:text-accent-gold transition-colors" data-testid="nav-tourist-visa">
                    Tourist Visa
                  </Link>
                  <Link to="/programs/visit-visa" className="block px-4 py-3 text-primary hover:bg-slate-50 hover:text-accent-gold transition-colors" data-testid="nav-visit-visa">
                    Visit Visa
                  </Link>
                  <Link to="/programs/study-visa" className="block px-4 py-3 text-primary hover:bg-slate-50 hover:text-accent-gold transition-colors" data-testid="nav-study-visa">
                    Study Visa
                  </Link>
                </div>
              )}
            </div>
            <Link to="/employers" className={`font-semibold hover:text-accent-gold transition-colors ${isActive('/employers') ? 'text-accent-gold' : 'text-primary'}`} data-testid="nav-employers">
              Employers
            </Link>
            <Link to="/blog" className={`font-semibold hover:text-accent-gold transition-colors ${isActive('/blog') ? 'text-accent-gold' : 'text-primary'}`} data-testid="nav-blog">
              Blog
            </Link>
            <Link to="/contact" className={`font-semibold hover:text-accent-gold transition-colors ${isActive('/contact') ? 'text-accent-gold' : 'text-primary'}`} data-testid="nav-contact">
              Contact Us
            </Link>
          </nav>

          <div className="hidden lg:block">
            <button onClick={() => navigate('/apply')} className="btn-primary" data-testid="header-apply-btn">
              Apply Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-primary" data-testid="mobile-menu-btn">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200" data-testid="mobile-menu">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-semibold text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/about" className="font-semibold text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              <div className="space-y-2">
                <p className="font-semibold text-primary">Programs</p>
                <Link to="/programs/work-visa" className="block pl-4 text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>Work Visa (H-2A / H-2B)</Link>
                <Link to="/programs/tourist-visa" className="block pl-4 text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>Tourist Visa</Link>
                <Link to="/programs/visit-visa" className="block pl-4 text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>Visit Visa</Link>
                <Link to="/programs/study-visa" className="block pl-4 text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>Study Visa</Link>
              </div>
              <Link to="/employers" className="font-semibold text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>Employers</Link>
              <Link to="/blog" className="font-semibold text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link to="/contact" className="font-semibold text-primary hover:text-accent-gold" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
              <button onClick={() => { navigate('/apply'); setIsMenuOpen(false); }} className="btn-primary w-full">Apply Now</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;