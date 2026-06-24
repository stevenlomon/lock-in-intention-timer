// Our Vanilla JS StorageManager! Nothing changed!
export const StorageManager = {
    // UPDATE: One localStorage key for the seconds, one for the intention
    SECONDS_KEY: "focus_timer_seconds",
    INTENTION_KEY: "focus_timer_intention",

    // Generic DRY methods
    save(key, value) {
        // Values must be strings in localStorage
        localStorage.setItem(key, String(value));
    },

    load(key) {
        return localStorage.getItem(key);
    },

    clear(key) {
        localStorage.removeItem(key);
    },

    // A pragmatic helper to wipe the whole session at once
    clearSession() {
        this.clear(this.SECONDS_KEY);
        this.clear(this.INTENTION_KEY);
    }
};