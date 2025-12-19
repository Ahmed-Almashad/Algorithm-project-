/**
 * Bubble Sort Algorithm with Step Tracking
 * Time Complexity: O(n²) average/worst, O(n) best
 * Space Complexity: O(1)
 * 
 * Repeatedly steps through the list, compares adjacent elements,
 * and swaps them if they are in the wrong order.
 */
class BubbleSort extends SortingAlgorithm {
    constructor() {
        super(
            'Bubble Sort',
            { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
            'O(1)'
        );
    }

    /**
     * Generate all steps for bubble sort
     * @param {number[]} inputArray - The array to sort
     * @returns {Step[]} Array of step objects
     */
    generateSteps(inputArray) {
        this.reset();
        const arr = [...inputArray];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;

            for (let j = 0; j < n - i - 1; j++) {
                // Step 1: Compare adjacent elements
                this.steps.push(this.createStep(
                    StepType.COMPARE,
                    [j, j + 1],
                    arr,
                    `Comparing ${arr[j]} and ${arr[j + 1]}`,
                    false
                ));

                // Step 2: Swap if necessary (this is the user action)
                if (arr[j] > arr[j + 1]) {
                    this.steps.push(this.createStep(
                        StepType.SWAP,
                        [j, j + 1],
                        arr,
                        `Swap ${arr[j]} and ${arr[j + 1]} because ${arr[j]} > ${arr[j + 1]}`,
                        true  // User must perform this swap
                    ));

                    // Perform the swap
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;
                }
            }

            // Mark the last element of this pass as sorted
            this.steps.push(this.createStep(
                StepType.SORTED,
                [n - i - 1],
                arr,
                `Element ${arr[n - i - 1]} is now in its final sorted position`,
                false
            ));

            // Optimization: if no swaps occurred, array is sorted
            if (!swapped) {
                // Mark remaining elements as sorted
                for (let k = 0; k < n - i - 1; k++) {
                    this.steps.push(this.createStep(
                        StepType.SORTED,
                        [k],
                        arr,
                        `Element ${arr[k]} is in its final sorted position`,
                        false
                    ));
                }
                break;
            }
        }

        // Mark first element as sorted (if not already)
        if (this.steps.length > 0 && this.steps[this.steps.length - 1].indices[0] !== 0) {
            this.steps.push(this.createStep(
                StepType.SORTED,
                [0],
                arr,
                `Element ${arr[0]} is in its final sorted position`,
                false
            ));
        }

        return this.steps;
    }

    /**
     * Validate if user's swap is correct for bubble sort
     * @param {number} stepIndex - Current step index
     * @param {Object} userAction - {type: 'swap', indices: [i, j]}
     * @returns {Object} {valid: boolean, message: string}
     */
    validateMove(stepIndex, userAction) {
        const step = this.steps[stepIndex];

        if (!step) {
            return { valid: false, message: 'Invalid step index' };
        }

        if (!step.isUserAction) {
            return { valid: false, message: 'No user action required at this step' };
        }

        if (userAction.type !== 'swap') {
            return { valid: false, message: 'Expected a swap action' };
        }

        const expectedIndices = step.indices.sort((a, b) => a - b);
        const userIndices = [...userAction.indices].sort((a, b) => a - b);

        if (expectedIndices[0] === userIndices[0] && expectedIndices[1] === userIndices[1]) {
            return { valid: true, message: 'Correct swap!' };
        }

        return {
            valid: false,
            message: `Incorrect. In Bubble Sort, we compare adjacent elements and swap if the left is greater than the right.`
        };
    }

    getExplanation() {
        return `
**Bubble Sort** is one of the simplest sorting algorithms. It works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order.

### How It Works:
1. Start at the beginning of the array
2. Compare the first two elements
3. If the first element is larger, swap them
4. Move to the next pair and repeat
5. After each complete pass, the largest unsorted element "bubbles up" to its correct position
6. Repeat until no swaps are needed

### Key Characteristics:
- **Stable**: Equal elements maintain their relative order
- **In-place**: Only requires O(1) extra space
- **Adaptive**: Can detect if array is already sorted (best case O(n))

### When to Use:
- Small datasets
- Nearly sorted data
- Educational purposes to understand sorting concepts
        `.trim();
    }

    getPseudocode() {
        return `
procedure bubbleSort(A: list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n-1 do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped := true
            end if
        end for
        n := n - 1
    until not swapped
end procedure
        `.trim();
    }

    getExampleWalkthrough() {
        const example = [5, 3, 8, 4, 2];
        return [
            { array: [5, 3, 8, 4, 2], action: 'Initial array', highlight: [] },
            { array: [5, 3, 8, 4, 2], action: 'Compare 5 and 3', highlight: [0, 1] },
            { array: [3, 5, 8, 4, 2], action: 'Swap! 5 > 3', highlight: [0, 1] },
            { array: [3, 5, 8, 4, 2], action: 'Compare 5 and 8', highlight: [1, 2] },
            { array: [3, 5, 8, 4, 2], action: 'No swap needed: 5 < 8', highlight: [1, 2] },
            { array: [3, 5, 8, 4, 2], action: 'Compare 8 and 4', highlight: [2, 3] },
            { array: [3, 5, 4, 8, 2], action: 'Swap! 8 > 4', highlight: [2, 3] },
            { array: [3, 5, 4, 8, 2], action: 'Compare 8 and 2', highlight: [3, 4] },
            { array: [3, 5, 4, 2, 8], action: 'Swap! 8 > 2. Pass 1 complete, 8 is sorted', highlight: [4], sorted: [4] },
            { array: [3, 5, 4, 2, 8], action: 'Continue passes until fully sorted...', highlight: [] },
            { array: [2, 3, 4, 5, 8], action: 'Final sorted array', highlight: [], sorted: [0, 1, 2, 3, 4] }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BubbleSort };
}
