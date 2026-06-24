const IntentionInput = ({ intentionValue, onIntentionEdit }) => {
  return (
    <textarea
      className="intention-input"
      placeholder="e.g., Complete the first 3 test exam exercises"
      autoComplete='off'
      spellCheck={false}
      rows={1}
      value={intentionValue}
      onChange={(e) => onIntentionEdit(e.target.value)}
    />
  )
};

export default IntentionInput;