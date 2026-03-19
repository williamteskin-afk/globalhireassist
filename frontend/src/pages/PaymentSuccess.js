import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);

  const pollStatus = useCallback(async (attempts = 0) => {
    if (!sessionId || attempts >= 5) {
      if (attempts >= 5) setStatus('timeout');
      return;
    }
    try {
      const res = await fetch(`${API}/payments/status/${sessionId}`, { credentials: 'include' });
      const data = await res.json();
      setPaymentData(data);
      if (data.payment_status === 'paid') { setStatus('success'); return; }
      if (data.status === 'expired') { setStatus('failed'); return; }
      setTimeout(() => pollStatus(attempts + 1), 2000);
    } catch {
      if (attempts < 4) setTimeout(() => pollStatus(attempts + 1), 2000);
      else setStatus('error');
    }
  }, [sessionId]);

  useEffect(() => { pollStatus(); }, [pollStatus]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-20">
      <Card className="max-w-md w-full mx-4 text-center shadow-sm border border-slate-100" data-testid="payment-status">
        <CardContent className="p-10">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-gold animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-navy font-serif">Processing Payment</h2>
              <p className="text-slate-600 mt-3 font-sans">Please wait while we confirm your payment...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy font-serif">Payment Successful!</h2>
              <p className="text-slate-600 mt-3 font-sans">Thank you for your payment. A confirmation has been sent to your email.</p>
              {paymentData && (
                <p className="text-gold font-bold text-lg mt-2 font-sans">
                  ${(paymentData.amount_total / 100).toFixed(2)} {paymentData.currency?.toUpperCase()}
                </p>
              )}
              <div className="flex gap-3 justify-center mt-8">
                <Button asChild className="bg-gold text-navy hover:bg-gold-light font-semibold"><Link to="/dashboard">Go to Dashboard</Link></Button>
                <Button asChild variant="outline"><Link to="/">Home</Link></Button>
              </div>
            </>
          )}
          {(status === 'failed' || status === 'error' || status === 'timeout') && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy font-serif">Payment Issue</h2>
              <p className="text-slate-600 mt-3 font-sans">There was an issue processing your payment. Please try again or contact support.</p>
              <div className="flex gap-3 justify-center mt-8">
                <Button asChild className="bg-gold text-navy hover:bg-gold-light font-semibold"><Link to="/membership">Try Again</Link></Button>
                <Button asChild variant="outline"><Link to="/contact">Contact Support</Link></Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
