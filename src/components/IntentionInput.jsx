import { APP_STATES } from "../reducers/timerReducer";

const IntentionInput = ({ appStatus, intentionValue, onIntentionEdit }) => {
  return (
    <textarea
      className="intention-input"
      placeholder="e.g., Complete the first 3 test exam exercises"
      autoComplete='off'
      spellCheck={false}
      rows={1}
      value={intentionValue}
      onChange={(e) => onIntentionEdit(e.target.value)}
      disabled={appStatus === APP_STATES.START ? false : true}
    />
  )
};

export default IntentionInput;