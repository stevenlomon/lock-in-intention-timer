import './App.css';
import TimeDisplay from "./components/TimeDisplay";
import IntentionInput from './components/IntentionInput';
import Controls from "./components/Controls";
import { useTimerEngine } from './hooks/useTimerEngine';
import { APP_STATES } from './reducers/timerReducer';

function App() {
  const { status } = useTimerEngine();

  return (
    <div className='timer-container'>
      <TimeDisplay />

      <div className='intention-container'>
        <label className='intention-prompt'>
          {status === APP_STATES.START
            ? 'What is your intention for these low-distraction focus minutes?'
            : status === APP_STATES.RUNNING || status === APP_STATES.PAUSED
              ? 'Good Luck! 🌱✨'
              : (
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
