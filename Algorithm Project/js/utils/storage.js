/**
 * Local Storage Helper - Handles persistence of game data
 */
class Storage {
    constructor(prefix = 'sorting-visualizer') {
        this.prefix = prefix;
    }

    /**
     * Get a value from storage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default if not found
     * @returns {any} Stored value or default
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`${this.prefix}-${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Storage get error:', e);
            return defaultValue;
        }
    }

    /**
     * Set a value in storage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     */
    set(key, value) {
        try {
            localStorage.setItem(`${this.prefix}-${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('Storage set error:', e);
        }
    }

    /**
     * Remove a value from storage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(`${this.prefix}-${key}`);
        } catch (e) {
            console.warn('Storage remove error:', e);
        }
    }

    /**
     * Clear all storage with this prefix
     */
    clear() {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .forEach(key => localStorage.removeItem(key));
        } catch (e) {
            console.warn('Storage clear error:', e);
        }
    }

    /**
     * Get player statistics
     * @returns {Object} Player stats
     */
    getStats() {
        return this.get('stats', {
            gamesCompleted: 0,
            totalScore: 0,
            perfectGames: 0,
            fastestTime: Infinity,
            maxStreak: 0,
            algorithmsUsed: [],
            algorithmGames: {},
            hardGamesCompleted: 0,
            expertGamesCompleted: 0
        });
    }

    /**
     * Update player statistics
     * @param {Object} gameResults - Results from completed game
     */
    updateStats(gameResults) {
        const stats = this.getStats();

        stats.gamesCompleted++;
        stats.totalScore += gameResults.finalScore;

        if (gameResults.accuracy === 100) {
            stats.perfectGames++;
        }

        if (gameResults.timeTaken < stats.fastestTime) {
            stats.fastestTime = gameResults.timeTaken;
        }

        if (gameResults.maxStreak > stats.maxStreak) {
            stats.maxStreak = gameResults.maxStreak;
        }

        // Track algorithms used
        if (!stats.algorithmsUsed.includes(gameResults.algorithm)) {
            stats.algorithmsUsed.push(gameResults.algorithm);
        }

        // Track games per algorithm
        const algoKey = gameResults.algorithm.toLowerCase().replace(' ', '_');
        stats.algorithmGames[algoKey] = (stats.algorithmGames[algoKey] || 0) + 1;

        // Track difficulty completions
        if (gameResults.difficulty === 'Hard') {
            stats.hardGamesCompleted++;
        } else if (gameResults.difficulty === 'Expert') {
            stats.expertGamesCompleted++;
        }

        this.set('stats', stats);
        return stats;
    }

    /**
     * Get earned achievements
     * @returns {Set} Set of achievement IDs
     */
    getAchievements() {
        const achievements = this.get('achievements', []);
        return new Set(achievements);
    }

    /**
     * Add new achievements
     * @param {string[]} achievementIds - Achievement IDs to add
     */
    addAchievements(achievementIds) {
        const current = this.get('achievements', []);
        const updated = [...new Set([...current, ...achievementIds])];
        this.set('achievements', updated);
    }

    /**
     * Get high scores
     * @returns {Object[]} Array of high scores
     */
    getHighScores() {
        return this.get('highScores', []);
    }

    /**
     * Add a high score
     * @param {Object} score - Score object
     */
    addHighScore(score) {
        const scores = this.getHighScores();
        scores.push(score);
        scores.sort((a, b) => b.score - a.score);
        this.set('highScores', scores.slice(0, 10)); // Keep top 10
    }
}

// Create global instance
const storage = new Storage();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Storage };
}
