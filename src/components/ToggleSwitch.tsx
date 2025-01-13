interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch = ({ isChecked, onChange }: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-center bg-white rounded-full p-1 shadow-lg top-20">
      <button
        className={`relative px-8 py-2 text-sm font-medium transition-all duration-300 ${
          !isChecked ? 'text-white' : 'text-gray-500'
        }`}
        onClick={() => onChange(false)}
      >
        Login
        {!isChecked && (
          <span className="absolute inset-0 bg-black rounded-full -z-10"></span>
        )}
      </button>
      <button
        className={`relative px-8 py-2 text-sm font-medium transition-all duration-300 ${
          isChecked ? 'text-white' : 'text-gray-500'
        }`}
        onClick={() => onChange(true)}
      >
        Signup
        {isChecked && (
          <span className="absolute inset-0 bg-black rounded-full -z-10"></span>
        )}
      </button>
    </div>
  );
};

export default ToggleSwitch; 