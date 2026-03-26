import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProgramDetail = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const programs = {
    'work-visa': {
      title: 'Work Visa (H-2A / H-2B)',
      description: 'Temporary work visas for agricultural and non-agricultural workers in the United States',
      image: 'https://images.pexels.com/photos/6170656/pexels-photo-6170656.jpeg',
      eligibility: [
        'Job offer from a US employer',
        'Employer must have H-2A or H-2B certification',
        'Temporary or seasonal work position',
        'Valid passport',
        'No criminal record'
      ],
      documents: [
        'Valid passport',
        'Job offer letter',
        'Resume/CV',
        'Educational certificates',
        'Work experience letters',
        'Police clearance certificate'
      ],
      process: [
        { step: 'Submit application form', time: '1-2 days' },
        { step: 'Document verification', time: '3-5 days' },
        { step: 'Payment processing', time: '1 day' },
        { step: 'Visa application filing', time: '2-3 weeks' },
        { step: 'Embassy interview preparation', time: '1 week' },
        { step: 'Visa approval', time: '1-4 weeks' }
      ]
    },
    'tourist-visa': {
      title: 'Tourist Visa',
      description: 'Explore the world and visit new destinations with our tourist visa assistance',
      image: 'https://images.pexels.com/photos/36729290/pexels-photo-36729290.jpeg',
      eligibility: [
        'Valid passport (minimum 6 months validity)',
        'Proof of sufficient funds',
        'Return ticket booking',
        'Accommodation details',
        'Travel insurance'
      ],
      documents: [
        'Valid passport',
        'Passport-size photographs',
        'Bank statements (last 6 months)',
        'Employment letter',
        'Hotel reservations',
        'Travel itinerary'
      ],
      process: [
        { step: 'Application submission', time: '1 day' },
        { step: 'Document review', time: '2-3 days' },
        { step: 'Payment', time: '1 day' },
        { step: 'Visa processing', time: '1-2 weeks' },
        { step: 'Approval', time: '1 week' }
      ]
    },
    'visit-visa': {
      title: 'Visit Visa',
      description: 'Visit friends and family abroad with confidence and proper documentation',
      image: 'https://images.pexels.com/photos/36729290/pexels-photo-36729290.jpeg',
      eligibility: [
        'Valid passport',
        'Invitation letter from host',
        'Proof of relationship',
        'Financial stability',
        'Return flight booking'
      ],
      documents: [
        'Valid passport',
        'Invitation letter',
        'Host documents (ID, address proof)',
        'Bank statements',
        'Employment letter',
        'Photographs'
      ],
      process: [
        { step: 'Application submission', time: '1 day' },
        { step: 'Document verification', time: '3-4 days' },
        { step: 'Payment', time: '1 day' },
        { step: 'Visa processing', time: '2-3 weeks' },
        { step: 'Approval', time: '1 week' }
      ]
    },
    'study-visa': {
      title: 'Study Visa',
      description: 'Pursue your education dreams abroad with our comprehensive study visa support',
      image: 'https://images.pexels.com/photos/7683629/pexels-photo-7683629.jpeg',
      eligibility: [
        'Admission letter from accredited institution',
        'Proof of financial support',
        'Valid passport',
        'Academic transcripts',
        'English proficiency test scores (IELTS/TOEFL)'
      ],
      documents: [
        'Valid passport',
        'University acceptance letter',
        'Financial documents',
        'Academic transcripts',
        'English test scores',
        'Statement of purpose',
        'Photographs'
      ],
      process: [
        { step: 'Application submission', time: '1-2 days' },
        { step: 'Document review', time: '5-7 days' },
        { step: 'Payment', time: '1 day' },
        { step: 'Visa application filing', time: '2-3 weeks' },
        { step: 'Embassy interview', time: '1 week' },
        { step: 'Visa approval', time: '2-4 weeks' }
      ]
    }
  };

  const program = programs[type];

  if (!program) {
    return <div className="min-h-screen flex items-center justify-center">Program not found</div>;
  }

  return (
    <div className="font-open-sans">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center" style={{ backgroundImage: `url(${program.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 data-testid="program-title" className="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">{program.title}</h1>
            <p className="text-lg text-white/90 max-w-2xl">{program.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h2 className="font-poppins text-3xl font-bold text-primary">Eligibility Requirements</h2>
              </div>
              <ul className="space-y-3">
                {program.eligibility.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-gold flex-shrink-0 mt-1" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="font-poppins text-3xl font-bold text-primary">Required Documents</h2>
              </div>
              <ul className="space-y-3">
                {program.documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-accent-gold flex-shrink-0 mt-1" />
                    <span className="text-slate-600">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-primary mb-4">Application Process</h2>
            <p className="text-slate-600">Step-by-step guide to your visa application</p>
          </div>
          <div className="space-y-4">
            {program.process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-slate-200 flex items-center gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-gold text-white flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins text-lg font-semibold text-primary mb-1">{step.step}</h3>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-5 h-5 text-accent-gold" />
                  <span className="text-sm font-semibold">{step.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8">Apply now and take the first step towards your {program.title}</p>
          <button 
            data-testid="program-apply-btn" 
            onClick={() => navigate('/apply')} 
            className="bg-accent-gold text-white font-semibold px-8 py-4 rounded-md hover:bg-accent-gold/90 transition-all text-lg shadow-lg"
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProgramDetail;