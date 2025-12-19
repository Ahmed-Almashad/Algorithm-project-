/**
 * Selection Sort Algorithm with Step Tracking
 * Time Complexity: O(n²) for all cases
 * Space Complexity: O(1)
 * 
 * Divides the array into sorted and unsorted portions.
 * Repeatedly finds the minimum element from the unsorted portion
 * and moves it to the end of the sorted portion.
 */
class SelectionSort extends SortingAlgorithm {
    constructor() {
        super(
            'Selection Sort',
            { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
            'O(1)'
        );
    }

    /**
     * Generate all steps for selection sort
     * @param {number[]} inputArray - The array to sort
     * @returns {Step[]} Array of step objects
     */
    generateSteps(inputArray) {
        this.reset();
        const arr = [...inputArray];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;

            // Mark current position as starting point for finding minimum
            this.steps.push(this.createStep(
                StepType.SELECT,
                [i],
                arr,
                `Looking for minimum element starting from position ${i} (value: ${arr[i]})`,
                false
            ));

            // Find minimum element in unsorted portion
            for (let j = i + 1; j < n; j++) {
                // Compare current minimum with next element
                this.steps.push(this.createStep(
                    StepType.COMPARE,
                    [minIndex, j],
                    arr,
                    `Comparing current minimum ${arr[minIndex]} with ${arr[j]}`,
                    false
                ));

                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                    this.steps.push(this.createStep(
                        StepType.SELECT,
                        [minIndex],
                        arr,
                        `Found new minimum: ${arr[minIndex]} at position ${minIndex}`,
                        false
                    ));
                }
            }

            // Swap minimum with first unsorted position (user action)
            if (minIndex !== i) {
                this.steps.push(this.createStep(
                    StepType.SWAP,
                    [i, minIndex],
                    arr,
                    `Swap ${arr[i]} at position ${i} with minimum ${arr[minIndex]} at position ${minIndex}`,
                    true  // User must perform this swap
                ));

                // Perform the swap
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            }

            // Mark element as sorted
            this.steps.push(this.createStep(
                StepType.SORTED,
                [i],
                arr,
                `Element ${arr[i]} is now in its final sorted position at index ${i}`,
                false
            ));
        }

        // Mark last element as sorted
        this.steps.push(this.createStep(
            StepType.SORTED,
            [n - 1],
            arr,
            `Element ${arr[n - 1]} is now in its final sorted position`,
            false
        ));

        return this.steps;
    }

    /**
     * Validate if user's swap is correct for selection sort
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
            return { valid: true, message: 'Correct! You swapped the minimum element to its correct position.' };
        }

        return {
            valid: false,
            message: `Incorrect. In Selection Sort, swap the minimum element from the unsorted portion with the first unsorted position.`
        };
    }

    getExplanation() {
        return `
**Selection Sort** works by dividing the array into two parts: a sorted portion at the beginning and an unsorted portion at the end.

### How It Works:
1. Start with the entire array as unsorted
2. Find the minimum element in the unsorted portion
3. Swap it with the first element of the unsorted portion
4. The sorted portion now includes this element
5. Repeat until the entire array is sorted

### Key Characteristics:
- **Not Stable**: May change the relative order of equal elements
- **In-place**: Only requires O(1) extra space
- **Minimal Swaps**: Makes at most n-1 swaps (good when swapping is expensive)
- **Not Adaptive**: Always O(n²) regardless of input order

### When to Use:
- When memory writes are expensive (fewer swaps than bubble sort)
- Small datasets
- When simplicity is preferred over efficiency
        `.trim();
    }

    getPseudocode() {
        return `
procedure selectionSort(A: list of sortable items)
    n := length(A)
    for i := 0 to n-2 do
        minIndex := i
        for j := i+1 to n-1 do
            if A[j] < A[minIndex] then
                minIndex := j
            end if
        end for
        if minIndex ≠ i then
            swap(A[i], A[minIndex])
        end if
    end for
end procedure
        `.trim();
    }

    getExampleWalkthrough() {
        return [
            { array: [64, 25, 12, 22, 11], action: 'Initial array', highlight: [], sorted: [] },
            { array: [64, 25, 12, 22, 11], action: 'Find minimum in [64, 25, 12, 22, 11]', highlight: [0, 1, 2, 3, 4] },
            { array: [64, 25, 12, 22, 11], action: 'Minimum is 11 at index 4', highlight: [4] },
            { array: [11, 25, 12, 22, 64], action: 'Swap 64 with 11', highlight: [0, 4], sorted: [0] },
            { array: [11, 25, 12, 22, 64], action: 'Find minimum in [25, 12, 22, 64]', highlight: [1, 2, 3, 4] },
            { array: [11, 25, 12, 22, 64], action: 'Minimum is 12 at index 2', highlight: [2] },
            { array: [11, 12, 25, 22, 64], action: 'Swap 25 with 12', highlight: [1, 2], sorted: [0, 1] },
            { array: [11, 12, 25, 22, 64], action: 'Find minimum in [25, 22, 64]', highlight: [2, 3, 4] },
            { array: [11, 12, 22, 25, 64], action: 'Swap 25 with 22', highlight: [2, 3], sorted: [0, 1, 2] },
            { array: [11, 12, 22, 25, 64], action: 'Find minimum in [25, 64] - 25 is minimum, no swap needed', highlight: [3, 4], sorted: [0, 1, 2, 3] },
            { array: [11, 12, 22, 25, 64], action: 'Final sorted array', highlight: [], sorted: [0, 1, 2, 3, 4] }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SelectionSort };
}
