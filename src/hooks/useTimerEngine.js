import { useState, useEffect, useReducer } from 'react';
import { APP_STATES, timerReducer } from "./../reducers/timerReducer"; 
import { StorageManager } from "./../utils/StorageManager";
import { AudioEngine } from "./../utils/AudioEngine";

export function useTimerEngine(initialSeconds = 2700) { // Using our default 45 minutes
  // const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  // const [isRunning, setIsRunning] = useState(false);
  // const [isEndScreen, setIsEndScreen] = useState(false);
  // These three state variables are now replaced with our new reducer handling the state!
  const [state, dispatch] = useReducer(timerReducer, {
    status: APP_STATES.START,
    totalSeconds: initialSeconds
  });

  // Our "Heartbeat" is now a useEffect!
  useEffect(() => {
    // Guard Clause: if the app is *not* running, do nothing. Return early
    if (state.status !== APP_STATES.RUNNING) return;

    // If we *are* running, start the interval
    const interval = setInterval(() => {

      // The timer logic with Date.now() goes here

    }, 1000); // Run this logic every second that the timer is ticking

    // Cleanup: Function reference to be run automatically by React when the state status changes
    return () => clearInterval(interval);

  }, [state.status]); // Only run this when the state status changes

  // Our start, pause and reset methods, now as functions
  // And now furthermore with our reducer, functions that call dispatch to the reducer! The reducer defines the actions, here's where we define the functions that use the actions
  const start = (validatedSeconds) => {
    // To be implemented
  };

  const pause = () => {
    // To be implemented
  };

  const reset = () => {
    // To be implemented
  };

  // In the Vanilla JS version, we needed to define a haltBrowserAPI method. 
  // Here, React’s lifecycle handles it implicitly via the cleanup function in the useEffect!

  // Return the state and control functions for our components to use
  return {
    status: state.status,
    totalSeconds: state.totalSeconds,
    start,
    pause,
    reset
  }
};