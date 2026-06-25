import { useRef } from "react";
import { APP_STATES } from "../reducers/timerReducer";

const IntentionInput = ({ appStatus, intentionValue, onIntentionEdit, onStart }) => {
  const textareaRef = useRef(null); // A reference hook to the textarea so that we can "reach through and touch the acual HTML DOM node"

  // Extending our onChange
  const handleChange = (e) => {
    // First; what we already had
    onIntentionEdit(e.target.value); // What we already had

    // Second; the same DOM math from the Vanilla JS version, now using useRef
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset to allow shrinking
      textarea.style.height = `${textarea.scrollHeight}px`; // Expand to fit text
    }
  }

  return (
    <textarea
      ref={textareaRef}
      className="intention-input"
      placeholder="e.g., Complete the first 3 test exam exercises"
      autoComplete='off'
      spellCheck={false}
      rows={1}
      value={intentionValue}
      onChange={handleChange} // Use the expanded function
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