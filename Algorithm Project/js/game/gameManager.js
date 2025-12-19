/**
 * Game Manager - Central state management for the sorting game
 * Handles game flow, difficulty, scoring, and statistics
 */
class GameManager {
    constructor() {
        this.algorithms = {
            bubble: new BubbleSort(),
            selection: new SelectionSort(),
            insertion: new InsertionSort(),
            merge: new MergeSort(),
            quick: new QuickSort(),
            heap: new HeapSort()
        };

        this.difficulties = {
            easy: { size: 5, name: 'Easy', bonus: 1.0 },
            medium: { size: 8, name: 'Medium', bonus: 1.5 },
            hard: { size: 12, name: 'Hard', bonus: 2.0 },
            expert: { size: 16, name: 'Expert', bonus: 3.0 }
        };

        this.inputTypes = {
            random: 'Random',
            reversed: 'Reverse Sorted',
            nearlySorted: 'Nearly Sorted',
            duplicates: 'With Duplicates'
        };

        this.reset();
    }

    /**
     * Reset game state
     */
    reset() {
        this.currentAlgorithm = null;
        this.currentArray = [];
        this.originalArray = [];
        this.steps = [];
        this.currentStepIndex = 0;
        this.userStepIndex = 0;
        this.score = 0;
        this.correctMoves = 0;
        this.incorrectMoves = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.startTime = null;
        this.endTime = null;
        this.difficulty = 'easy';
        this.inputType = 'random';
        this.isGameActive = false;
        this.isGameComplete = false;
    }

    /**
     * Generate an array based on difficulty and input type
     * @param {string} difficulty - easy, medium, hard, expert
     * @param {string} inputType - random, reversed, nearlySorted, duplicates
     * @returns {number[]} Generated array
     */
    generateArray(difficulty = 'easy', inputType = 'random') {
        const size = this.difficulties[difficulty].size;
        let arr = [];
        const maxValue = size * 10;

        switch (inputType) {
            case 'reversed':
                // Reverse sorted array
                for (let i = size; i > 0; i--) {
                    arr.push(i * 10);
                }
                break;

            case 'nearlySorted':
                // Nearly sorted - only a few elements out of place
                for (let i = 1; i <= size; i++) {
                    arr.push(i * 10);
                }
                // Swap a few random pairs
                const swapCount = Math.max(1, Math.floor(size / 4));
                for (let i = 0; i < swapCount; i++) {
                    const idx1 = Math.floor(Math.random() * size);
                    const idx2 = Math.floor(Math.random() * size);
                    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
                }
                break;

            case 'duplicates':
                // Array with duplicate values
                const uniqueValues = Math.ceil(size / 2);
                const values = [];
                for (let i = 0; i < uniqueValues; i++) {
                    values.push((i + 1) * 10);
                }
                for (let i = 0; i < size; i++) {
                    arr.push(values[Math.floor(Math.random() * uniqueValues)]);
                }
                // Shuffle
                arr = this.shuffleArray(arr);
                break;

            case 'random':
            default:
                // Random unique values
                const allValues = [];
                for (let i = 1; i <= maxValue; i++) {
                    allValues.push(i);
                }
                // Fisher-Yates shuffle and take first 'size' elements
                for (let i = allValues.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
                }
                arr = allValues.slice(0, size);
                break;
        }

        return arr;
    }

    /**
     * Shuffle array using Fisher-Yates
     * @param {any[]} arr - Array to shuffle
     * @returns {any[]} Shuffled array
     */
    shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Start a new game
     * @param {string} algorithmKey - Algorithm identifier
     * @param {string} difficulty - Difficulty level
     * @param {string} inputType - Input array type
     */
    startGame(algorithmKey, difficulty = 'easy', inputType = 'random') {
        this.reset();

        this.currentAlgorithm = this.algorithms[algorithmKey];
        this.difficulty = difficulty;
        this.inputType = inputType;

        // Generate array
        this.originalArray = this.generateArray(difficulty, inputType);
        this.currentArray = [...this.originalArray];

        // Generate algorithm steps
        this.steps = this.currentAlgorithm.generateSteps([...this.originalArray]);

        // Find first user action step
        this.currentStepIndex = 0;
        this.advanceToNextUserAction();

        this.startTime = Date.now();
        this.isGameActive = true;
        this.isGameComplete = false;

        return {
            array: [...this.currentArray],
            algorithm: this.currentAlgorithm.name,
            difficulty: this.difficulties[difficulty].name,
            totalSteps: this.steps.length,
            userActionsRequired: this.currentAlgorithm.getUserActionCount()
        };
    }

    /**
     * Advance to the next step that requires user action
     */
    advanceToNextUserAction() {
        while (this.currentStepIndex < this.steps.length) {
            const step = this.steps[this.currentStepIndex];
            if (step.isUserAction) {
                break;
            }
            // Update array state for non-user steps
            this.currentArray = [...step.arrayState];
            this.currentStepIndex++;
        }
    }

    /**
     * Get current game state
     * @returns {Object} Current state
     */
    getCurrentState() {
        if (!this.isGameActive) {
            return { active: false };
        }

        const currentStep = this.steps[this.currentStepIndex];

        return {
            active: true,
            array: [...this.currentArray],
            stepIndex: this.currentStepIndex,
            totalSteps: this.steps.length,
            currentStep: currentStep ? {
                type: currentStep.type,
                indices: currentStep.indices,
                description: currentStep.description,
                isUserAction: currentStep.isUserAction
            } : null,
            score: this.score,
            correctMoves: this.correctMoves,
            incorrectMoves: this.incorrectMoves,
            streak: this.streak,
            elapsedTime: this.startTime ? Date.now() - this.startTime : 0,
            isComplete: this.isGameComplete
        };
    }

