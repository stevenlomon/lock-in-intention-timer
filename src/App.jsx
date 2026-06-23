import './App.css';
import TimeDisplay from "./components/TimeDisplay";
import IntentionInput from './components/IntentionInput';
import Controls from "./components/Controls";

function App() {
  

  return (
    <div className='timer-container'>
      <TimeDisplay />
      <IntentionInput />
      <Controls />
    </div>
  )
}

export default App
