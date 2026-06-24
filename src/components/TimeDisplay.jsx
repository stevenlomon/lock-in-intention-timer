const TimeDisplay = ({ timerValue, onTimerEdit }) => {
  return (
    <div
      className='time-display'
      contentEditable={true}
      suppressContentEditableWarning={true} // Special React property to signal to React "Hey, I know we're touching the DOM here but I know what I'm doing"
      spellCheck={false}
      // onChange={(e) => onTimerEdit(e.target.value)} This that is ingrained in my muscle memory at this poitn would be valid.. if we had an input! But here we have a div
      // onInput={(e) => onTimerEdit(e.currentTarget.textContent)} This... is technically valid but completely unusable due to the cursor flickering haha
      onBlur={(e) => onTimerEdit(e.currentTarget.textContent)} // And so this is what we end up with! Only update timerInput when the user clicks away (blur) or hits Enter!
    >
      {timerValue ? timerValue : "45:00"}
    </div>
  )
};

export default TimeDisplay;