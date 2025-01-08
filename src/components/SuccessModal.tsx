interface SuccessModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const SuccessModal = ({ title, message, onClose }: SuccessModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
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
        <h3 className="text-heading-2 text-primary mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-secondary text-black rounded-full py-2 px-4 font-medium hover:opacity-90 transition-opacity"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal; 