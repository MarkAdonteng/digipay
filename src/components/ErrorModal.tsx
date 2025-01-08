interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal = ({ message, onClose }: ErrorModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-red-200 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-[#FF0000] text-center mb-2">Error</h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#FFD600] text-black rounded-full py-2 px-4 font-medium hover:opacity-90 transition-opacity"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorModal; 