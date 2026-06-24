// Our Vanilla JS AudioEngine! Nothing changed!
export const AudioEngine = {
    playDing() {
        // Create an AudioContext (The 'Foreign Office' for sound)
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create an oscillator (The sound generator)
        const oscillator = audioCtx.createOscillator();
        
        // Create a gain node (The volume control)
        const gainNode = audioCtx.createGain();

        // Connect the nodes: Oscillator -> Volume -> Speakers
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Configure the sound
        oscillator.type = 'sine'; // A smooth, clean tone
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz = A5 note

        // Configure the volume envelope (Fade out smoothly over 1 second)
        gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime); // Start at full volume
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1); // Fade to near silence

        // Play the sound
        oscillator.start(audioCtx.currentTime);
        // Stop the oscillator after the fade-out is complete
        oscillator.stop(audioCtx.currentTime + 1); 
    }
};