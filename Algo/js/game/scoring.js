/**
 * Scoring System - Handles score calculations, bonuses, and achievements
 */
class ScoringSystem {
    constructor() {
        // Score configuration
        this.config = {
            correctSwap: 100,
            incorrectSwap: -50,
            streakBonus: 50,           // Bonus at streak of 5+
            streakThreshold: 5,
            perfectGameBonus: 150,
            highAccuracyBonus: 100,    // For 90%+ accuracy
            fastCompletionBonus: 200,

            difficultyMultipliers: {
                easy: 1.0,
                medium: 1.5,
                hard: 2.0,
                expert: 3.0
            }
        };

        // Achievement definitions
        this.achievements = [
            {
                id: 'first_sort',
                name: 'First Sort',
                description: 'Complete your first sorting game',
                icon: '🎯',
                check: (stats) => stats.gamesCompleted >= 1
            },
            {
                id: 'perfect_game',
                name: 'Perfect!',
                description: 'Complete a game with 100% accuracy',
                icon: '⭐',
                check: (stats) => stats.perfectGames >= 1
            },
            {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Complete a game in under 30 seconds',
                icon: '⚡',
                check: (stats) => stats.fastestTime < 30
            },
            {
                id: 'streak_master',
                name: 'Streak Master',
                description: 'Achieve a streak of 10 correct moves',
                icon: '🔥',
                check: (stats) => stats.maxStreak >= 10
            },
            {
                id: 'algorithm_explorer',
                name: 'Algorithm Explorer',
                description: 'Try all 5 sorting algorithms',
                icon: '🔬',
                check: (stats) => stats.algorithmsUsed.size >= 5
            },
            {
                id: 'bubble_master',
                name: 'Bubble Master',
                description: 'Complete 5 games with Bubble Sort',
                icon: '🫧',
                check: (stats) => (stats.algorithmGames['bubble'] || 0) >= 5
            },
            {
                id: 'quick_professional',
                name: 'Quick Professional',
                description: 'Complete 5 games with Quick Sort',
                icon: '⚔️',
                check: (stats) => (stats.algorithmGames['quick'] || 0) >= 5
            },
            {
                id: 'challenge_accepted',
                name: 'Challenge Accepted',
                description: 'Complete a game on Hard difficulty',
                icon: '💪',
                check: (stats) => stats.hardGamesCompleted >= 1
            },
            {
                id: 'expert_level',
                name: 'Expert Level',
                description: 'Complete a game on Expert difficulty',
                icon: '🏆',
                check: (stats) => stats.expertGamesCompleted >= 1
            },
            {
                id: 'high_scorer',
                name: 'High Scorer',
                description: 'Earn a total of 10,000 points',
                icon: '💯',
                check: (stats) => stats.totalScore >= 10000
            }
        ];
    }

    /**
     * Calculate points for a correct move
     * @param {string} difficulty - Current difficulty level
     * @param {number} currentStreak - Current streak count
     * @returns {Object} Points breakdown
     */
    calculateCorrectMoveScore(difficulty, currentStreak) {
        const multiplier = this.config.difficultyMultipliers[difficulty] || 1.0;
        const basePoints = this.config.correctSwap;

        let streakBonus = 0;
        if (currentStreak >= this.config.streakThreshold) {
            streakBonus = this.config.streakBonus;
        }

        const totalPoints = Math.round((basePoints + streakBonus) * multiplier);

        return {
            basePoints,
            streakBonus,
            multiplier,
            totalPoints
        };
    }

    /**
     * Calculate penalty for incorrect move
     * @returns {number} Penalty points (negative)
     */
    calculateIncorrectMovePenalty() {
        return this.config.incorrectSwap;
    }

    /**
     * Calculate end-game bonuses
     * @param {Object} gameStats - Game statistics
     * @returns {Object} Bonus breakdown
     */
    calculateGameBonuses(gameStats) {
        const bonuses = {
            perfect: 0,
            accuracy: 0,
            speed: 0,
            total: 0
        };

        // Perfect game (no mistakes)
        if (gameStats.incorrectMoves === 0 && gameStats.correctMoves > 0) {
            bonuses.perfect = this.config.perfectGameBonus;
        }

        // High accuracy (90%+)
        const accuracy = gameStats.correctMoves /
            (gameStats.correctMoves + gameStats.incorrectMoves);
        if (accuracy >= 0.9 && bonuses.perfect === 0) {
            bonuses.accuracy = this.config.highAccuracyBonus;
        }

        // Fast completion
        const avgTimePerMove = gameStats.timeTaken / gameStats.correctMoves;
        if (avgTimePerMove < 2) { // Less than 2 seconds per move
            bonuses.speed = this.config.fastCompletionBonus;
        }

        bonuses.total = bonuses.perfect + bonuses.accuracy + bonuses.speed;
        return bonuses;
    }

    /**
     * Check for newly earned achievements
     * @param {Object} stats - Player statistics
     * @param {Set} earnedAchievements - Already earned achievement IDs
     * @returns {Object[]} Newly earned achievements
     */
    checkAchievements(stats, earnedAchievements = new Set()) {
        const newAchievements = [];

        for (const achievement of this.achievements) {
            if (!earnedAchievements.has(achievement.id) && achievement.check(stats)) {
                newAchievements.push(achievement);
            }
        }

        return newAchievements;
    }

    /**
     * Get all achievements with unlock status
     * @param {Set} earnedAchievements - Earned achievement IDs
     * @returns {Object[]} All achievements with status
     */
    getAchievementStatus(earnedAchievements = new Set()) {
        return this.achievements.map(achievement => ({
            ...achievement,
            unlocked: earnedAchievements.has(achievement.id)
        }));
    }

    /**
     * Calculate grade based on final score
     * @param {number} score - Final score
     * @param {string} difficulty - Difficulty level
     * @returns {Object} Grade info
     */
    calculateGrade(score, difficulty) {
        const multiplier = this.config.difficultyMultipliers[difficulty] || 1.0;
        const adjustedScore = score / multiplier;

        const grades = [
            { min: 1500, grade: 'S', label: 'Perfect!', color: '#fbbf24' },
            { min: 1200, grade: 'A', label: 'Excellent!', color: '#22c55e' },
            { min: 900, grade: 'B', label: 'Great!', color: '#3b82f6' },
            { min: 600, grade: 'C', label: 'Good', color: '#8b5cf6' },
            { min: 300, grade: 'D', label: 'Keep Practicing', color: '#f97316' },
            { min: 0, grade: 'F', label: 'Try Again', color: '#ef4444' }
        ];

        for (const gradeInfo of grades) {
            if (adjustedScore >= gradeInfo.min) {
                return gradeInfo;
            }
        }

        return grades[grades.length - 1];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScoringSystem };
}
