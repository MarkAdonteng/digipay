import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Background from './components/Background';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TermsAndConditions from './components/TermsAndConditions';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Invoicing from './pages/Invoicing';
import Customers from './pages/Customers';
import SMS from './pages/SMS';
import MoneyTransfer from './pages/MoneyTransfer';
import TransactionHistory from './pages/TransactionHistory';
import ManageBusiness from './pages/ManageBusiness';
import Help from './pages/Help';

function App() {
  const [currentForm, setCurrentForm] = useState<'login' | 'signup'>('login');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('termsAccepted');
    setIsInitialized(true);
  }, []);

  const handleAcceptTerms = () => {
    setHasAcceptedTerms(true);
    localStorage.setItem('termsAccepted', 'true');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('authToken', 'some-token');
  };

  const renderAuthContent = () => {
    if (!hasAcceptedTerms) {
      return <TermsAndConditions onAccept={handleAcceptTerms} />;
    }

    return (
      <div className="relative flex flex-col items-center">
        <div className="mb-2 flex gap-4 absolute mt-32">
          <button
            onClick={() => setCurrentForm('login')}
            className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              currentForm === 'login' ? 'bg-black text-white' : 'bg-white text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentForm('signup')}
            className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              currentForm === 'signup' ? 'bg-black text-white' : 'bg-white text-gray-500'
            }`}
          >
            Signup
          </button>
        </div>
        <div className="w-[400px] min-h-[500px]">
          {currentForm === 'login' ? (
            <div className=" w-full">
              <LoginForm onLogin={handleLogin} />
            </div>
          ) : (
            <div className=" w-full">
              <SignupForm onToggle={() => setCurrentForm('login')} />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
              <Background />
              <div className="relative z-10 bottom-56">
                {renderAuthContent()}
              </div>
            </div>
          )
        } />

        <Route element={
          isLoggedIn ? <DashboardLayout /> : <Navigate to="/" replace />
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/invoicing" element={<Invoicing />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sms" element={<SMS />} />
          <Route path="/money/transfer" element={<MoneyTransfer />} />
          <Route path="/money/history" element={<TransactionHistory />} />
          <Route path="/manage-business" element={<ManageBusiness />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

