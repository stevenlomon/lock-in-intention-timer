import { APP_STATES } from "../reducers/timerReducer";

const Controls = ({ appStatus, onStart, onPause, onReset }) => {
  // Rather than having a ternary waterfall like this which.. it works and it's a good instinctive attempt! But it's quite hard to read and look at
  // {appStatus === APP_STATES.START
  //   ? <button className="control-btn">Lock In</button>
  //   : appStatus === APP_STATES.RUNNING
  //     ? <button className="control-btn">Pause</button>
  //     : appStatus === APP_STATES.PAUSED
  //       ? <button className="control-btn">Continue</button>
  //       : <button className="control-btn">Set New Intention</button>}
  //       {/* If it's not START, not RUNNING, and not PAUSED, we can confidently say it's END */}

  // We can have a config object like this where we map the text AND the corresponding action!
  const mainButtonConfig = {
    [APP_STATES.START]: { text: "Lock In", action: onStart },
    [APP_STATES.RUNNING]: { text: "Pause", action: onPause },
    [APP_STATES.PAUSED]: { text: "Continue", action: onStart }, // Resuming calls start() too
    [APP_STATES.END]: { text: "Set New Intention", action: onReset }
  };

  // Extract main button text and action based on the current state indicated by the prop
  const { text, action } = mainButtonConfig[appStatus];

  return (
    <div>
      {/* The Main Button */}
      <button className="control-btn" onClick={action}>
        {text}
      </button>

      {/* The Reset Button */}
      {(appStatus === APP_STATES.RUNNING || appStatus === APP_STATES.PAUSED) && (
        <button className="control-btn" onClick={onReset}>
          Reset
        </button>
      )}
    </div>
  )
};

export default Controls;