import { useState } from 'react';
import Logo from './Logo';
import ForgotPassword from './ForgotPassword';

const LoginForm = ({ onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (showForgotPassword) {
    return <ForgotPassword onReturn={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full">
      <Logo />
      <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
      <form className="flex flex-col items-center gap-6">
        <div className="w-full">
          <label className="block text-sm mb-2 text-left">Enter your username</label>
          <input 
            className="w-full p-3 bg-gray-50 rounded-lg text-sm" 
            name="username" 
            placeholder="Username" 
            type="text"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-2 text-left">Enter your password</label>
          <div className="relative">
            <input 
              className="w-full p-3 bg-gray-50 rounded-lg text-sm" 
              name="password" 
              placeholder="Password" 
              type={showPassword ? "text" : "password"}
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
          className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity"
        >
          LOGIN
        </button>
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-blue-500 text-sm hover:underline"
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 