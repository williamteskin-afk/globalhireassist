import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Globe, FileCheck, Headphones, Briefcase, GraduationCap, Plane, MapPin, Shield, Clock, Users, TrendingUp } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const visaPrograms = [
    {
      title: 'Work Visa (H-2A / H-2B)',
      description: 'Temporary work visas for agricultural and non-agricultural workers',
      icon: <Briefcase className="w-8 h-8" />,
      image: 'https://images.pexels.com/photos/6170656/pexels-photo-6170656.jpeg',
      path: '/programs/work-visa'
    },
    {
      title: 'Tourist Visa',
      description: 'Explore the world with our tourist visa assistance',
      icon: <Plane className="w-8 h-8" />,
      image: 'https://images.pexels.com/photos/36729290/pexels-photo-36729290.jpeg',
      path: '/programs/tourist-visa'
    },
    {
      title: 'Visit Visa',
      description: 'Visit friends and family with confidence',
      icon: <MapPin className="w-8 h-8" />,
      image: 'https://images.pexels.com/photos/36729290/pexels-photo-36729290.jpeg',
      path: '/programs/visit-visa'
    },
    {
      title: 'Study Visa',
      description: 'Pursue your education dreams abroad',
      icon: <GraduationCap className="w-8 h-8" />,
      image: 'https://images.pexels.com/photos/7683629/pexels-photo-7683629.jpeg',
      path: '/programs/study-visa'
    }
  ];

  const steps = [
    { title: 'Apply Online', description: 'Fill out our simple application form', icon: <FileCheck className="w-10 h-10" /> },
    { title: 'Document Review', description: 'We verify your eligibility and documents', icon: <CheckCircle className="w-10 h-10" /> },
    { title: 'Payment & Processing', description: 'Secure payment and application processing', icon: <Shield className="w-10 h-10" /> },
    { title: 'Visa Guidance', description: 'Expert support until visa approval', icon: <Headphones className="w-10 h-10" /> }
  ];

  const benefits = [
    { title: 'Trusted Visa Consultants', icon: <Shield className="w-6 h-6" />, description: 'Licensed and experienced professionals' },
    { title: 'Transparent Process', icon: <Globe className="w-6 h-6" />, description: 'Clear steps and honest communication' },
    { title: 'Employer Partnerships', icon: <Users className="w-6 h-6" />, description: 'Direct connections with US employers' },
    { title: 'Fast Processing', icon: <Clock className="w-6 h-6" />, description: 'Quick turnaround times' },
    { title: 'Secure Payments', icon: <Shield className="w-6 h-6" />, description: 'Protected online transactions' },
    { title: 'High Success Rate', icon: <TrendingUp className="w-6 h-6" />, description: '95% application approval rate' }
  ];

  const testimonials = [
    { name: 'Carlos Martinez', country: 'Mexico', visa: 'H-2A Work Visa', message: 'Global Hire Assist helped me secure my H-2A visa in just 3 weeks. Professional and reliable!', seed: 1 },
    { name: 'Maria Silva', country: 'Brazil', visa: 'Tourist Visa', message: 'The process was smooth and transparent. I highly recommend their services!', seed: 2 },
    { name: 'John Doe', country: 'Philippines', visa: 'Study Visa', message: 'Thanks to Global Hire Assist, I am now studying in the USA. Amazing support throughout!', seed: 3 }
  ];

  return (
    <div className="font-open-sans">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/34134/pexels-photo.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 data-testid="hero-heading" className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Global Hire Assist
              <br />
              <span className="text-accent-gold">Your Trusted Visa Partner</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Connecting job seekers with overseas opportunities & visa support. Start your journey to a better future today.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                data-testid="hero-apply-btn" 
                onClick={() => navigate('/apply')} 
                className="btn-primary"
              >
                Apply Now
              </button>
              <button 
                data-testid="hero-programs-btn" 
                onClick={() => navigate('/programs/work-visa')} 
                className="bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-all"
              >
                View Programs
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="label-uppercase mb-2">Simple Process</p>
            <h2 data-testid="how-it-works-heading" className="font-poppins text-3xl sm:text-4xl font-bold text-primary">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-gold/10 text-accent-gold mb-4">
                  {step.icon}
                </div>
                <h3 className="font-poppins text-xl font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Programs */}
      <section className="section-padding bg-slate-50" style={{ backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/d0f751c4-32ad-4e3b-a8a2-91a075e6fa26/images/abe9ed48664b9ce6e4681dc7733e75cbaf9649e802283442a9c930f0be03b125.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="label-uppercase mb-2">Our Services</p>
            <h2 data-testid="visa-programs-heading" className="font-poppins text-3xl sm:text-4xl font-bold text-primary">Visa Programs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaPrograms.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`visa-card-${index}`}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden card-hover cursor-pointer"
                onClick={() => navigate(program.path)}
              >
                <div className="h-48 overflow-hidden">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-accent-gold mb-3">{program.icon}</div>
                  <h3 className="font-poppins text-xl font-semibold text-primary mb-2">{program.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{program.description}</p>
                  <button className="text-accent-gold font-semibold text-sm hover:underline">Learn More →</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="label-uppercase mb-2">Why Choose Us</p>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-primary">Your Success Is Our Mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-poppins text-lg font-semibold text-primary mb-1">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <img 
              src="https://static.prod-images.emergentagent.com/jobs/d0f751c4-32ad-4e3b-a8a2-91a075e6fa26/images/1c6aad278836129033c92b11e069fccbadb5a6489cc210dd5dfe90e0e45477ed.png" 
              alt="Trust Seal" 
              className="inline-block w-32 h-32"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="label-uppercase mb-2 text-accent-gold">Success Stories</p>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${testimonial.seed}`} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-poppins font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-white/70">{testimonial.country}</p>
                  </div>
                </div>
                <p className="text-white/90 mb-3">{testimonial.message}</p>
                <p className="text-xs text-accent-gold">{testimonial.visa}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-accent-gold text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 data-testid="cta-heading" className="font-poppins text-3xl sm:text-4xl font-bold mb-4">Start Your Visa Journey Today</h2>
          <p className="text-lg mb-8 text-white/90">Join thousands of successful applicants who trusted us with their dreams</p>
          <button 
            data-testid="cta-apply-btn" 
            onClick={() => navigate('/apply')} 
            className="bg-white text-accent-gold font-semibold px-8 py-4 rounded-md hover:bg-gray-100 transition-all text-lg shadow-lg"
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
