import { motion } from 'framer-motion';
import { Target, Users, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="font-open-sans">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 data-testid="about-heading" className="font-poppins text-4xl sm:text-5xl font-bold mb-6">About Global Hire Assist</h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              We are a leading visa consultancy and recruitment platform based in Mesa, Arizona, USA. Our mission is to connect talented individuals with global opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="label-uppercase mb-2">Who We Are</p>
              <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-primary mb-6">Your Trusted Partner in Global Immigration</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Global Hire Assist is a comprehensive visa consultancy and recruitment platform dedicated to helping individuals achieve their dreams of working, studying, or visiting abroad. Located in Mesa, Arizona, we specialize in connecting job seekers with legitimate overseas employment opportunities while providing expert guidance throughout the visa application process.
              </p>
              <p className="text-slate-600 leading-relaxed">
                With years of experience in immigration services, our team of licensed professionals understands the complexities of visa applications and works diligently to ensure a smooth, transparent, and successful journey for every client.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.pexels.com/photos/7644148/pexels-photo-7644148.jpeg" 
                alt="Professional team" 
                className="rounded-xl shadow-xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-gold/10 text-accent-gold mb-6">
              <Target className="w-10 h-10" />
            </div>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              To provide reliable, transparent, and professional visa assistance that empowers individuals to access global job markets and educational opportunities. We are committed to simplifying the immigration process and building lasting relationships based on trust and success.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="label-uppercase mb-2">What We Do</p>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-primary">Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/10 text-accent-gold mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-primary mb-3">Visa Processing Support</h3>
              <p className="text-slate-600">
                Expert guidance through every step of the visa application process, from documentation to approval.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/10 text-accent-gold mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-primary mb-3">Job Matching</h3>
              <p className="text-slate-600">
                Connecting qualified candidates with verified employers in the USA and other countries.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/10 text-accent-gold mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-primary mb-3">Employer Compliance</h3>
              <p className="text-slate-600">
                Helping US employers navigate immigration compliance and hire international talent legally.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-accent-gold text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-poppins text-2xl font-semibold mb-3">Trust</h3>
              <p className="text-white/90">Building lasting relationships through integrity and honesty</p>
            </div>
            <div>
              <h3 className="font-poppins text-2xl font-semibold mb-3">Transparency</h3>
              <p className="text-white/90">Clear communication at every stage of your journey</p>
            </div>
            <div>
              <h3 className="font-poppins text-2xl font-semibold mb-3">Professionalism</h3>
              <p className="text-white/90">Expert guidance from licensed immigration specialists</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;