import './App.css';
import { useState } from 'react';
import { useTimerEngine } from './hooks/useTimerEngine';
import { APP_STATES } from './reducers/timerReducer';
import { Validator } from './utils/Validator';
import { TimeParser } from './utils/TimeParser';
import { TimeFormatter } from './utils/TimeFormatter';
import TimeDisplay from "./components/TimeDisplay";
import IntentionInput from './components/IntentionInput';
import Controls from "./components/Controls";

function App() {
  const { status, totalSeconds, start, pause, reset } = useTimerEngine();
  const [timerInput, setTimerInput] = useState("45:00"); // The timer value only in the START state when the user is typing
  const [intentionText, setIntentionText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);

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
  };

  // This functions triggers upon the `onBlur` in TimeDisplay; the direct equivalent to the `timeDisplay.addEventListener('blur', () => {` line that altered my brain chemistry in the Vanilla VS version haha
  // So TimeDisplay won't have setTimerInput directly as its onTimerEdit prop anymore, instead..
  function handleTimerEdit(newText) {
    // ..it is called here
    setTimerInput(newText);

    // The text is parsed into primitive integers with the help of our Vanilla JS TimeParser..
    const parsedSeconds = TimeParser.parseToSeconds(newText);

    // ..and if it's above 3600 (an hour), we display the warning message!
    setShowWarning(parsedSeconds > 3600); 
  };

  return (
    <div className='timer-container'>
      <TimeDisplay timerValue={status === APP_STATES.START ? timerInput : TimeFormatter.formatTime(totalSeconds)} onTimerEdit={handleTimerEdit} />
      {/* Now with handleTimerEdit instead of setTimerInput. No changes needed in TimeDisplay! */}
      {/* And now also with a conditional timerValue!! timerInput only when the user is typing, the formatted totalSeconds from the engine once the engine is running! */}
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
        <IntentionInput appStatus={status} intentionValue={intentionText} onIntentionEdit={setIntentionText} />
        {/* For debugging purposes only: intention value is currently {intentionText} */}

      </div>

      <div className='controls-container'>
        {errorMessage && <span className='intention-promp error-display'>{errorMessage}</span>}
        
        {showWarning && (
          <span className='intention-prompt warning-display'>
            It is recommended to keep your focus sessions to 60 minutes or less per session
          </span>
        )}

        <Controls appStatus={status} onStart={handleStart} onPause={pause} onReset={reset} />
        {/* Now with handleStart instead of just start */}
        {/* Tested with `<Controls appStatus={APP_STATES.RUNNING} />`, `<Controls appStatus={APP_STATES.PAUSED} />` */}
      </div>
    </div>
  )
};

export default App;
