import React from 'react'
import { useState, useEffect } from 'react';
import Logo from './Logo';
import OTPInput from './OTPInput';
import { createUser } from '../api/auth';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import Loader from './Loader';

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



const Signm = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [currentOTP, setCurrentOTP] = useState('');
    const [enteredOTP, setEnteredOTP] = useState('');
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
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        // For development/testing - always return success and log the OTP
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode - Simulated OTP:', otp);
          console.log('Would have sent to phone:', phone);
          return true;
        }
  
        const message = `Your verification code is: ${otp}. The code expires in 60 seconds`;
        const url = 'https://apps.mnotify.net/smsapi';
        
        const formattedPhone = phone.replace('+', '').trim();
        
        const formData = new URLSearchParams();
        formData.append('key', 'TUX6IqmI8FGQEjY2isJROxxCP');
        formData.append('to', formattedPhone);
        formData.append('msg', message);
        formData.append('sender_id', 'JCL LODGE');
        formData.append('type', '0');
        formData.append('schedule_date', '');
        
        console.log('Attempting to send OTP to:', formattedPhone);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: formData.toString()
        });
  
        if (!response.ok) {
          throw new Error('Failed to send OTP');
        }
  
        const data = await response.json();
        console.log('Mnotify API response:', data);
        
        return data.code === '1000' && data.status === 'success';
      } catch (error) {
        console.error('Error sending OTP:', error);
        // For development/testing - return success even if API fails
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode - Proceeding despite API error');
          console.log('Simulated OTP:', otp);
          return true;
        }
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
      setEnteredOTP(otp);
      // Don't automatically verify when OTP is entered
      // Let the user click the verify button
    };
  
    const handleCredentialsSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage('');
  
      // Check if username is entered
      if (!username.trim()) {
        setErrorMessage('Please enter a username');
        setShowErrorModal(true);
        return;
      }
  
      // Check if password is entered
      if (!password) {
        setErrorMessage('Please enter a password');
        setShowErrorModal(true);
        return;
      }
  
      // Check password strength
      const strengthScore = checkPasswordStrength(password);
      
      if (strengthScore.score < 3) {
        setErrorMessage(
          'Password is too weak. Password must contain at least:\n' +
          '- 8 characters\n' +
          '- One uppercase letter\n' +
          '- One lowercase letter\n' +
          '- One number\n' +
          '- One special character'
        );
        setShowErrorModal(true);
        return;
      }
  
      if (username && password) {
        setShowSecurityForm(true);
      }
    };
  
    const handleSecuritySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');
  
      try {
        const userData = {
          username,
          password,
          phone_number: phoneNumber.replace(/\D/g, ''),
          security_question: securityQuestion,
          security_answer: securityAnswer
        };
  
        await createUser(userData);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Error creating user:', error);
        setErrorMessage(
          error instanceof Error 
            ? error.message 
            : 'Failed to create account. Please try again.'
        );
        setShowErrorModal(true);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    // Modify checkPasswordStrength to return the score
    const checkPasswordStrength = (pass: string): { score: number; message: string } => {
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
      return { score, message };
    };
  
    // Update password strength when password changes
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPassword = e.target.value;
      setPassword(newPassword);
      checkPasswordStrength(newPassword);
    };
  
    const handleVerifyClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setErrorMessage('');
      
      if (!enteredOTP) {
        setErrorMessage('Please enter the verification code');
        setShowErrorModal(true);
        return;
      }
      
      setLoading(true);
      try {
        if (enteredOTP === currentOTP) {
          console.log('Phone number verified successfully');
          setIsVerified(true);
        } else {
          setErrorMessage('Invalid verification code');
          setShowErrorModal(true);
        }
      } catch (err) {
        setErrorMessage('Verification failed');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSuccessModalClose = () => {
      setShowSuccessModal(false);
     
    };
  
    return (
      <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full rotate-y-180 z-[10000]">
        <Logo />
        <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
        
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
              disabled={isSubmitting}
              className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
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
            <OTPInput onComplete={(otp) => handleOTPComplete(otp)} />
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
              onClick={handleVerifyClick}
              disabled={loading}
              className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'VERIFY'}
            </button>
          </div>
        )}
  
        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            title="Success"
            message="Account created successfully"
            onClose={handleSuccessModalClose}
          />
        )}
  
        {showErrorModal && (
          <ErrorModal
            message={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
  
        {isSubmitting && <Loader />}
      </div>
    );
  };

export default Signm
