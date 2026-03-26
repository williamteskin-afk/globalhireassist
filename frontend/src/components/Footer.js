import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-poppins text-xl font-bold mb-4">Global Hire Assist</h3>
            <p className="text-white/70 text-sm mb-4">
              Your trusted visa partner for global opportunities. We provide reliable, transparent visa assistance and job access worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-white/70 hover:text-accent-gold transition-colors">About Us</Link></li>
              <li><Link to="/employers" className="text-white/70 hover:text-accent-gold transition-colors">For Employers</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-accent-gold transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-accent-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/programs/work-visa" className="text-white/70 hover:text-accent-gold transition-colors">Work Visa</Link></li>
              <li><Link to="/programs/tourist-visa" className="text-white/70 hover:text-accent-gold transition-colors">Tourist Visa</Link></li>
              <li><Link to="/programs/visit-visa" className="text-white/70 hover:text-accent-gold transition-colors">Visit Visa</Link></li>
              <li><Link to="/programs/study-visa" className="text-white/70 hover:text-accent-gold transition-colors">Study Visa</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-accent-gold flex-shrink-0" />
                <a href="mailto:globalhireassist@gmail.com" className="text-white/70 hover:text-accent-gold transition-colors">globalhireassist@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-accent-gold flex-shrink-0" />
                <a href="https://wa.me/14472763403" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent-gold transition-colors">+1 447 276 3403</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-accent-gold flex-shrink-0" />
                <span className="text-white/70">Mesa, Arizona, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Global Hire Assist. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/70 hover:text-accent-gold transition-colors text-xl" aria-label="Facebook">
              f
            </a>
            <a href="#" className="text-white/70 hover:text-accent-gold transition-colors text-xl" aria-label="Twitter">
              𝕏
            </a>
            <a href="#" className="text-white/70 hover:text-accent-gold transition-colors text-xl" aria-label="LinkedIn">
              in
            </a>
            <a href="#" className="text-white/70 hover:text-accent-gold transition-colors text-xl" aria-label="Instagram">
              📷
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;