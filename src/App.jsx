import './App.css';
import { useState } from 'react';
import { useTimerEngine } from './hooks/useTimerEngine';
import { APP_STATES } from './reducers/timerReducer';
import { Validator } from './utils/Validator';
import TimeDisplay from "./components/TimeDisplay";
import IntentionInput from './components/IntentionInput';
import Controls from "./components/Controls";

function App() {
  const { status, totalSeconds, start, pause, reset } = useTimerEngine();
  const [timerInput, setTimerInput] = useState("45:00");
  const [intentionText, setIntentionText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // The `start` function from useTimerEngine expects validated seconds, it doesn't do the validation anymore like in the Vanilla JS version!
  function handleStart() {
    // If we are resuming from PAUSED, we don't need to re-validate. 
    // We just tell the engine to start with the remaining seconds.
    if (status === APP_STATES.PAUSED) {
      start(); // Our reducer handles this if payload is undefined!
      return;
    }

    const validationResult = Validator.validateInput(timerInput, intentionText);

    if (!validationResult.isValid) {
      // If the validation result is not valid, we update the error state and return early
      setErrorMessage(validationResult.error);
      return;
    }

    // Start with validated seconds!
    start(validationResult.seconds);
    setErrorMessage("");
  }

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
        <IntentionInput intentionValue={intentionText} onIntentionEdit={setIntentionText} />
        {/* For debugging purposes only: intention value is currently {intentionText} */}

      </div>

      <div className='controls-container'>
        {errorMessage && <span className='error-display'>{errorMessage}</span>}
        <Controls appStatus={status} onStart={handleStart} onPause={pause} onReset={reset} />
        {/* Now with handleStart instead of just start */}
        {/* Tested with `<Controls appStatus={APP_STATES.RUNNING} />`, `<Controls appStatus={APP_STATES.PAUSED} />` */}
      </div>
    </div>
  )
}

export default App
