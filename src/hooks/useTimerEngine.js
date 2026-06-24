import { useState, useEffect, useReducer, useRef } from 'react';
import { APP_STATES, APP_ACTIONS, timerReducer } from "./../reducers/timerReducer";
import { StorageManager } from "./../utils/StorageManager";
import { AudioEngine } from "./../utils/AudioEngine";

export function useTimerEngine(initialSeconds = 2700) { // Using our default 45 minutes
  // const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  // const [isRunning, setIsRunning] = useState(false);
  // const [isEndScreen, setIsEndScreen] = useState(false);
  // These three state variables are now replaced with our new reducer handling the state!
  const [state, dispatch] = useReducer(timerReducer,
    // For the initial state, first check localStorage for a stored intention and seconds!
    StorageManager.load(StorageManager.INTENTION_KEY) && StorageManager.load(StorageManager.SECONDS_KEY)
      ? {
        status: APP_STATES.PAUSED,
        totalSeconds: parseInt(StorageManager.load(StorageManager.SECONDS_KEY)) // Important, don't forget to parse from string to int
      } : {
        status: APP_STATES.START,
        totalSeconds: initialSeconds
      });

  const endTimeRef = useRef(null); // Will be refered to both in the useEffect and the start function so it's used to solve a scope issue here

  // Our "Heartbeat" is now a useEffect!
  useEffect(() => {
    // Guard Clause: if the app is *not* running, do nothing. Return early
    if (state.status !== APP_STATES.RUNNING) return;

    // If we *are* running, start the interval
    const interval = setInterval(() => {

      // Every single second that the timer ticks down...
      // `const msRemaining = StateBuffer.endTime - Date.now();` becomes...
      const msRemaining = endTimeRef.current - Date.now();

      // `StateBuffer.totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000));` becomes...
      const newSeconds = Math.max(0, Math.ceil(msRemaining / 1000));
      dispatch({ type: APP_ACTIONS.TICK, payload: newSeconds }); // We're not allowed to mutate state like `state.totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000));` in React! *In React, state is strictly immutable* State is updated only via state setters, which is dispatch in this scenario

      StorageManager.save(StorageManager.SECONDS_KEY, newSeconds); // Not `state.totalSeconds`, that's a stale value due to closure! newSeconds

      // Our stop condition `if (StateBuffer.totalSeconds <= 0) {` translated!
      if (newSeconds <= 0) { // We can't use state.totalSeconds here due to JavaScript closures! It's a "stale" value
        dispatch({ type: APP_ACTIONS.FINISH_TIMER }); // Replaces 5 lines of code haha!

        StorageManager.clearSession();
        AudioEngine.playDing(); // Stays exactly the same!
      }
    }, 1000); // Run this logic every second that the timer is ticking

    // Cleanup: Function reference to be run automatically by React when the state status changes
    return () => clearInterval(interval);

  }, [state.status]); // Only run this when the state status changes

  // Our start, pause and reset methods, now as functions
  // And now furthermore with our reducer, functions that call dispatch to the reducer! The reducer defines the actions, here's where we define the functions that use the actions
  const start = (validatedSeconds, validatedIntention) => {
    // The translation of this line of code from the Vanilla JS version `StateBuffer.endTime = Date.now() + (StateBuffer.totalSeconds * 1000);` becomes...
    endTimeRef.current = Date.now() + validatedSeconds * 1000; // Absolute end time in milliseconds. With our new CONTINUE_TIMER action, validatedSeconds is never undefined here anymore causing NaN cascades

    dispatch({ type: APP_ACTIONS.START_TIMER, payload: validatedSeconds });
    StorageManager.save(StorageManager.SECONDS_KEY, validatedSeconds);
    StorageManager.save(StorageManager.INTENTION_KEY, validatedIntention);
  };

  const pause = () => {
    dispatch({ type: APP_ACTIONS.PAUSE_TIMER });
  };

  // The new function linked to our new reducer action
  const resume = () => { // `continue` is a reserved keyword in JavaScript haha
    // Push the absolute end time further into the future based on the frozen seconds! I.. completely missed this. Not including this causes a new bug where the timer seemingly continues to tick even in a PAUSED state. This line is the final puzzle piece to get it working just as intended
    endTimeRef.current = Date.now() + (state.totalSeconds * 1000);

    dispatch({ type: APP_ACTIONS.CONTINUE_TIMER });
  };

  const reset = () => {
    dispatch({ type: APP_ACTIONS.RESET_TIMER });
    StorageManager.clearSession(); // Reset the timer and clear localStorage!
  };

  // In the Vanilla JS version, we needed to define a haltBrowserAPI method. 
  // Here, React’s lifecycle handles it implicitly via the cleanup function in the useEffect!

  // Return the state and control functions for our components to use
  return {
    status: state.status,
    totalSeconds: state.totalSeconds,
    start,
    pause,
    resume,
    reset
  }
};