import { APP_STATES } from "../reducers/timerReducer";

const TimeDisplay = ({ appStatus, timerValue, onTimerEdit }) => {
  return (
    <div
      className='time-display'
      contentEditable={appStatus === APP_STATES.START}
      suppressContentEditableWarning={true} // Special React property to signal to React "Hey, I know we're touching the DOM here but I know what I'm doing"
      spellCheck={false}
      // onChange={(e) => onTimerEdit(e.target.value)} This that is ingrained in my muscle memory at this poitn would be valid.. if we had an input! But here we have a div
      // onInput={(e) => onTimerEdit(e.currentTarget.textContent)} This... is technically valid but completely unusable due to the cursor flickering haha
      onBlur={(e) => onTimerEdit(e.currentTarget.textContent)} // And so this is what we end up with! Only update timerInput when the user clicks away (blur) or hits Enter!

      // Our Vanilla JS "Firewall" equivalent! Everything up to the 'Enter' special case completely unedited!
      onKeyDown={(e) => {
        // We want to still allow "control" keys. Without these, the user wouldn't be able to fix any potentional mistakes
        const isControlKey = [
          'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'
        ].includes(e.key);

        // Allow numeric keys (0-9) using simple Regex
        const isNumber = /^[0-9]$/.test(e.key);

        // We need to allow the colon
        const isColon = e.key === ':';

        // Our rule: If it's NOT a number, NOT a control key, and NOT a colon...
        if (!isNumber && !isControlKey && !isColon) {
          // ...prevent it from even reaching the DOM
          e.preventDefault();
        }

        // Special case: If they hit "Enter", we want to stop editing
        if (e.key === 'Enter') {
          e.preventDefault(); // Stop Enter's default behavior of creating a new line. I didn't even realize this was a problem yesterday!
          e.currentTarget.blur(); // Remove focus from the element
        }
      }}
    >
      {timerValue ? timerValue : "45:00"}
    </div>
  )
};

export default TimeDisplay;