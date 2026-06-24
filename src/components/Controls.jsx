import { APP_STATES } from "../reducers/timerReducer"

const Controls = ({ appStatus }) => {
  return (
    <div>
      {appStatus === APP_STATES.START
        ? <button className="control-btn">Lock In</button>
        : appStatus === APP_STATES.RUNNING
          ? <button className="control-btn">Pause</button>
          : appStatus === APP_STATES.PAUSED
            ? <button className="control-btn">Continue</button>
            : <button className="control-btn">Set New Intention</button>}
            {/* If it's not START, not RUNNING, and not PAUSED, we can confidently say it's END */}
      {(appStatus === APP_STATES.RUNNING || appStatus === APP_STATES.PAUSED) && <button className="control-btn">Reset</button>}
    </div>
  )
}

export default Controls