// My original vanilla JS made it possible for an invalid state if both `isRunning` and `intentionEndScreen` are both true!'
// By using strings we make it physically impossible for them to overlap into invalid states
export const APP_STATES = {
  START: 'START',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  END: 'END'
};

const initialState = {
  status: APP_STATES.START,
  totalSeconds: 2700, // 45:00
};

// The actual reducer. Strictly dictates how the state is ALLOWED to change
function timerReducer(state, action) {
  switch (action.type) {
    case 'START_TIMER':
      // Only allow starting if we are currently at START or PAUSED
      if (state.status === APP_STATES.START || state.stauts === APP_STATES.PAUSED) {
        return {
          ...state, // Spread the current state, update keys where needed
          status: APP_STATES.RUNNING, // RUNNING is the new state
          totalSeconds: action.payload !== undefined
            ? action.payload      // If the action includes validated seconds different from the default 2700, use them!
            : state.totalSeconds  // Else, use our default
        };
      }
      return state; // If the action is called and it would lead to an invalid state (we're already running or at the end screen), we ignore it

    default:
      // If an unknown action is sent, don't crash, just do nothing.
      return state;
  }
}