import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/apply');
      return;
    }

    const checkPaymentStatus = async (attempts = 0) => {
      const maxAttempts = 5;
      if (attempts >= maxAttempts) {
        setLoading(false);
        setPaymentStatus({ status: 'timeout' });
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/payments/status/${sessionId}`);
        
        if (response.data.payment_status === 'paid') {
          setPaymentStatus(response.data);
          setLoading(false);
        } else if (response.data.status === 'expired') {
          setPaymentStatus({ status: 'expired' });
          setLoading(false);
        } else {
          setTimeout(() => checkPaymentStatus(attempts + 1), 2000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setTimeout(() => checkPaymentStatus(attempts + 1), 2000);
      }
    };

    checkPaymentStatus();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-accent-gold mx-auto mb-4" />
          <p className="text-lg text-slate-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus?.status === 'timeout' || paymentStatus?.status === 'expired') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✕</span>
            </div>
            <h1 className="font-poppins text-2xl font-bold text-primary mb-2">Payment {paymentStatus.status === 'expired' ? 'Expired' : 'Timeout'}</h1>
            <p className="text-slate-600 mb-6">
              {paymentStatus.status === 'expired' 
                ? 'Your payment session has expired. Please try again.'
                : 'Unable to verify payment status. Please contact support if amount was deducted.'}
            </p>
            <button 
              onClick={() => navigate('/apply')} 
              className="btn-primary w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-8 md:p-12 shadow-lg border border-slate-200 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          
          <h1 data-testid="success-heading" className="font-poppins text-3xl sm:text-4xl font-bold text-primary mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-slate-600 mb-8">
            Thank you for your payment. Your application is now being processed.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-poppins font-semibold text-primary mb-4">Payment Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Session ID:</span>
                <span className="font-mono text-primary">{paymentStatus?.session_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Amount Paid:</span>
                <span className="font-semibold text-green-600">${paymentStatus?.amount?.toFixed(2)} {paymentStatus?.currency?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="font-semibold text-green-600">Paid</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>What's Next?</strong> Our team will review your application and contact you via email within 2-3 business days. Check your inbox for updates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              data-testid="btn-home"
              onClick={() => navigate('/')} 
              className="btn-secondary"
            >
              Back to Home
            </button>
            <button 
              data-testid="btn-contact"
              onClick={() => navigate('/contact')} 
              className="btn-primary"
            >
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;