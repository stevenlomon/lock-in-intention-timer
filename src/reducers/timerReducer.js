// My original vanilla JS version made it possible for an invalid state if both `isRunning` and `intentionEndScreen` would somehow both end up at true!
// By using strings we make it mathematically impossible for them to overlap into invalid states
export const APP_STATES = {
  START: 'START',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  END: 'END'
};

export const APP_ACTIONS = {
  START_TIMER: 'START_TIMER',
  TICK: 'TICK',
  PAUSE_TIMER: 'PAUSE_TIMER',
  CONTINUE_TIMER: 'CONTINUE_TIMER',
  FINISH_TIMER: 'FINISH_TIMER',
  RESET_TIMER: 'RESET_TIMER'
};

const initialState = {
  status: APP_STATES.START,
  totalSeconds: 2700, // 45:00
};

// The actual reducer. Strictly dictates how the state is ALLOWED to change
export function timerReducer(state, action) {
  switch (action.type) {
    case 'START_TIMER':
      // Only allow starting if we are currently at START. Not PAUSED anymore, it is handled by the new CONTINUE_TIMER action
      if (state.status === APP_STATES.START) {
        return {
          ...state, // Spread the current state, update keys where needed
          status: APP_STATES.RUNNING, // RUNNING is the new state
          totalSeconds: action.payload !== undefined
            ? action.payload     // If the action includes validated seconds different from the default 2700, use them!
            : state.totalSeconds // Else, use our default
        };
      }
      return state; // If the action is called and it would lead to an invalid state (we're already running or at the end screen), we ignore it

    case 'TICK':
      // Once again: Only allow ticking if we are currently at RUNNING
      if (state.status === APP_STATES.RUNNING) {
        return {
          ...state,
          totalSeconds: action.payload, // Only updates the seconds amount
        };
      }
      return state;

    case 'PAUSE_TIMER':
      // Only allow pausing if we are currently at RUNNING
      if (state.status === APP_STATES.RUNNING) {
        return {
          ...state,
          status: APP_STATES.PAUSED, // Only updates the app states
        };
      }
      return state;

    case 'CONTINUE_TIMER':
      // New action to solve `validatedSeconds` being `undefined` when `start` is called in useTimerEngine upon pressing "Continue"
      // We only allow the timer to contnue if it is currently at PAUSED
      if (state.status === APP_STATES.PAUSED) {
        return {
          ...state,
          status: APP_STATES.RUNNING // Does not touch seconds, simply sets the state back to RUNNING
        };
      }
      return state;

    case 'FINISH_TIMER':
      // We only allow the timer to finish if it is currently at RUNNING too
      if (state.status === APP_STATES.RUNNING) {
        return {
          ...state,
          status: APP_STATES.END, // End state
          totalSeconds: 0         // Seconds is explicitly set to zero
        };
      }
      return state;

    case 'RESET_TIMER':
      // We only allow the timer to reset if is currently at RUNNING, PAUSED or END. You can't reset a timer that hasn't started yet
      if (state.status !== APP_STATES.START) {
        // We simply return the initial state!
        return initialState;
      }
      return state;

    default:
      // If an unknown action is sent, don't crash, just do nothing.
      return state;
  };
};