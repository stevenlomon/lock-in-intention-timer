import { APP_STATES } from "../reducers/timerReducer";

const IntentionInput = ({ appStatus, intentionValue, onIntentionEdit, onStart }) => {
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

      // Prevent 'Enter' from creating a newline and instead have it start the timer! (if valid intention input)
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the default of creating a newline
          e.currentTarget.blur(); // Remove focus, good for mobile so that the keyboard disappears
          onStart(); // Start the timer!
        }
      }}
    />
  )
};

export default IntentionInput;