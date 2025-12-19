/**
 * Main Application Controller
 * Orchestrates all modules and handles screen navigation
 */
class App {
    constructor() {
        this.gameManager = new GameManager();
        this.scoringSystem = new ScoringSystem();
        this.renderer = null;
        this.demoRenderer = null;
        this.animator = null;

        this.currentScreen = 'selection';
        this.selectedAlgorithm = null;
        this.selectedDifficulty = 'easy';
        this.selectedInputType = 'random';
        this.selectedBars = [];

        this.timerInterval = null;
        this.isDemoPlaying = false;

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.renderAlgorithmCards();
        this.setupEventListeners();
        this.showScreen('selection');
    }

    /**
     * Render algorithm selection cards
     */
    renderAlgorithmCards() {
        const grid = document.getElementById('algorithm-grid');
        const algorithms = this.gameManager.getAlgorithmInfo();

        grid.innerHTML = algorithms.map(algo => `
            <div class="card card-clickable algorithm-card" data-algorithm="${algo.key}">
                <h3>${algo.name}</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">
                    ${this.getAlgorithmShortDescription(algo.key)}
                </p>
                <div class="complexity">
                    <span class="complexity-tag">
                        <span class="label">Time:</span> ${algo.timeComplexity.average}
                    </span>
                    <span class="complexity-tag">
                        <span class="label">Space:</span> ${algo.spaceComplexity}
                    </span>
                </div>
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.algorithm-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectAlgorithm(card.dataset.algorithm);
            });
        });
    }

    /**
     * Get short description for algorithm
     * @param {string} key - Algorithm key
     * @returns {string} Short description
     */
    getAlgorithmShortDescription(key) {
        const descriptions = {
            bubble: 'Repeatedly swap adjacent elements if they are in the wrong order.',
            selection: 'Find the minimum element and place it at the beginning.',
            insertion: 'Build the sorted array one element at a time.',
            merge: 'Divide, conquer, and merge - a classic divide-and-conquer approach.',
            quick: 'Partition around a pivot and recursively sort subarrays.',
            heap: 'Use a binary heap to efficiently find and extract the maximum element.'
        };
        return descriptions[key] || '';
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Difficulty selector
        document.querySelectorAll('#difficulty-selector .difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#difficulty-selector .difficulty-btn')
                    .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDifficulty = btn.dataset.difficulty;
            });
        });

        // Input type selector
        document.querySelectorAll('#input-type-selector .difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#input-type-selector .difficulty-btn')
                    .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedInputType = btn.dataset.input;
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen === 'game') {
                if (e.key === 'Escape') {
                    this.confirmExit();
                } else if (e.key === 'h' || e.key === 'H') {
                    this.showHint();
                } else if (e.key === 's' || e.key === 'S') {
                    this.skipStep();
                }
            }
        });
    }

    /**
     * Show a specific screen
     * @param {string} screenId - Screen ID
     */
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(`screen-${screenId}`).classList.add('active');
        this.currentScreen = screenId;
    }

    /**
     * Select an algorithm
     * @param {string} algorithmKey - Algorithm key
     */
    selectAlgorithm(algorithmKey) {
        this.selectedAlgorithm = algorithmKey;
        const algorithm = this.gameManager.algorithms[algorithmKey];

        // Update explanation screen
        document.getElementById('explanation-title').textContent = algorithm.name;
        document.getElementById('explanation-text').innerHTML =
            markdownToHtml(algorithm.getExplanation());
        document.getElementById('pseudocode').innerHTML =
            highlightPseudocode(algorithm.getPseudocode());

        // Render example walkthrough
        this.renderExampleWalkthrough(algorithm.getExampleWalkthrough());

        // Toggle game/tool options
        const gameOptions = document.getElementById('game-options');
        const toolOptions = document.getElementById('tool-options');
        const difficultyTitle = document.querySelector('#screen-explanation h3:nth-of-type(1)');
        const difficultySelector = document.getElementById('difficulty-selector');
        const inputTypeTitle = document.querySelector('#screen-explanation h3:nth-of-type(2)');
        const inputTypeSelector = document.getElementById('input-type-selector');

        if (algorithmKey === 'merge') {
            gameOptions.classList.add('hidden');
            toolOptions.classList.remove('hidden');
            // Hide game configuration for merge sort tool
            if (difficultyTitle) difficultyTitle.style.display = 'none';
            if (difficultySelector) difficultySelector.style.display = 'none';
            if (inputTypeTitle) inputTypeTitle.style.display = 'none';
            if (inputTypeSelector) inputTypeSelector.style.display = 'none';
        } else {
            gameOptions.classList.remove('hidden');
            toolOptions.classList.add('hidden');
            if (difficultyTitle) difficultyTitle.style.display = 'block';
            if (difficultySelector) difficultySelector.style.display = 'flex';
            if (inputTypeTitle) inputTypeTitle.style.display = 'block';
            if (inputTypeSelector) inputTypeSelector.style.display = 'flex';
        }

        this.showScreen('explanation');
    }

    /**
     * Render example walkthrough
     * @param {Object[]} steps - Walkthrough steps
     */
    renderExampleWalkthrough(steps) {
        const container = document.getElementById('example-walkthrough');
        const maxValue = Math.max(...steps[0].array);

        container.innerHTML = steps.slice(0, 6).map((step, idx) => `
            <div class="example-step">
                <div class="mini-bars">
                    ${step.array.map((val, i) => {
            const height = (val / maxValue) * 40;
            let className = 'mini-bar';
            if (step.highlight && step.highlight.includes(i)) className += ' highlight';
            if (step.sorted && step.sorted.includes(i)) className += ' sorted';
            return `<div class="${className}" style="height: ${height}px"></div>`;
        }).join('')}
                </div>
                <span class="action-text">${step.action}</span>
            </div>
        `).join('');
    }

    /**
     * Start the game
     */
    startGame() {
        if (!this.selectedAlgorithm) {
            this.showToast('Please select an algorithm first', 'error');
            return;
        }

        // Start game in game manager
        const gameInfo = this.gameManager.startGame(
            this.selectedAlgorithm,
            this.selectedDifficulty,
            this.selectedInputType
        );

        // Initialize renderer
        this.renderer = new Renderer('bars-container');
        this.renderer.init(gameInfo.array);

        // Setup bar selection
        document.getElementById('bars-container').addEventListener('barSelected', (e) => {
            this.handleBarSelection(e.detail.index);
        });

        // Reset selected bars
        this.selectedBars = [];

        // Update UI
        this.updateGameUI();

        // Start timer
        this.startTimer();

        this.showScreen('game');
    }

    /**
     * Handle bar selection during game
     * @param {number} index - Selected bar index
     */
    handleBarSelection(index) {
        const state = this.gameManager.getCurrentState();
        if (!state.active || state.isComplete) return;

        // Check if bar is already selected
        const existingIndex = this.selectedBars.indexOf(index);
        if (existingIndex !== -1) {
            // Deselect
            this.selectedBars.splice(existingIndex, 1);
        } else {
            // Select
            this.selectedBars.push(index);
        }

        // Update visual selection
        this.renderer.setSelected(this.selectedBars);

        // If two bars selected, attempt swap
        if (this.selectedBars.length === 2) {
            this.attemptSwap(this.selectedBars[0], this.selectedBars[1]);
            this.selectedBars = [];
        }
    }

    /**
     * Attempt a swap between two indices
     * @param {number} i - First index
     * @param {number} j - Second index
     */
    async attemptSwap(i, j) {
        const result = this.gameManager.processMove({
            type: 'swap',
            indices: [i, j]
        });

        if (result.valid) {
            // Animate the swap
            await this.renderer.animateSwap(i, j);
            this.showToast(`+${result.points} points! ${result.message}`, 'success');

            // Update sorted state
            this.updateSortedBars();
        } else {
            // Show error
            await this.renderer.flashError([i, j]);
            this.showToast(result.message, 'error');
        }

        // Clear selection
        this.renderer.setSelected([]);

        // Update UI
        this.updateGameUI();

        // Check if game complete
        if (result.isComplete) {
            this.endGame();
        }
    }

    /**
     * Update sorted bar states
     */
    updateSortedBars() {
        const state = this.gameManager.getCurrentState();
        if (!state.currentStep) return;

        // Find all sorted steps up to current
        const sortedIndices = [];
        for (let i = 0; i <= state.stepIndex; i++) {
            const step = this.gameManager.steps[i];
            if (step && step.type === 'sorted') {
                sortedIndices.push(...step.indices);
            }
        }

        this.renderer.setSorted([...new Set(sortedIndices)]);
    }

    /**
     * Update game UI elements
     */
    updateGameUI() {
        const state = this.gameManager.getCurrentState();

        // Update score display
        document.getElementById('score-value').textContent = state.score;
        document.getElementById('streak-value').textContent = state.streak;
        document.getElementById('correct-value').textContent = state.correctMoves;
        document.getElementById('incorrect-value').textContent = state.incorrectMoves;

        // Update progress
        const progress = (state.stepIndex / state.totalSteps) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;

        // Update step info
        if (state.currentStep) {
            document.getElementById('step-type').textContent =
                state.currentStep.type.toUpperCase();
            document.getElementById('step-description').textContent =
                state.currentStep.description;
            document.getElementById('step-hint').textContent =
                `Step ${state.stepIndex + 1} of ${state.totalSteps}`;
        } else {
            document.getElementById('step-type').textContent = 'COMPLETE';
            document.getElementById('step-description').textContent =
                'Array is sorted!';
            document.getElementById('step-hint').textContent = '';
        }
    }

    /**
     * Start game timer
     */
    startTimer() {
        const timerEl = document.getElementById('timer-value');
        const startTime = Date.now();

        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            timerEl.textContent = formatTime(elapsed);
        }, 100);
    }

    /**
     * Stop game timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * End the game
     */
    endGame() {
        this.stopTimer();

        // Get results
        const results = this.gameManager.getResults();
        if (!results) return;

        // Update stats
        const stats = storage.updateStats(results);

        // Check achievements
        const earnedAchievements = storage.getAchievements();
        const newAchievements = this.scoringSystem.checkAchievements(
            { ...stats, algorithmsUsed: new Set(stats.algorithmsUsed) },
            earnedAchievements
        );

        if (newAchievements.length > 0) {
            storage.addAchievements(newAchievements.map(a => a.id));
            // Show achievement notification
            newAchievements.forEach(achievement => {
                this.showToast(`🏆 Achievement Unlocked: ${achievement.name}`, 'success');
            });
        }

        // Get grade
        const grade = this.scoringSystem.calculateGrade(results.finalScore, this.selectedDifficulty);

        // Update results screen
        document.getElementById('grade-display').textContent = grade.grade;
        document.getElementById('grade-display').style.color = grade.color;
        document.getElementById('grade-label').textContent = grade.label;

        document.getElementById('result-score').textContent = results.finalScore;
        document.getElementById('result-correct').textContent = results.correctMoves;
        document.getElementById('result-incorrect').textContent = results.incorrectMoves;
        document.getElementById('result-accuracy').textContent = `${results.accuracy}%`;
        document.getElementById('result-time').textContent = formatSeconds(results.timeTaken);
        document.getElementById('result-streak').textContent = results.maxStreak;

        // Update complexity reminder
        document.getElementById('complexity-reminder-grid').innerHTML = `
            <div class="complexity-item">
                <div class="complexity-value">${results.timeComplexity.best}</div>
                <div style="color: var(--color-text-muted);">Best Case</div>
            </div>
            <div class="complexity-item">
                <div class="complexity-value">${results.timeComplexity.average}</div>
                <div style="color: var(--color-text-muted);">Average Case</div>
            </div>
            <div class="complexity-item">
                <div class="complexity-value">${results.timeComplexity.worst}</div>
                <div style="color: var(--color-text-muted);">Worst Case</div>
            </div>
            <div class="complexity-item">
                <div class="complexity-value">${results.spaceComplexity}</div>
                <div style="color: var(--color-text-muted);">Space</div>
            </div>
        `;

        // Show success animation
        this.renderer.showSuccessAnimation();

        // Show results screen after short delay
        setTimeout(() => {
            this.showScreen('results');
        }, 1500);
    }

    /**
     * Skip current step
     */
    skipStep() {
        const result = this.gameManager.skipStep();
        if (result.success) {
            this.updateGameUI();
            this.updateSortedBars();

            if (this.gameManager.isGameComplete) {
                this.endGame();
            }
        }
    }

    /**
     * Show hint for current step
     */
    showHint() {
        const hint = this.gameManager.getHint();
        this.showToast(hint, 'info');
    }

    /**
     * Confirm exit from game
     */
    confirmExit() {
        document.getElementById('exit-modal').classList.add('show');
    }

    /**
     * Close exit modal
     */
    closeModal() {
        document.getElementById('exit-modal').classList.remove('show');
    }

    /**
     * Exit game
     */
    exitGame() {
        this.closeModal();
        this.stopTimer();
        this.gameManager.reset();
        this.showScreen('explanation');
    }

    /**
     * Play again with same settings
     */
    playAgain() {
        this.startGame();
    }

    // =========================================================================
    // Demo Mode
    // =========================================================================

    /**
     * Start demo mode
     */
    startDemo() {
        if (!this.selectedAlgorithm) {
            this.showToast('Please select an algorithm first', 'error');
            return;
        }

        // Generate steps for demo
        const array = this.gameManager.generateArray(this.selectedDifficulty, this.selectedInputType);
        const algorithm = this.gameManager.algorithms[this.selectedAlgorithm];
        const steps = algorithm.generateSteps([...array]);

        // Initialize demo renderer
        this.demoRenderer = new Renderer('demo-bars-container');
        this.demoRenderer.init(array);

        // Initialize animator
        this.animator = new Animator(this.demoRenderer);
        this.animator.loadSteps(steps);

        // Setup callbacks
        this.animator.onStep((step, index) => {
            document.getElementById('demo-step-type').textContent = step.type.toUpperCase();
            document.getElementById('demo-step-description').textContent = step.description;

            const progress = ((index + 1) / steps.length) * 100;
            document.getElementById('demo-progress-fill').style.width = `${progress}%`;
        });

        this.animator.onComplete(() => {
            this.isDemoPlaying = false;
            document.getElementById('demo-play').textContent = '▶️';
            this.showToast('Demo complete!', 'success');
        });

        // Update title
        document.getElementById('demo-title').textContent = `${algorithm.name} Demo`;

        this.showScreen('demo');
    }

    /**
     * Toggle demo play/pause
     */
    toggleDemoPlay() {
        if (!this.animator) return;

        if (this.isDemoPlaying) {
            this.animator.pause();
            this.isDemoPlaying = false;
            document.getElementById('demo-play').textContent = '▶️';
        } else {
            this.animator.play();
            this.isDemoPlaying = true;
            document.getElementById('demo-play').textContent = '⏸️';
        }
    }

    /**
     * Step forward in demo
     */
    demoStepForward() {
        if (!this.animator) return;
        this.animator.stepForward();
    }

    /**
     * Step backward in demo
     */
    demoStepBack() {
        if (!this.animator) return;
        this.animator.stepBackward();
    }

    /**
     * Set demo playback speed
     * @param {number} speed - Speed multiplier
     */
    setDemoSpeed(speed) {
        if (!this.animator) return;

        this.animator.setSpeed(speed);

        // Update button states
        document.querySelectorAll('#screen-demo [data-speed]').forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
        });
    }

    /**
     * Stop demo and return
     */
    stopDemo() {
        if (this.animator) {
            this.animator.stop();
        }
        this.isDemoPlaying = false;
        this.showScreen('explanation');
    }

    // =========================================================================
    // Utilities
    // =========================================================================

    /**
     * Show sorting tool screen
     */
    showTool() {
        const algorithm = this.gameManager.algorithms[this.selectedAlgorithm];
        document.getElementById('tool-title').textContent = `${algorithm.name} Tool`;
        document.getElementById('tool-time-complexity').textContent = algorithm.timeComplexity.average;
        document.getElementById('tool-space-complexity').textContent = algorithm.spaceComplexity;

        // Reset tool state
        document.getElementById('sort-input').value = '';
        document.getElementById('tool-results').classList.add('hidden');

        this.showScreen('tool');
    }

    /**
     * Generate random numbers for tool
     */
    generateToolRandom() {
        const count = 10;
        const randomNumbers = Array.from({ length: count }, () => Math.floor(Math.random() * 100));
        document.getElementById('sort-input').value = randomNumbers.join(', ');
    }

    /**
     * Run the sort tool
     */
    runToolSort() {
        const inputStr = document.getElementById('sort-input').value;
        if (!inputStr.trim()) {
            this.showToast('Please enter some numbers', 'error');
            return;
        }

        const numbers = inputStr.split(',')
            .map(n => n.trim())
            .filter(n => n !== '')
            .map(Number);

        if (numbers.some(isNaN)) {
            this.showToast('Please enter valid numbers', 'error');
            return;
        }

        if (numbers.length === 0) {
            this.showToast('Please enter at least one number', 'error');
            return;
        }

        // Use the pure merge sort implementation if selected algorithm is merge
        let sortedNumbers;
        if (this.selectedAlgorithm === 'merge') {
            sortedNumbers = mergeSort([...numbers]);
        } else {
            // For other algorithms, we can still use their logic or just JS sort for now
            // But the user specifically asked for Merge Sort as a tool
            sortedNumbers = [...numbers].sort((a, b) => a - b);
        }

        // Display results
        document.getElementById('tool-original').textContent = numbers.join(', ');
        document.getElementById('tool-sorted').textContent = sortedNumbers.join(', ');
        document.getElementById('tool-results').classList.remove('hidden');

        this.showToast('Sorting complete!', 'success');
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type: success, error, info
     */
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
