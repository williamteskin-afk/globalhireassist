import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import ProgramDetail from '@/pages/ProgramDetail';
import Apply from '@/pages/Apply';
import PaymentSuccess from '@/pages/PaymentSuccess';
import Employers from '@/pages/Employers';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs/:type" element={<ProgramDetail />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;