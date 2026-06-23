import './App.css';
import { useState } from 'react';
import TimeDisplay from "./components/TimeDisplay";
import IntentionInput from './components/IntentionInput';
import Controls from "./components/Controls";
import { useTimerEngine } from './hooks/useTimerEngine';
import { APP_STATES } from './reducers/timerReducer';

function App() {
  const { status, totalSeconds, start, pause, reset } = useTimerEngine();

  // For our controlled inputs
  const [timerInput, setTimerInput] = useState("45:00");
  const [intentionText, setIntentionText] = useState("");

  return (
    <div className='timer-container'>
      <TimeDisplay timerValue={timerInput} onTimerEdit={setTimerInput} />
      {/* For debugging purposes only: timer value is currently {timerInput} */}

      <div className='intention-container'>
        <label className='intention-prompt'>
          {status === APP_STATES.START
            ? 'What is your intention for these low-distraction focus minutes?'
            : status === APP_STATES.RUNNING || status === APP_STATES.PAUSED
              ? 'Good Luck! 🌱✨'
              : ( 
                // If the code reaches here - if it's not START, not RUNNING and not PAUSED, we can safely say it's END
                <>
                  The minutes have passed.<br />
                  Did you complete the intention you set?<br />
                  Take a few moments to reflect on your estimation ability.<br />
                  It's all feedback for growth and self discovery 🌱
                </>
              )
          }
        </label>
        <IntentionInput />
      </div>

      <div className='controls-container'>
        <Controls />
      </div>
    </div>
  )
}

export default App
