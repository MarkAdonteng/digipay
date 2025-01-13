// interface TermsAndConditionsProps {
//   onAccept: () => void;
// }

// const TermsAndConditions = ({ onAccept }: TermsAndConditionsProps) => {
//   return (
//     <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
//       <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
//       <div className="prose max-h-96 overflow-y-auto mb-4">
//         {/* Add your terms and conditions content here */}
//         <p>Please read these terms and conditions carefully...</p>
//       </div>
//       <button
//         onClick={onAccept}
//         className="w-full bg-[#854fff] text-white py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200"
//       >
//         Accept Terms & Conditions
//       </button>
//     </div>
//   );
// };

// export default TermsAndConditions; 

import Logo from './Logo';

interface TermsAndConditionsProps {
  onAccept: () => void;
}

const TermsAndConditions = ({ onAccept }: TermsAndConditionsProps) => {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg w-[400px] mt-96">
      <Logo />
      <h2 className="text-center text-sm mb-4">MoMo Merchant/Agent Onboarding Portal</h2>
      
      <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
      
      <div className="text-sm text-gray-700 mb-6 text-left">
        <p className="mb-4">
          You agree to provide your personal information which shall be processed by MML in a secure manner to enable you use this portal. You shall not under any circumstance provide your personal information to any third party in the process of signing up to use this portal.
        </p>
        <p>
          MML shall not be held liable or responsible for any damages or loss sustained by you whether directly or indirectly arising as a result of your failure to adhere to this provision.
        </p>
      </div>

      <button 
        onClick={onAccept}
        className="w-full bg-black text-white rounded-full py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        I ACCEPT
      </button>
    </div>
  );
};

export default TermsAndConditions; 