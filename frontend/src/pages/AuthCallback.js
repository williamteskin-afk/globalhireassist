import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AuthCallback() {
  const hasProcessed = useRef(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash;
    const sessionId = new URLSearchParams(hash.substring(1)).get('session_id');
    if (!sessionId) { navigate('/'); return; }

    const exchange = async () => {
      try {
        const res = await fetch(`${API}/auth/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ session_id: sessionId })
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          navigate(userData.is_admin ? '/admin' : '/dashboard', { state: { user: userData } });
        } else {
          navigate('/');
        }
      } catch (e) {
        navigate('/');
      }
    };
    exchange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
