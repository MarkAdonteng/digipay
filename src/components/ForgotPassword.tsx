import { useState, useEffect } from 'react';
import Logo from './Logo';
import OTPInput from './OTPInput';
import { verifyPhoneAndGetSecurityQuestion, verifySecurityAnswer } from '../api/auth';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import Loader from './Loader';

const ForgotPassword = ({ onReturn }: { onReturn: () => void }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetCode, setShowResetCode] = useState(false);
  const [currentOTP, setCurrentOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setEnteredOTP(otp);
    // Don't automatically verify when OTP is entered
    // Let the user click the verify button
  };

  const handleVerifyClick = async (e: React.MouseEvent) => {
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
        const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
        let formattedNumber = cleanedPhoneNumber.startsWith('0') 
          ? cleanedPhoneNumber 
          : '0' + cleanedPhoneNumber.slice(3);

        // Verify phone and get security question
        const question = await verifyPhoneAndGetSecurityQuestion(formattedNumber);
        setShowResetCode(false); // Hide OTP input
        setSecurityQuestion(question);
        setShowSecurityQuestion(true);
      } else {
        setErrorMessage('Invalid verification code');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      let formattedNumber = cleanedPhoneNumber.startsWith('0') 
        ? cleanedPhoneNumber 
        : '0' + cleanedPhoneNumber.slice(3);

      // Validate that security answer is not empty
      if (!securityAnswer.trim()) {
        setErrorMessage('Please enter your security answer');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      const isValid = await verifySecurityAnswer(formattedNumber, securityAnswer);
      
      if (isValid) {
        setShowSecurityQuestion(false);
        setShowNewPasswordForm(true);
      } else {
        setErrorMessage('The security answer you entered is incorrect. Please try again.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Security answer verification error:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Unable to verify your security answer. Please try again.'
      );
      setShowErrorModal(true);
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
    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  if (showResetCode) {
    return (
      <div className="relative">
        <div className="p-modal-padding flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-section-gap shadow-lg w-full relative top-56">
          <Logo />
          <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
          
          <h3 className="text-heading-2 font-semibold text-center">Enter Password Reset Code</h3>
          
          <OTPInput onComplete={(otp) => handleOTPComplete(otp)} />

          <div className="text-center">
            <p className="text-body text-gray-600 mb-2">
              Enter the code sent to {phoneNumber}
            </p>
            <p className="text-body text-gray-600 mb-2">Code expires in {formatTime(timeLeft)}s</p>
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
            onClick={handleVerifyClick}
            disabled={loading}
            className="w-full bg-primary text-white rounded-button py-input-padding text-body hover:bg-primary-hover"
          >
            {loading ? 'Verifying...' : 'NEXT'}
          </button>
        </div>
        {showErrorModal && (
          <div className="fixed inset-0 flex items-start justify-center" style={{ marginTop: '25rem' }}>
            <ErrorModal
              message={errorMessage}
              onClose={() => setShowErrorModal(false)}
            />
          </div>
        )}
      </div>
    );
  }

  if (showSecurityQuestion) {
    return (
      <div className="relative">
        <div className="p-modal-padding flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-section-gap shadow-lg w-full relative top-56">
          <Logo />
          <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
          
          <h3 className="text-heading-2 font-semibold text-center">RESET PASSWORD</h3>

          <h4 className="text-heading-3 font-medium mb-2">Security Question Verification</h4>
          <p className="text-body">
            Answer the <span className="text-accent-pink">security question</span> you selected<br />
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
              className="w-full bg-primary text-white rounded-button py-input-padding text-body hover:bg-primary-hover"
            >
              NEXT
            </button>
          </form>
        </div>
        {showErrorModal && (
          <div className="fixed inset-0 flex items-start justify-center" style={{ marginTop: '25rem' }}>
            <ErrorModal
              message={errorMessage}
              onClose={() => setShowErrorModal(false)}
            />
          </div>
        )}
      </div>
    );
  }

  if (showNewPasswordForm) {
    return (
      <div className="relative">
        <div className="p-modal-padding flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-section-gap shadow-lg w-full relative top-56">
          <Logo />
          <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
          
          <h3 className="text-heading-2 font-semibold text-center">RESET PASSWORD</h3>
          
          <h4 className="text-heading-3 font-medium mb-2">Create New Password</h4>
          <p className="text-body mb-4">
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
              disabled={isSubmitting}
              className="w-full bg-black text-white rounded-button py-input-padding text-body font-medium hover:bg-gray-800 transition-colors"
            >
              RESET PASSWORD
            </button>
          </form>
        </div>
        {showErrorModal && (
          <div className="fixed inset-0 flex items-start justify-center" style={{ marginTop: '25rem' }}>
            <ErrorModal
              message={errorMessage}
              onClose={() => setShowErrorModal(false)}
            />
          </div>
        )}
        {isSubmitting && <Loader />}
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="p-modal-padding flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-section-gap shadow-lg w-full relative top-56">
          <Logo />
          <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
          
          <h3 className="text-heading-2 font-bold text-center">Forgot password?</h3>
          <p className="text-body text-gray-600">Don't worry, happens to the best of us.</p>

          <p className="text-body">
            Enter the <span className="text-accent-pink">phone number</span> used during onboarding to receive a{' '}
            <span className="text-accent-pink">Reset Code</span> with further instructions
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="Eg. 0547896588"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 bg-neutral-input rounded-lg text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-button py-input-padding text-body hover:bg-primary-hover"
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
        {showErrorModal && (
          <div className="fixed inset-0 flex items-start justify-center" style={{ marginTop: '25rem' }}>
            <ErrorModal
              message={errorMessage}
              onClose={() => setShowErrorModal(false)}
            />
          </div>
        )}
      </div>

      {showSuccessModal && (
        <SuccessModal
          title="Success"
          message="Password reset successfully"
          onClose={onReturn}
        />
      )}
    </>
  );
};

export default ForgotPassword; 