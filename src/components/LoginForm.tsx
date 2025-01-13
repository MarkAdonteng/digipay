import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ForgotPassword from './ForgotPassword';
import { verifyLogin } from '../api/auth';
import ErrorModal from './ErrorModal';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await verifyLogin({ username, password });
      
      if (response.success && response.token) {
        // Store auth token and user data
        localStorage.setItem('authToken', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(response.message || 'Invalid username or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }

    // Call onLogin after successful login
    onLogin();
  };

  if (showForgotPassword) {
    return <ForgotPassword onReturn={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full top-56">
      <Logo />
      <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
      <form onSubmit={handleLogin} className="flex flex-col items-center gap-6">
        <div className="w-full">
          <label className="block text-sm mb-2 text-left">Enter your username</label>
          <input 
            className="w-full p-3 bg-gray-50 rounded-lg text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username" 
            placeholder="Username" 
            type="text"
            required
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-2 text-left">Enter your password</label>
          <div className="relative">
            <input 
              className="w-full p-3 bg-gray-50 rounded-lg text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password" 
              placeholder="Password" 
              type={showPassword ? "text" : "password"}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity"
        >
          {loading ? 'Logging in...' : 'LOGIN'}
        </button>
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-blue-500 text-sm hover:underline"
        >
          Forgot Password?
        </button>
      </form>

      {error && (
        <ErrorModal 
          message={error}
          onClose={() => setError('')}
        />
      )}
    </div>
  );
};

export default LoginForm; 