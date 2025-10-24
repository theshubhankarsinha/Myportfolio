import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from '../components/AdminLogin';
import AdminRegister from '../components/AdminRegister';
import AdminDashboard from '../components/AdminDashboard';

interface AdminPageProps {
  onBack?: () => void;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const { user, loading } = useAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('register') === 'true') {
      setShowRegister(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user && !loginSuccess) {
    if (showRegister) {
      return (
        <AdminRegister
          onRegisterSuccess={() => setLoginSuccess(true)}
          onBackToLogin={() => {
            setShowRegister(false);
            window.history.replaceState({}, '', window.location.pathname);
          }}
          onBack={onBack}
        />
      );
    }
    return <AdminLogin onLoginSuccess={() => setLoginSuccess(true)} onBack={onBack} />;
  }

  return <AdminDashboard onBack={onBack} />;
}
