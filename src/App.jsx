import './App.css';
import { useState, useEffect } from 'react';
import { useTimerEngine } from './hooks/useTimerEngine';
import { APP_STATES } from './reducers/timerReducer';
import { Validator } from './utils/Validator';
import { TimeParser } from './utils/TimeParser';
import { TimeFormatter } from './utils/TimeFormatter';
import { StorageManager } from './utils/StorageManager';
import TimeDisplay from "./components/TimeDisplay";
import IntentionInput from './components/IntentionInput';
import Controls from "./components/Controls";
import ConfirmModal from './components/ConfirmModal';

function App() {
  const { status, totalSeconds, start, pause, resume, reset } = useTimerEngine();

  const [timerInput, setTimerInput] = useState(() => {  // The timer value only in the START state when the user is typing
    const saved = StorageManager.load(StorageManager.SECONDS_KEY);
    return saved ? TimeFormatter.formatTime(saved) : "45:00";
  });
  const [intentionText, setIntentionText] = useState(() => {
    return StorageManager.load(StorageManager.INTENTION_KEY) || "";
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Start with validated and parsed seconds! And now also validated intention! Both stored in localStorage upon starting the timer
    start(validationResult.seconds, intentionText);
    setErrorMessage("");
    setShowWarning(false); // If it's true when the timer starts, we don't want it showing then the user is in Focus mode haha, let them focus
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

  // UX improvement: reset the UI when hitting "Reset" or "Set New Intention". Wraps our state setter functions just like the functions above
  function handleTimerReset() {
    reset();
    setTimerInput("45:00");
    setIntentionText("");
    setShowWarning(false); // Just in case
    setIsModalOpen(false); // Close the modal upon successful reset
  }

  // UX improvement: Global shortcuts! 'Enter' to start (when the Intention textarea is not the main active element!), 'Space' to pause/resume
  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      // Guard: We ONLY want global shortcuts if there is currently no active element, i.e. user is currently typing their intention
      if (document.activeElement !== document.body) return;

      // Enter key: Lock In. Only if app state is START
      if (e.key === 'Enter' && status === APP_STATES.START) {
        handleStart();
      }

      // Spacebar key: Pause/Continue. Only if app state is RUNNING/PAUSED
      if (e.code === 'Space') { // No `e.key`, but `e.code`! I've never seen this before. See related PR for the "Why"
        if (status === APP_STATES.RUNNING) {
          pause();
        } else if (status === APP_STATES.PAUSED) {
          resume();
        }
      }
    }

    // Attach the 'keydown' eventListener to window (no element in focus)
    window.addEventListener('keydown', handleGlobalShortcuts);

    // Essential clean-up function
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);

  }, [status, handleStart, pause, resume]); // Run if status changes or if any of the functions we use in the useEffect are re-created with fresh data

  return (
    <>
      {/* The new confirm modal. It listens to the state, and knows exactly what functions to fire */}
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          resume(); // Since opening the modal pauses the timer engine, closing the modal now also needs to have it continue! (for optimal ui, we could let the user land back to the timer and click "Continue" themselves but nah)
        }}
        onConfirm={handleTimerReset}
      />

      <div className='timer-container'>

        <TimeDisplay appStatus={status} timerValue={status === APP_STATES.START ? timerInput : TimeFormatter.formatTime(totalSeconds)} onTimerEdit={handleTimerEdit} />
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
          <IntentionInput appStatus={status} intentionValue={intentionText} onIntentionEdit={setIntentionText} onStart={handleStart} />
          {/* For debugging purposes only: intention value is currently {intentionText} */}

        </div>

        <div className='controls-container'>
          {/* We always render these to hold the physical space, conditionally toggling our .invisible class instead of conditional rendering */}
          <span className={`intention-prompt error-display ${errorMessage ? '' : 'invisible'}`}>
            {errorMessage}
          </span>

          <span className={`intention-prompt warning-display ${showWarning ? '' : 'invisible'}`}>
            It is recommended to keep your focus sessions to 60 minutes or less per session
          </span>

          <Controls
            appStatus={status}
            onStart={handleStart}
            onPause={pause}
            onContinue={resume}
            onReset={() => {
              if (status !== APP_STATES.END) {
                pause(); // Freeze the timer engine before the modal opens!
                setIsModalOpen(true);
              } else {
                handleTimerReset(); // If the app state is END, we don't need a confirmation. Simply reset the timer
              }
            }}
          />
          {/* Now with handleStart instead of just start */}
          {/* And now also with the specific onContinue calling resume rather than onStart doing double duty */}
          {/* And now as a final change also doesn't call handleReset directly onReset but rather opens the modal! */}
          {/* Tested with `<Controls appStatus={APP_STATES.RUNNING} />`, `<Controls appStatus={APP_STATES.PAUSED} />` etc */}
        </div>
      </div>
    </>
  )
};

export default App;
