import { useState, useEffect } from 'react';
import Logo from './Logo';
import OTPInput from './OTPInput';

// Mnotify API key
const MNOTIFY_API_KEY = 'TUX6IqmI8FGQEjY2isJROxxCP';

// Security questions list
const securityQuestions = [
  "What is your mother's maiden name?",
  "What was your first pet's name?",
  "What city were you born in?",
  "What is your favorite book?",
  "What was your childhood nickname?",
];

const SignupForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [currentOTP, setCurrentOTP] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityForm, setShowSecurityForm] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [showSecurityAnswer, setShowSecurityAnswer] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showOTP && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showOTP, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate a random 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTPViaMnotify = async (phone: string, otp: string) => {
    try {
      const message = `Your verification code is: ${otp}. The code expires in 60 seconds`;
      const url = 'https://apps.mnotify.net/smsapi';
      
      // Format phone number to remove any '+' and ensure it starts with '233'
      const formattedPhone = phone.replace('+', '').trim();
      
      const formData = new URLSearchParams();
      formData.append('key', MNOTIFY_API_KEY);
      formData.append('to', formattedPhone);
      formData.append('msg', message);
      formData.append('sender_id', 'JCL LODGE');
      formData.append('type', '0');  // Added type parameter
      formData.append('schedule_date', '');  // Added empty schedule_date
      
      console.log('Attempting to send OTP:');
      console.log('To:', formattedPhone);
      console.log('Message:', message);
      console.log('Request body:', formData.toString());
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formData.toString()
      });

      const data = await response.json();
      console.log('Full Mnotify response:', data);
      
      // Check both code and status, and also check if the response includes a message ID
      if (data.code === '1000' && data.status === 'success' && data.message) {
        console.log('SMS sent successfully. Message ID:', data.message);
        return true;
      } else {
        console.error('Mnotify error:', data);
        return false;
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate phone number format (should be 10 digits starting with 0)
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      if (cleanedPhoneNumber.length !== 10 || !cleanedPhoneNumber.startsWith('0')) {
        setError('Please enter a valid Ghana phone number (e.g., 0541234567)');
        setLoading(false);
        return;
      }

      // Generate new OTP
      const newOTP = generateOTP();
      console.log('Generated OTP:', newOTP);
      setCurrentOTP(newOTP);

      // Convert to international format for Mnotify (233...)
      // Remove leading 0 and add 233
      const internationalNumber = '233' + cleanedPhoneNumber.slice(1);
      console.log('Sending to number:', internationalNumber);
      
      // Send OTP via Mnotify
      const sent = await sendOTPViaMnotify(internationalNumber, newOTP);
      
      if (sent) {
        setShowOTP(true);
        setTimeLeft(60);
        setCanResend(false);
        console.log('OTP sent successfully to:', phoneNumber);
      } else {
        setError('Failed to send OTP. Please check your phone number and try again.');
        console.log('Failed to send OTP to:', phoneNumber);
      }
    } catch (err) {
      console.error('Error in handlePhoneSubmit:', err);
      setError('Failed to send OTP. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      handlePhoneSubmit(new Event('submit') as any);
    }
  };

  const handleOTPComplete = (otp: string) => {
    setError('');
    setLoading(true);

    try {
      if (otp === currentOTP) {
        // Handle successful verification
        console.log('Phone number verified successfully');
        setIsVerified(true);
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setShowSecurityForm(true);
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle security form submission
    console.log('Security form submitted:', { securityQuestion, securityAnswer });
    setShowSuccessModal(true);
  };

  // Check password strength
  const checkPasswordStrength = (pass: string) => {
    // Initialize score
    let score = 0;
    
    // Check length
    if (pass.length >= 8) score++;
    
    // Check for numbers
    if (/\d/.test(pass)) score++;
    
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    
    // Check for uppercase and lowercase
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;

    // Set message based on score
    let message = '';
    switch (score) {
      case 0:
      case 1:
        message = 'Your password is weak';
        break;
      case 2:
        message = 'Your password is moderate';
        break;
      case 3:
      case 4:
        message = 'Your password is strong';
        break;
      default:
        message = '';
    }

    setPasswordStrength({ score, message });
  };

  // Update password strength when password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  return (
    <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full rotate-y-180">
      <Logo />
      <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
      
      {error && (
        <div className="text-red-500 text-sm text-center mb-4">
          {error}
        </div>
      )}

      {!showOTP && !isVerified ? (
        <form onSubmit={handlePhoneSubmit} className="flex flex-col items-center gap-6">
          <div className="w-full">
            <label className="block text-sm mb-2 text-left">Enter your phone number</label>
            <input 
              className="w-full p-3 bg-gray-50 rounded-lg text-sm" 
              type="tel"
              placeholder="e.g. 054 XXX XXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'SENDING OTP...' : 'PROCEED'}
          </button>
        </form>
      ) : isVerified && !showSecurityForm ? (
        <form onSubmit={handleCredentialsSubmit} className="flex flex-col items-center gap-6">
          <div className="w-full">
            <label className="block text-sm mb-2 text-left">Enter your username</label>
            <input 
              className="w-full p-3 bg-gray-50 rounded-lg text-sm" 
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-sm mb-2 text-left">Enter your password</label>
            <div className="relative">
              <input 
                className="w-full p-3 bg-gray-50 rounded-lg text-sm" 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
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
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 2 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
                <p className={`text-sm ${
                  passwordStrength.score <= 1 ? 'text-red-500' : 
                  passwordStrength.score === 2 ? 'text-yellow-500' : 
                  'text-green-500'
                }`}>
                  {passwordStrength.message}
                </p>
              </div>
            )}
          </div>
          <button 
            type="submit"
            className="w-full bg-[#FFD600] text-black rounded-full py-3 text-sm hover:opacity-90 transition-opacity"
          >
            NEXT
          </button>
        </form>
      ) : isVerified && showSecurityForm ? (
        <form onSubmit={handleSecuritySubmit} className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">Complete the form to Sign up</h3>
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-sm">?</div>
          </div>
          <div className="w-full">
            <label className="block text-sm mb-2 text-left">Select Security Question</label>
            <select
              className="w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-600"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
            >
              <option value="">--- Select a Security Question</option>
              {securityQuestions.map((question, index) => (
                <option key={index} value={question}>{question}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm mb-2 text-left">Enter Security Answer</label>
            <div className="relative">
              <input 
                className="w-full p-3 bg-gray-50 rounded-lg text-sm" 
                type={showSecurityAnswer ? "text" : "password"}
                placeholder="E.g. Answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs"
                onClick={() => setShowSecurityAnswer(!showSecurityAnswer)}
              >
                {showSecurityAnswer ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>
          <p className="text-pink-500 text-sm italic">
            If you forget your password we will ask for the answer to your security question
          </p>
          <button 
            type="submit"
            className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity"
          >
            SIGN UP
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-xl font-semibold">Verify Number</h3>
          <p className="text-sm text-gray-600">
            Please enter the 6 digit code that has been sent to {phoneNumber}. The code expires in {formatTime(timeLeft)}s
          </p>
          <OTPInput onComplete={handleOTPComplete} />
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive code?</p>
            <button
              onClick={handleResendOTP}
              className={`text-blue-600 text-sm hover:underline ${!canResend && 'opacity-50 cursor-not-allowed'}`}
              disabled={!canResend}
            >
              Resend OTP
            </button>
          </div>
          <button 
            onClick={() => handleOTPComplete(currentOTP)}
            disabled={loading}
            className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            VERIFY
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-green-200 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[#0066BE] mb-2">Success</h3>
            <p className="text-gray-600 mb-6">Account created successfully</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#FFD600] text-black rounded-full py-2 px-4 font-medium hover:opacity-90 transition-opacity"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm; 