import { useState, useEffect } from 'react';
import Logo from './Logo';
import OTPInput from './OTPInput';
import { verifyPhoneAndGetSecurityQuestion, verifySecurityAnswer } from '../api/auth';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const ForgotPassword = ({ onReturn }: { onReturn: () => void }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetCode, setShowResetCode] = useState(false);
  const [currentOTP, setCurrentOTP] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showResetCode && timeLeft > 0) {
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
  }, [showResetCode, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

      const message = `Your password reset code is: ${otp}. The code expires in 60 seconds`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      if (!phoneNumber.trim()) {
        throw new Error('Please enter your phone number');
      }

      // Validate phone number format
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      if (cleanedPhoneNumber.length !== 10 || !cleanedPhoneNumber.startsWith('0')) {
        throw new Error('Please enter a valid Ghana phone number (e.g., 0541234567)');
      }

      const newOTP = generateOTP();
      console.log('Generated OTP:', newOTP);

      const internationalNumber = '233' + cleanedPhoneNumber.slice(1);
      const sent = await sendOTPViaMnotify(internationalNumber, newOTP);
      
      if (sent) {
        setCurrentOTP(newOTP);
        setShowResetCode(true);
        setTimeLeft(60);
        setCanResend(false);
      } else {
        throw new Error('Failed to send reset code. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send reset code');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      handleSubmit(new Event('submit') as any);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setError('');
    setLoading(true);

    try {
      if (otp === currentOTP) {
        const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
        let formattedNumber;
        
        // Keep the number in local format (starting with 0)
        if (cleanedPhoneNumber.startsWith('0')) {
          formattedNumber = cleanedPhoneNumber;
        } else if (cleanedPhoneNumber.startsWith('233')) {
          formattedNumber = '0' + cleanedPhoneNumber.slice(3);
        } else {
          formattedNumber = '0' + cleanedPhoneNumber;
        }

        console.log('Verifying phone number:', formattedNumber); // Debug log
        
        // Verify phone and get security question
        try {
          const question = await verifyPhoneAndGetSecurityQuestion(formattedNumber);
          setShowResetCode(false); // Hide OTP input
          setSecurityQuestion(question);
          setShowSecurityQuestion(true);
        } catch (error) {
          if (error instanceof Error && error.message === 'This phone number is not registered in our system') {
            setErrorMessage('This phone number is not registered in our system');
            setShowErrorModal(true);
            return;
          }
          throw error;
        }
      } else {
        setErrorMessage('Invalid reset code');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Verification error:', error); // Debug log
      setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      let formattedNumber;
      
      if (cleanedPhoneNumber.startsWith('0')) {
        formattedNumber = cleanedPhoneNumber;
      } else if (cleanedPhoneNumber.startsWith('233')) {
        formattedNumber = '0' + cleanedPhoneNumber.slice(3);
      } else {
        formattedNumber = '0' + cleanedPhoneNumber;
      }
      
      await verifySecurityAnswer(formattedNumber, securityAnswer);
      setShowSecurityQuestion(false);
      setShowNewPasswordForm(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid security answer');
    } finally {
      setLoading(false);
    }
  };

  const checkAndUpdatePassword = async (phoneNumber: string, newPassword: string) => {
    try {
      console.log('Sending update password request for:', phoneNumber); // Debug log
      const response = await fetch('http://localhost:3000/api/users/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone_number: phoneNumber,
          new_password: newPassword 
        }),
      });

      const data = await response.json();
      console.log('Server response:', data); // Debug log
      
      if (!data.success) {
        throw new Error(data.message);
      }

      return true;
    } catch (error) {
      console.error('Password update error:', error); // Debug log
      throw error;
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      let formattedNumber = cleanedPhoneNumber.startsWith('0') 
        ? cleanedPhoneNumber 
        : '0' + cleanedPhoneNumber.slice(3);

      const success = await checkAndUpdatePassword(formattedNumber, newPassword);
      if (success) {
        setShowNewPasswordForm(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (showResetCode) {
    return (
      <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full">
        <Logo />
        <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
        
        <h3 className="text-xl font-semibold text-center">Enter Password Reset Code</h3>
        
        <OTPInput onComplete={handleOTPComplete} />

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Enter the code sent to {phoneNumber}
          </p>
          <p className="text-sm text-gray-600 mb-2">Code expires in {formatTime(timeLeft)}s</p>
          {canResend && (
            <button
              onClick={handleResendOTP}
              className="text-blue-600 text-sm hover:underline"
            >
              Resend Code
            </button>
          )}
        </div>

        <button
          onClick={() => handleOTPComplete(currentOTP)}
          disabled={loading}
          className="w-full bg-[#1D9BF0] text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'NEXT'}
        </button>

        {showErrorModal && (
          <ErrorModal
            message={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </div>
    );
  }

  if (showSecurityQuestion) {
    return (
      <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full">
        <Logo />
        <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
        
        <h3 className="text-2xl font-semibold text-center">RESET PASSWORD</h3>

        <h4 className="text-xl font-medium mb-2">Security Question Verification</h4>
        <p className="text-sm">
          Answer the <span className="text-pink-500">security question</span> you selected<br />
          when creating the account
        </p>

        <form onSubmit={handleSecuritySubmit} className="flex flex-col gap-6">
          <div>
            <div className="mb-1">Security Question:</div>
            <div className="font-medium text-sm mb-4">{securityQuestion}</div>
          </div>

          <div>
            <div className="mb-1">Provide Security Answer</div>
            <input
              type="text"
              placeholder="Eg. Answer Is"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D9BF0] text-white rounded py-3 text-sm hover:bg-[#1a8cd8] transition-colors"
          >
            NEXT
          </button>
        </form>

        {showErrorModal && (
          <ErrorModal
            message={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </div>
    );
  }

  if (showNewPasswordForm) {
    return (
      <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full">
        <Logo />
        <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
        
        <h3 className="text-2xl font-semibold text-center">RESET PASSWORD</h3>
        
        <h4 className="text-xl font-medium mb-2">Create New Password</h4>
        <p className="text-sm mb-4">
          Your new password must be different from previous used passwords
        </p>

        <form onSubmit={handleNewPasswordSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Eg. ********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded text-sm pr-16"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF0000] text-xs font-medium"
                onClick={() => setShowPassword(!showPassword)}
              >
                SHOW
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            RESET PASSWORD
          </button>
        </form>

        {showErrorModal && (
          <ErrorModal
            message={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full">
        <Logo />
        <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
        
        <h3 className="text-2xl font-bold text-center">Forgot password?</h3>
        <p className="text-center text-gray-600">Don't worry, happens to the best of us.</p>

        <p className="text-sm">
          Enter the <span className="text-pink-500">phone number</span> used during onboarding to receive a{' '}
          <span className="text-pink-500">Reset Code</span> with further instructions
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="Eg. 0547896588"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-lg text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'SENDING...' : 'SEND RESET CODE'}
          </button>

          <button
            type="button"
            onClick={onReturn}
            className="text-blue-500 text-sm hover:underline text-center"
          >
            Return to sign in
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <SuccessModal
          title="Success"
          message="Password reset successfully"
          onClose={onReturn}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default ForgotPassword; 