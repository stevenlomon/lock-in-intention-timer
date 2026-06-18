import { useState, useEffect } from 'react';
import { StorageManager } from "./../utils/StorageManager";
import { AudioEngine } from "./../utils/AudioEngine";

export function useTimerEngine(initialSeconds = 2700) { // Using our default 45 minutes
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isEndScreen, setIsEndScreen] = useState(false);

  // Our "Heartbeat" is now a useEffect!
  useEffect(() => {
    // Guard Clause: if the app is *not* running, do nothing. Return early
    if (!isRunning) return;

    // If we *are* running, start the interval
    const interval = setInterval(() => {

      // The timer logic with Date.now() goes here

    }, 1000); // Run this logic every second that the timer is ticking

    // Cleanup: Function reference to be run automatically by React when isRunning becomes false
    return () => clearInterval(interval);

  }, [isRunning]); // Only run this when isRunning changes

  // Our start, stop, pause and reset methods, now as functions
  const start = (validatedSeconds) => {
    // To be implemented
  };

  const stop = () => {
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
    totalSeconds,
    isRunning,
    isEndScreen,
    start,
    stop,
    pause,
    reset
  }
};