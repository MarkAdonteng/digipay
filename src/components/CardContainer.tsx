import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface CardContainerProps {
  isChecked: boolean;
}

const CardContainer = ({ isChecked }: CardContainerProps) => {
  return (
    <div className={`w-[400px] relative bg-transparent perspective-1000 text-center transition-transform duration-800 transform-style-preserve-3d ${isChecked ? 'rotate-y-180' : ''}`}>
      <LoginForm />
      <SignupForm />
    </div>
  );
};

export default CardContainer; 