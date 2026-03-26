import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Building, DollarSign, LogOut, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const [statsRes, appsRes, empsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/dashboard/stats`, config),
        axios.get(`${BACKEND_URL}/api/applications`, config),
        axios.get(`${BACKEND_URL}/api/employers`, config)
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
      setEmployers(empsRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${BACKEND_URL}/api/applications/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: 'Success',
        description: 'Application status updated'
      });
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 data-testid="dashboard-heading" className="font-poppins text-2xl font-bold text-primary">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              data-testid="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-transparent text-slate-600 hover:text-primary'
              }`}
            >
              Overview
            </button>
            <button
              data-testid="tab-applications"
              onClick={() => setActiveTab('applications')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'applications'
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-transparent text-slate-600 hover:text-primary'
              }`}
            >
              Applications
            </button>
            <button
              data-testid="tab-employers"
              onClick={() => setActiveTab('employers')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'employers'
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-transparent text-slate-600 hover:text-primary'
              }`}
            >
              Employers
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <span className="text-sm text-slate-500">Total</span>
                </div>
                <p className="text-3xl font-bold text-primary">{stats?.total_applications || 0}</p>
                <p className="text-sm text-slate-600 mt-1">Applications</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <span className="text-sm text-slate-500">Pending</span>
                </div>
                <p className="text-3xl font-bold text-primary">{stats?.pending_applications || 0}</p>
                <p className="text-sm text-slate-600 mt-1">To Review</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Building className="w-8 h-8 text-purple-500" />
                  <span className="text-sm text-slate-500">Total</span>
                </div>
                <p className="text-3xl font-bold text-primary">{stats?.total_employers || 0}</p>
                <p className="text-sm text-slate-600 mt-1">Employers</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <span className="text-sm text-slate-500">Revenue</span>
                </div>
                <p className="text-3xl font-bold text-primary">${stats?.total_revenue?.toFixed(2) || 0}</p>
                <p className="text-sm text-slate-600 mt-1">Total Earnings</p>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="font-poppins text-xl font-bold text-primary mb-4">Recent Applications</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Name</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Visa Type</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app.id} className="border-b border-slate-100">
                        <td className="py-3 px-2 text-sm text-slate-800">{app.full_name}</td>
                        <td className="py-3 px-2 text-sm text-slate-600">{app.visa_type}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            app.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-slate-600">{new Date(app.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="font-poppins text-xl font-bold text-primary mb-4">All Applications</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Name</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Email</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Phone</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Visa Type</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100">
                      <td className="py-3 px-2 text-sm text-slate-800">{app.full_name}</td>
                      <td className="py-3 px-2 text-sm text-slate-600">{app.email}</td>
                      <td className="py-3 px-2 text-sm text-slate-600">{app.phone}</td>
                      <td className="py-3 px-2 text-sm text-slate-600">{app.visa_type}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Select onValueChange={(value) => updateApplicationStatus(app.id, value)}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Employers Tab */}
        {activeTab === 'employers' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="font-poppins text-xl font-bold text-primary mb-4">Registered Employers</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Company</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Contact Person</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Email</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Phone</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map((emp) => (
                    <tr key={emp.id} className="border-b border-slate-100">
                      <td className="py-3 px-2 text-sm font-semibold text-slate-800">{emp.company_name}</td>
                      <td className="py-3 px-2 text-sm text-slate-600">{emp.contact_person}</td>
                      <td className="py-3 px-2 text-sm text-slate-600">{emp.email}</td>
                      <td className="py-3 px-2 text-sm text-slate-600">{emp.phone}</td>
                      <td className="py-3 px-2 text-sm text-slate-600">{new Date(emp.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;