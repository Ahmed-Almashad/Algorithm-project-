/**
 * Heap Sort Algorithm with Step Tracking
 * Time Complexity: O(n log n) for all cases
 * Space Complexity: O(1)
 * 
 * Uses a binary heap data structure to sort elements.
 * First builds a max-heap, then repeatedly extracts the maximum.
 */
class HeapSort extends SortingAlgorithm {
    constructor() {
        super(
            'Heap Sort',
            { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
            'O(1)'
        );
    }

    /**
     * Generate all steps for heap sort
     * @param {number[]} inputArray - The array to sort
     * @returns {Step[]} Array of step objects
     */
    generateSteps(inputArray) {
        this.reset();
        const arr = [...inputArray];
        const n = arr.length;

        // Build max heap
        this.steps.push(this.createStep(
            StepType.DIVIDE,
            [],
            arr,
            'Building max heap from array',
            false
        ));

        // Build heap (rearrange array)
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            this.steps.push(this.createStep(
                StepType.SWAP,
                [0, i],
                arr,
                `Swap root ${arr[0]} with last unsorted element ${arr[i]}`,
                true
            ));

            [arr[0], arr[i]] = [arr[i], arr[0]];

            // Mark as sorted
            this.steps.push(this.createStep(
                StepType.SORTED,
                [i],
                arr,
                `${arr[i]} is now in its final position`,
                false
            ));

            // Heapify the reduced heap
            this.heapify(arr, i, 0);
        }

        // Mark first element as sorted
        this.steps.push(this.createStep(
            StepType.SORTED,
            [0],
            arr,
            `${arr[0]} is in its final position. Array is sorted!`,
            false
        ));

        return this.steps;
    }

    /**
     * Heapify a subtree rooted at index i
     * @param {number[]} arr - Array to heapify
     * @param {number} n - Size of heap
     * @param {number} i - Root index of subtree
     */
    heapify(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        // Compare with left child
        if (left < n) {
            this.steps.push(this.createStep(
                StepType.COMPARE,
                [largest, left],
                arr,
                `Comparing ${arr[largest]} with left child ${arr[left]}`,
                false
            ));

            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }

        // Compare with right child
        if (right < n) {
            this.steps.push(this.createStep(
                StepType.COMPARE,
                [largest, right],
                arr,
                `Comparing ${arr[largest]} with right child ${arr[right]}`,
                false
            ));

            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        // If largest is not root, swap and continue heapifying
        if (largest !== i) {
            this.steps.push(this.createStep(
                StepType.SWAP,
                [i, largest],
                arr,
                `Swap ${arr[i]} with larger child ${arr[largest]} to maintain heap property`,
                true
            ));

            [arr[i], arr[largest]] = [arr[largest], arr[i]];

            // Recursively heapify the affected subtree
            this.heapify(arr, n, largest);
        }
    }

    /**
     * Validate if user's swap is correct for heap sort
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
            return { valid: true, message: 'Correct! Heap property maintained.' };
        }

        return {
            valid: false,
            message: `Incorrect. In Heap Sort, swap to maintain the max-heap property.`
        };
    }

    getExplanation() {
        return `
**Heap Sort** uses a binary heap data structure to sort elements. It's an in-place algorithm with guaranteed O(n log n) performance.

### How It Works:
1. **Build Max Heap**: Convert the array into a max-heap where each parent is larger than its children
2. **Extract Maximum**: Repeatedly swap the root (maximum) with the last element and reduce heap size
3. **Heapify**: After each extraction, restore the heap property

### Binary Heap Properties:
- Complete binary tree stored in an array
- For index i: left child = 2i+1, right child = 2i+2, parent = (i-1)/2
- Max-heap: parent ≥ children

### Key Characteristics:
- **Not Stable**: May change relative order of equal elements
- **In-place**: Only O(1) extra space needed
- **Consistent Performance**: Always O(n log n)
- **Good for priority queues**: Heap structure is useful beyond sorting

### When to Use:
- When guaranteed O(n log n) is needed
- Memory-constrained environments
- Implementing priority queues
        `.trim();
    }

    getPseudocode() {
        return `
procedure heapSort(A)
    n := length(A)
    
    // Build max heap
    for i := n/2 - 1 down to 0 do
        heapify(A, n, i)
    end for
    
    // Extract elements from heap
    for i := n - 1 down to 1 do
        swap(A[0], A[i])      // Move root to end
        heapify(A, i, 0)      // Heapify reduced heap
    end for
end procedure

procedure heapify(A, n, i)
    largest := i
    left := 2*i + 1
    right := 2*i + 2
    
    if left < n and A[left] > A[largest] then
        largest := left
    end if
    
    if right < n and A[right] > A[largest] then
        largest := right
    end if
    
    if largest ≠ i then
        swap(A[i], A[largest])
        heapify(A, n, largest)
    end if
end procedure
        `.trim();
    }

    getExampleWalkthrough() {
        return [
            { array: [4, 10, 3, 5, 1], action: 'Initial array', highlight: [], sorted: [] },
            { array: [4, 10, 3, 5, 1], action: 'Build max heap starting from last non-leaf', highlight: [1, 3, 4] },
            { array: [10, 5, 3, 4, 1], action: 'Max heap built: [10, 5, 3, 4, 1]', highlight: [0], sorted: [] },
            { array: [5, 4, 3, 1, 10], action: 'Swap 10 with 1, heapify', highlight: [0, 4], sorted: [4] },
            { array: [4, 1, 3, 5, 10], action: 'Swap 5 with 1, heapify', highlight: [0, 3], sorted: [3, 4] },
            { array: [3, 1, 4, 5, 10], action: 'Swap 4 with 1', highlight: [0, 2], sorted: [2, 3, 4] },
            { array: [1, 3, 4, 5, 10], action: 'Swap 3 with 1', highlight: [0, 1], sorted: [1, 2, 3, 4] },
            { array: [1, 3, 4, 5, 10], action: 'Final sorted array', highlight: [], sorted: [0, 1, 2, 3, 4] }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeapSort };
}
