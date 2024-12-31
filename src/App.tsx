import { useState } from 'react';
import Background from './components/Background';
import ToggleSwitch from './components/ToggleSwitch';
import CardContainer from './components/CardContainer';

function App() {
  const [isChecked, setIsChecked] = useState(false);
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <Background />

      <div className="relative z-10 bottom-56">
        <div className="relative">
          <ToggleSwitch isChecked={isChecked} onChange={setIsChecked} />
          <CardContainer isChecked={isChecked} />
        </div>
      </div>
    </div>
  );
}

export default App;