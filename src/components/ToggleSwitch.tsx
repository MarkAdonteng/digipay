interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch = ({ isChecked, onChange }: ToggleSwitchProps) => {
  return (
    <label className="relative flex flex-col justify-center items-center gap-8 w-[50px] h-[20px] -translate-y-20 -mb-2 ml-40">
      <input 
        type="checkbox" 
        className="opacity-0 w-0 h-0 peer"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="box-border rounded-md border-2 border-[#FFD600] shadow-[4px_4px_#FFD600] absolute cursor-pointer inset-0 bg-white transition-all duration-300 before:box-border before:absolute before:content-[''] before:h-[20px] before:w-[20px] before:border-2 before:border-[#FFD600] before:rounded-md before:-left-0.5 before:bottom-0.5 before:bg-white before:shadow-[0_3px_0_#FFD600] before:transition-all before:duration-300 peer-checked:before:translate-x-[30px] peer-checked:bg-[#ff7300]" />
      
      <div className="flex justify-between w-[240px] absolute -bottom-6 ml-">
        <span 
          className={`text-[#323232] font-semibold cursor-pointer ${!isChecked ? 'underline' : ''}`} 
          onClick={() => onChange(false)}
        >
          Log in
        </span>
        <span 
          className={`text-[#323232] font-semibold cursor-pointer ${isChecked ? 'underline' : ''}`} 
          onClick={() => onChange(true)}
        >
          Sign up
        </span>
      </div>
    </label>
  );
};

export default ToggleSwitch; 