/**
 * Insertion Sort Algorithm with Step Tracking
 * Time Complexity: O(n²) average/worst, O(n) best
 * Space Complexity: O(1)
 * 
 * Builds the sorted array one element at a time by inserting
 * each element into its correct position in the sorted portion.
 */
class InsertionSort extends SortingAlgorithm {
    constructor() {
        super(
            'Insertion Sort',
            { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
            'O(1)'
        );
    }

    /**
     * Generate all steps for insertion sort
     * @param {number[]} inputArray - The array to sort
     * @returns {Step[]} Array of step objects
     */
    generateSteps(inputArray) {
        this.reset();
        const arr = [...inputArray];
        const n = arr.length;

        // First element is already "sorted"
        this.steps.push(this.createStep(
            StepType.SORTED,
            [0],
            arr,
            `First element ${arr[0]} is our initial sorted portion`,
            false
        ));

        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;

            // Mark the current element we're inserting
            this.steps.push(this.createStep(
                StepType.SELECT,
                [i],
                arr,
                `Inserting ${key} into the sorted portion [0..${i - 1}]`,
                false
            ));

            // Compare and shift elements
            while (j >= 0 && arr[j] > key) {
                // Compare with previous element
                this.steps.push(this.createStep(
                    StepType.COMPARE,
                    [j, j + 1],
                    arr,
                    `Comparing ${arr[j]} with ${key}: ${arr[j]} > ${key}, need to shift`,
                    false
                ));

                // Shift element (represented as swap for user interaction)
                this.steps.push(this.createStep(
                    StepType.SWAP,
                    [j, j + 1],
                    arr,
                    `Move ${arr[j]} one position to the right (swap positions ${j} and ${j + 1})`,
                    true  // User must perform this swap
                ));

                // Perform the shift
                arr[j + 1] = arr[j];
                arr[j] = key;
                j--;
            }

            // If we didn't need to shift at all, still show the comparison
            if (j === i - 1) {
                this.steps.push(this.createStep(
                    StepType.COMPARE,
                    [j, i],
                    arr,
                    `Comparing ${arr[j]} with ${key}: ${arr[j]} ≤ ${key}, no shift needed`,
                    false
                ));
            }

            // Mark element as inserted
            this.steps.push(this.createStep(
                StepType.INSERT,
                [j + 1],
                arr,
                `${key} is now in its correct position in the sorted portion`,
                false
            ));
        }

        // Mark all elements as sorted
        for (let i = 0; i < n; i++) {
            this.steps.push(this.createStep(
                StepType.SORTED,
                [i],
                arr,
                `Element ${arr[i]} is in its final position`,
                false
            ));
        }

        return this.steps;
    }

    /**
     * Validate if user's swap is correct for insertion sort
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
            return { valid: true, message: 'Correct! You shifted the element to make room for insertion.' };
        }

        return {
            valid: false,
            message: `Incorrect. In Insertion Sort, shift larger elements to the right to make room for the current element.`
        };
    }

    getExplanation() {
        return `
**Insertion Sort** builds the sorted array one element at a time. It's similar to how you might sort playing cards in your hand.

### How It Works:
1. Start with the first element as a sorted portion of size 1
2. Take the next element from the unsorted portion
3. Compare it with elements in the sorted portion from right to left
4. Shift larger elements to the right
5. Insert the element in its correct position
6. Repeat until all elements are sorted

### Key Characteristics:
- **Stable**: Equal elements maintain their relative order
- **In-place**: Only requires O(1) extra space
- **Adaptive**: Very efficient for nearly sorted data (O(n) best case)
- **Online**: Can sort elements as they arrive

### When to Use:
- Small datasets
- Nearly sorted data
- When data arrives incrementally (streaming)
- As part of more complex algorithms (e.g., Timsort uses it for small subarrays)
        `.trim();
    }

    getPseudocode() {
        return `
procedure insertionSort(A: list of sortable items)
    n := length(A)
    for i := 1 to n-1 do
        key := A[i]
        j := i - 1
        
        // Shift elements greater than key to the right
        while j >= 0 and A[j] > key do
            A[j + 1] := A[j]
            j := j - 1
        end while
        
        // Insert key at correct position
        A[j + 1] := key
    end for
end procedure
        `.trim();
    }

    getExampleWalkthrough() {
        return [
            { array: [5, 2, 4, 6, 1, 3], action: 'Initial array, 5 is our sorted portion', highlight: [], sorted: [0] },
            { array: [5, 2, 4, 6, 1, 3], action: 'Insert 2: Compare with 5', highlight: [0, 1] },
            { array: [2, 5, 4, 6, 1, 3], action: '2 < 5, shift 5 right, insert 2', highlight: [0], sorted: [0, 1] },
            { array: [2, 5, 4, 6, 1, 3], action: 'Insert 4: Compare with 5', highlight: [1, 2] },
            { array: [2, 4, 5, 6, 1, 3], action: '4 < 5, shift 5, 4 > 2, insert 4', highlight: [1], sorted: [0, 1, 2] },
            { array: [2, 4, 5, 6, 1, 3], action: 'Insert 6: Compare with 5', highlight: [2, 3] },
            { array: [2, 4, 5, 6, 1, 3], action: '6 > 5, already in place', highlight: [3], sorted: [0, 1, 2, 3] },
            { array: [2, 4, 5, 6, 1, 3], action: 'Insert 1: Shift all elements', highlight: [0, 1, 2, 3, 4] },
            { array: [1, 2, 4, 5, 6, 3], action: '1 goes to the beginning', highlight: [0], sorted: [0, 1, 2, 3, 4] },
            { array: [1, 2, 4, 5, 6, 3], action: 'Insert 3: Shift 4, 5, 6', highlight: [2, 3, 4, 5] },
            { array: [1, 2, 3, 4, 5, 6], action: 'Final sorted array', highlight: [], sorted: [0, 1, 2, 3, 4, 5] }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InsertionSort };
}
