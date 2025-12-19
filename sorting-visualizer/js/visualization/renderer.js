/**
 * Visualization Renderer - Renders array elements as animated bars
 */
class Renderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bars = [];
        this.selectedIndices = [];
        this.animationSpeed = 300; // ms

        // Color scheme
        this.colors = {
            normal: 'var(--color-bar-normal)',
            comparing: 'var(--color-bar-comparing)',
            swapping: 'var(--color-bar-swapping)',
            sorted: 'var(--color-bar-sorted)',
            selected: 'var(--color-bar-selected)',
            pivot: 'var(--color-bar-pivot)'
        };
    }

    /**
     * Initialize the visualization with an array
     * @param {number[]} array - Array to visualize
     */
    init(array) {
        this.container.innerHTML = '';
        this.bars = [];
        this.selectedIndices = [];

        const maxValue = Math.max(...array);
        const containerWidth = this.container.clientWidth;
        const barWidth = Math.max(20, Math.floor((containerWidth - (array.length * 4)) / array.length));

        array.forEach((value, index) => {
            const bar = this.createBar(value, index, maxValue, barWidth);
            this.container.appendChild(bar);
            this.bars.push(bar);
        });
    }

    /**
     * Create a single bar element
     * @param {number} value - Bar value
     * @param {number} index - Bar index
     * @param {number} maxValue - Maximum value for scaling
     * @param {number} barWidth - Width of the bar
     * @returns {HTMLElement} Bar element
     */
    createBar(value, index, maxValue, barWidth) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.dataset.index = index;
        bar.dataset.value = value;

        // Calculate height (min 20%, max 100%)
        const heightPercent = Math.max(20, (value / maxValue) * 100);
        bar.style.height = `${heightPercent}%`;
        bar.style.width = `${barWidth}px`;

        // Value label
        const label = document.createElement('span');
        label.className = 'bar-label';
        label.textContent = value;
        bar.appendChild(label);

        // Click handler for selection
        bar.addEventListener('click', () => this.handleBarClick(index));

        return bar;
    }

    /**
     * Handle bar click for selection
     * @param {number} index - Clicked bar index
     */
    handleBarClick(index) {
        // Dispatch custom event for game logic to handle
        const event = new CustomEvent('barSelected', {
            detail: { index }
        });
        this.container.dispatchEvent(event);
    }

    /**
     * Update selection state
     * @param {number[]} indices - Selected indices
     */
    setSelected(indices) {
        // Clear previous selections
        this.bars.forEach(bar => bar.classList.remove('selected'));

        // Set new selections
        this.selectedIndices = indices;
        indices.forEach(index => {
            if (this.bars[index]) {
                this.bars[index].classList.add('selected');
            }
        });
    }

    /**
     * Highlight bars for comparison
     * @param {number[]} indices - Indices to highlight
     */
    setComparing(indices) {
        this.clearAllStates();
        indices.forEach(index => {
            if (this.bars[index]) {
                this.bars[index].classList.add('comparing');
            }
        });
    }

    /**
     * Highlight bars for swapping
     * @param {number[]} indices - Indices being swapped
     */
    setSwapping(indices) {
        this.clearAllStates();
        indices.forEach(index => {
            if (this.bars[index]) {
                this.bars[index].classList.add('swapping');
            }
        });
    }

    /**
     * Mark bars as sorted
     * @param {number[]} indices - Sorted indices
     */
    setSorted(indices) {
        indices.forEach(index => {
            if (this.bars[index]) {
                this.bars[index].classList.remove('comparing', 'swapping', 'selected');
                this.bars[index].classList.add('sorted');
            }
        });
    }

    /**
     * Mark bar as pivot (for quick sort)
     * @param {number} index - Pivot index
     */
    setPivot(index) {
        if (this.bars[index]) {
            this.bars[index].classList.add('pivot');
        }
    }

    /**
     * Clear all highlight states
     */
    clearAllStates() {
        this.bars.forEach(bar => {
            bar.classList.remove('comparing', 'swapping', 'selected', 'pivot');
        });
    }

    /**
     * Animate swap between two bars
     * @param {number} index1 - First index
     * @param {number} index2 - Second index
     * @returns {Promise} Resolves when animation completes
     */
    async animateSwap(index1, index2) {
        const bar1 = this.bars[index1];
        const bar2 = this.bars[index2];

        if (!bar1 || !bar2) return;

        // Mark as swapping
        bar1.classList.add('swapping');
        bar2.classList.add('swapping');

        // Calculate positions
        const rect1 = bar1.getBoundingClientRect();
        const rect2 = bar2.getBoundingClientRect();
        const distance = rect2.left - rect1.left;

        // Animate
        bar1.style.transform = `translateX(${distance}px)`;
        bar2.style.transform = `translateX(${-distance}px)`;

        await this.wait(this.animationSpeed);

        // Reset transforms and swap in DOM
        bar1.style.transform = '';
        bar2.style.transform = '';

        // Swap values and heights
        const tempHeight = bar1.style.height;
        const tempValue = bar1.dataset.value;
        const tempLabel = bar1.querySelector('.bar-label').textContent;

        bar1.style.height = bar2.style.height;
        bar1.dataset.value = bar2.dataset.value;
        bar1.querySelector('.bar-label').textContent = bar2.querySelector('.bar-label').textContent;

        bar2.style.height = tempHeight;
        bar2.dataset.value = tempValue;
        bar2.querySelector('.bar-label').textContent = tempLabel;

        // Clear swapping class
        bar1.classList.remove('swapping');
        bar2.classList.remove('swapping');
    }

    /**
     * Update bar values (for merge sort)
     * @param {number} index - Bar index
     * @param {number} value - New value
     * @param {number} maxValue - Max value for height calculation
     */
    updateBar(index, value, maxValue) {
        const bar = this.bars[index];
        if (!bar) return;

        const heightPercent = Math.max(20, (value / maxValue) * 100);
        bar.style.height = `${heightPercent}%`;
        bar.dataset.value = value;
        bar.querySelector('.bar-label').textContent = value;
    }

    /**
     * Set animation speed
     * @param {number} speed - Speed multiplier (0.5 = slow, 2 = fast)
     */
    setAnimationSpeed(speed) {
        this.animationSpeed = Math.round(300 / speed);
    }

    /**
     * Utility wait function
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise}
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show success animation on all bars
     */
    async showSuccessAnimation() {
        for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].classList.add('sorted', 'success');
            await this.wait(50);
        }
    }

    /**
     * Flash bar to indicate error
     * @param {number[]} indices - Indices to flash
     */
    async flashError(indices) {
        indices.forEach(index => {
            if (this.bars[index]) {
                this.bars[index].classList.add('error');
            }
        });

        await this.wait(300);

        indices.forEach(index => {
            if (this.bars[index]) {
                this.bars[index].classList.remove('error');
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Renderer };
}
