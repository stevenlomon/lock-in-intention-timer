import { useState, useEffect } from 'react';
import { StorageManager } from "./../utils/StorageManager";
import { AudioEngine } from "./../utils/AudioEngine";

export function useTimerEngine(initialSeconds = 2700) { // Using our default 45 minutes
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isEndScreen, setIsEndScreen] = useState(false);
}