    /**
     * Process user's move
     * @param {Object} userAction - {type: 'swap'|'select', indices: [i, j] or value: number}
     * @returns {Object} Result of the move
     */
    processMove(userAction) {
        if (!this.isGameActive || this.isGameComplete) {
            return { success: false, message: 'Game is not active' };
        }

        const currentStep = this.steps[this.currentStepIndex];

        if (!currentStep || !currentStep.isUserAction) {
            return { success: false, message: 'No user action expected' };
        }

        // Validate the move
        const validation = this.currentAlgorithm.validateMove(this.currentStepIndex, userAction);

        if (validation.valid) {
            // Correct move
            this.correctMoves++;
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);

            // Calculate score
            const baseScore = 100;
            const streakBonus = this.streak >= 5 ? 50 : 0;
            const difficultyMultiplier = this.difficulties[this.difficulty].bonus;

            const points = Math.round((baseScore + streakBonus) * difficultyMultiplier);
            this.score += points;

            // Apply the action to array
            if (userAction.type === 'swap') {
                const [i, j] = userAction.indices;
                [this.currentArray[i], this.currentArray[j]] =
                    [this.currentArray[j], this.currentArray[i]];
            }

            // Move to next step
            this.currentStepIndex++;
            this.advanceToNextUserAction();

            // Check if game is complete
            if (this.currentStepIndex >= this.steps.length) {
                this.completeGame();
            }

            return {
                success: true,
                valid: true,
                message: validation.message,
                points: points,
                streak: this.streak,
                score: this.score,
                isComplete: this.isGameComplete
            };
        } else {
            // Incorrect move
            this.incorrectMoves++;
            this.streak = 0;

            const penalty = 50;
            this.score = Math.max(0, this.score - penalty);

            return {
                success: true,
                valid: false,
                message: validation.message,
                points: -penalty,
                streak: 0,
                score: this.score,
                hint: this.getHint()
            };
        }
    }

    /**
     * Get a hint for the current step
     * @returns {string} Hint text
     */
    getHint() {
        const currentStep = this.steps[this.currentStepIndex];
        if (!currentStep) return 'No hint available';

        const algorithmName = this.currentAlgorithm.name;

        switch (currentStep.type) {
            case 'swap':
                return `Look for elements at positions ${currentStep.indices.join(' and ')}. ${currentStep.description}`;
            case 'select':
                return `Select the correct element. ${currentStep.description}`;
            default:
                return currentStep.description;
        }
    }

    /**
     * Complete the game and calculate final score
     */
    completeGame() {
        this.endTime = Date.now();
        this.isGameActive = false;
        this.isGameComplete = true;

        // Time bonus - faster completion = more points
        const timeTaken = (this.endTime - this.startTime) / 1000; // seconds
        const optimalTime = this.steps.length * 2; // 2 seconds per step as baseline

        if (timeTaken < optimalTime) {
            const timeBonus = Math.round(200 * (1 - timeTaken / optimalTime));
            this.score += timeBonus;
        }

        // Accuracy bonus
        const accuracy = this.correctMoves / (this.correctMoves + this.incorrectMoves);
        if (accuracy === 1) {
            this.score += 150; // Perfect game bonus
        } else if (accuracy >= 0.9) {
            this.score += 100;
        }
    }

    /**
     * Get final results
     * @returns {Object} Game results
     */
    getResults() {
        if (!this.isGameComplete) {
            return null;
        }

        const timeTaken = (this.endTime - this.startTime) / 1000;
        const optimalSwaps = this.currentAlgorithm.getOptimalSwapCount();
        const totalMoves = this.correctMoves + this.incorrectMoves;
        const accuracy = totalMoves > 0 ? (this.correctMoves / totalMoves) * 100 : 0;

        return {
            algorithm: this.currentAlgorithm.name,
            difficulty: this.difficulties[this.difficulty].name,
            inputType: this.inputTypes[this.inputType],
            arraySize: this.originalArray.length,
            originalArray: [...this.originalArray],
            finalScore: this.score,
            correctMoves: this.correctMoves,
            incorrectMoves: this.incorrectMoves,
            totalMoves: totalMoves,
            optimalSwaps: optimalSwaps,
            efficiency: optimalSwaps > 0 ? Math.round((optimalSwaps / this.correctMoves) * 100) : 100,
            accuracy: Math.round(accuracy),
            timeTaken: Math.round(timeTaken * 10) / 10,
            maxStreak: this.maxStreak,
            timeComplexity: this.currentAlgorithm.timeComplexity,
            spaceComplexity: this.currentAlgorithm.spaceComplexity
        };
    }

    /**
     * Skip current step (for demo/practice mode)
     * @returns {Object} Result
     */
    skipStep() {
        if (!this.isGameActive || this.isGameComplete) {
            return { success: false };
        }

        const currentStep = this.steps[this.currentStepIndex];
        if (currentStep && currentStep.isUserAction) {
            // Apply the correct action automatically
            if (currentStep.type === 'swap') {
                const [i, j] = currentStep.indices;
                [this.currentArray[i], this.currentArray[j]] =
                    [this.currentArray[j], this.currentArray[i]];
            }
            this.currentArray = [...currentStep.arrayState];
        }

        this.currentStepIndex++;
        this.advanceToNextUserAction();

        if (this.currentStepIndex >= this.steps.length) {
            this.completeGame();
        }

        return { success: true, skipped: true };
    }

    /**
     * Get algorithm info for selection screen
     * @returns {Object[]} Algorithm information
     */
    getAlgorithmInfo() {
        return Object.entries(this.algorithms).map(([key, algo]) => ({
            key,
            name: algo.name,
            timeComplexity: algo.timeComplexity,
            spaceComplexity: algo.spaceComplexity
        }));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameManager };
}
