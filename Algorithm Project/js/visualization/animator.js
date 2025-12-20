/**
 * Animation Controller - Handles step-by-step playback of sorting animations
 */
class Animator {
    constructor(renderer) {
        this.renderer = renderer;
        this.steps = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.speed = 1; // 1x speed
        this.stepCallback = null;
        this.completeCallback = null;
    }

    /**
     * Load steps for animation
     * @param {Object[]} steps - Array of step objects
     */
    loadSteps(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.isPlaying = false;
        this.isPaused = false;
    }

    /**
     * Set callback for each step
     * @param {Function} callback - Called with step info on each step
     */
    onStep(callback) {
        this.stepCallback = callback;
    }

    /**
     * Set callback for animation completion
     * @param {Function} callback - Called when animation completes
     */
    onComplete(callback) {
        this.completeCallback = callback;
    }

    /**
     * Set animation speed
     * @param {number} speed - Speed multiplier (0.5, 1, 2, 4)
     */
    setSpeed(speed) {
        this.speed = speed;
        this.renderer.setAnimationSpeed(speed);
    }

    /**
     * Start auto-play animation
     */
    async play() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.isPaused = false;

        while (this.currentStep < this.steps.length && this.isPlaying) {
            if (this.isPaused) {
                await this.wait(100);
                continue;
            }

            await this.executeStep(this.currentStep);
            this.currentStep++;

            await this.wait(Math.round(500 / this.speed));
        }

        if (this.currentStep >= this.steps.length && this.completeCallback) {
            this.completeCallback();
        }

        this.isPlaying = false;
    }

    /**
     * Pause animation
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume animation
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Stop animation
     */
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
    }

    /**
     * Step forward one step
     */
    async stepForward() {
        if (this.currentStep < this.steps.length) {
            await this.executeStep(this.currentStep);
            this.currentStep++;

            if (this.currentStep >= this.steps.length && this.completeCallback) {
                this.completeCallback();
            }
        }
    }

    /**
     * Step backward one step (limited functionality)
     */
    stepBackward() {
        if (this.currentStep > 0) {
            this.currentStep--;
            // Note: Full backward stepping would require storing array states
            // For now, just move the pointer back
        }
    }

    /**
     * Reset to beginning
     */
    reset() {
        this.stop();
        this.currentStep = 0;
        this.renderer.clearAllStates();
    }

    /**
     * Execute a single step
     * @param {number} stepIndex - Index of step to execute
     */
    async executeStep(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step) return;

        // Call step callback if set
        if (this.stepCallback) {
            this.stepCallback(step, stepIndex);
        }

        // Visualize based on step type
        switch (step.type) {
            case 'compare':
                this.renderer.setComparing(step.indices);
                break;

            case 'swap':
                this.renderer.setSwapping(step.indices);
                await this.renderer.animateSwap(step.indices[0], step.indices[1]);
                break;

            case 'sorted':
                this.renderer.setSorted(step.indices);
                break;

            case 'pivot':
                this.renderer.setPivot(step.indices[0]);
                break;

            case 'select':
                this.renderer.setSelected(step.indices);
                break;

            case 'divide':
                // Visual indication of divide (could highlight the range)
                this.renderer.clearAllStates();
                break;

            case 'merge':
                // Visual indication of merge operation
                this.renderer.setComparing(step.indices);
                break;

            case 'insert':
                this.renderer.setSelected(step.indices);
                break;
        }
    }

    /**
     * Jump to specific step
     * @param {number} stepIndex - Target step index
     */
    async jumpToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;

        // Reset visualization and replay up to target
        this.renderer.clearAllStates();

        // Fast-forward through steps without animation
        for (let i = 0; i <= stepIndex; i++) {
            const step = this.steps[i];
            if (step.type === 'sorted') {
                this.renderer.setSorted(step.indices);
            }
        }

        this.currentStep = stepIndex;
        await this.executeStep(stepIndex);
    }

    /**
     * Get current progress
     * @returns {Object} Progress info
     */
    getProgress() {
        return {
            current: this.currentStep,
            total: this.steps.length,
            percent: this.steps.length > 0
                ? Math.round((this.currentStep / this.steps.length) * 100)
                : 0,
            isPlaying: this.isPlaying,
            isPaused: this.isPaused
        };
    }

    /**
     * Utility wait function
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise}
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Animator };
}
