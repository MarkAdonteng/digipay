import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface CardContainerProps {
  isChecked: boolean;
  onSuccessfulSignup: () => void;
}

const CardContainer = ({ isChecked, onSuccessfulSignup }: CardContainerProps) => {
  return (
    <div className="w-[400px] h-[500px] relative">
      <div className={`absolute w-full h-full transition-transform duration-1000 transform-style-preserve-3d ${
        isChecked ? 'rotate-y-180' : ''
      }`}>
        <div className="absolute w-full h-full backface-hidden">
          <LoginForm />
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <SignupForm onSuccessfulSignup={onSuccessfulSignup} />
        </div>
      </div>
    </div>
  );
};

export default CardContainer; 