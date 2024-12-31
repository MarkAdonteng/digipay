import Logo from './Logo';

const SignupForm = () => {
  return (
    <div className="p-8 absolute flex flex-col justify-center backface-hidden bg-white rounded-2xl gap-5 shadow-lg w-full rotate-y-180">
      <Logo />
      <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
      <form className="flex flex-col items-center gap-6">
        <div className="w-full">
          <label className="block text-sm mb-2 text-left">Enter your phone number</label>
          <input 
            className="w-full p-3 bg-gray-50 rounded-lg text-sm" 
            type="tel"
            placeholder="e.g. 054 XXX XXXX"
          />
        </div>
        <button 
          className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity"
        >
          PROCEED
        </button>
      </form>
    </div>
  );
};

export default SignupForm; 