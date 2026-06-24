// Our Vanilla JS Validator! Now with `export const` haha!
import { TimeParser } from "./TimeParser"; // And the other difference being that it can't "see" TimeParser anymore since they're all not in one giant monolithic file anymore

// Other than that, the code remains *completely* unchanged! No changes needed! What a feeling!
export const Validator = {
    // At least 5 *letters*!
    validateIntention(intention) {
        const cleanIntention = intention.trim();

        // Extracts all Unicode letters (including å, ä, ö) globally
        const letterMatches = cleanIntention.match(/\p{L}/gu);

        // Check if the array exists and has at least 5 items
        if (!letterMatches || letterMatches.length < 5) {
            return "Please enter a valid intention (at least 5 letters required)";
        }

        return null; // No error
    },

    // Rule: Simply catch "The Zero Case"! Ensure the engine never starts with 0 or negative digits!
    validateDigits(seconds) {
        if (seconds <= 0) {
            return "Timer must be set to at least 1 second.";
        }
        return null;
    },

    // A helper to check both at once; Our "Gatekeepeer"
    validateInput(rawDigits, rawIntention) {
        // 1. Parse the digits
        const parsedSeconds = TimeParser.parseToSeconds(rawDigits);

        // 2. Validate the logic
        const digitsError = this.validateDigits(parsedSeconds);
        if (digitsError) return { isValid: false, error: digitsError };

        const intentionError = this.validateIntention(rawIntention);
        if (intentionError) return { isValid: false, error: intentionError };

        // Step 3: Return the clean, validated data!
        return { isValid: true, seconds: parsedSeconds };
    }
}