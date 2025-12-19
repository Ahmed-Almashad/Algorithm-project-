/**
 * Base class for all sorting algorithms
 * Defines the interface and common functionality for step-by-step tracking
 */
class SortingAlgorithm {
    constructor(name, timeComplexity, spaceComplexity) {
        this.name = name;
        this.timeComplexity = timeComplexity;
        this.spaceComplexity = spaceComplexity;
        this.steps = [];
    }

    /**
     * Generate all steps for sorting the given array
     * @param {number[]} array - The array to sort
     * @returns {Step[]} Array of step objects
     */
    generateSteps(array) {
        throw new Error('Must implement generateSteps');
    }

    /**
     * Validate if a user's move is correct at the current step
     * @param {number} stepIndex - Current step index
     * @param {Object} userAction - User's action {type, indices}
     * @returns {boolean} Whether the move is valid
     */
    validateMove(stepIndex, userAction) {
        throw new Error('Must implement validateMove');
    }

    /**
     * Get the expected user action for a given step
     * @param {number} stepIndex - Current step index
     * @returns {Object|null} Expected action or null if no action needed
     */
    getExpectedAction(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step || !step.isUserAction) return null;
        return {
            type: step.type,
            indices: step.indices
        };
    }

    /**
     * Get plain-language explanation of the algorithm
     * @returns {string} Explanation text
     */
    getExplanation() {
        throw new Error('Must implement getExplanation');
    }

    /**
     * Get pseudocode for the algorithm
     * @returns {string} Pseudocode
     */
    getPseudocode() {
        throw new Error('Must implement getPseudocode');
    }

    /**
     * Get a step-by-step example walkthrough
     * @returns {Object[]} Array of example steps
     */
    getExampleWalkthrough() {
        throw new Error('Must implement getExampleWalkthrough');
    }

    /**
     * Create a step object
     * @param {string} type - Step type: 'compare', 'swap', 'divide', 'merge', 'sorted', 'select'
     * @param {number[]} indices - Affected indices
     * @param {number[]} arrayState - Current array state (copy)
     * @param {string} description - Human-readable description
     * @param {boolean} isUserAction - Whether user must perform this action
     * @returns {Object} Step object
     */
    createStep(type, indices, arrayState, description, isUserAction = false) {
        return {
            type,
            indices: [...indices],
            values: indices.map(i => arrayState[i]),
            arrayState: [...arrayState],
            description,
            isUserAction
        };
    }

    /**
     * Get the total number of user actions required
     * @returns {number} Count of steps requiring user action
     */
    getUserActionCount() {
        return this.steps.filter(s => s.isUserAction).length;
    }

    /**
     * Get optimal number of swaps for this algorithm on the generated steps
     * @returns {number} Optimal swap count
     */
    getOptimalSwapCount() {
        return this.steps.filter(s => s.type === 'swap').length;
    }

    /**
     * Reset steps array
     */
    reset() {
        this.steps = [];
    }
}

// Step types enum for consistency
const StepType = {
    COMPARE: 'compare',
    SWAP: 'swap',
    DIVIDE: 'divide',
    MERGE: 'merge',
    SORTED: 'sorted',
    SELECT: 'select',      // For selection sort minimum finding
    INSERT: 'insert',      // For insertion sort
    PIVOT: 'pivot'         // For quick sort pivot selection
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SortingAlgorithm, StepType };
}
