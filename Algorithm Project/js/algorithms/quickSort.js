/**
 * Quick Sort Algorithm with Step Tracking
 * Time Complexity: O(n log n) average, O(n²) worst
 * Space Complexity: O(log n) for call stack
 * 
 * Selects a pivot element and partitions the array around it.
 * Elements smaller than pivot go left, larger go right.
 */
class QuickSort extends SortingAlgorithm {
    constructor() {
        super(
            'Quick Sort',
            { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
            'O(log n)'
        );
    }

    /**
     * Generate all steps for quick sort
     * @param {number[]} inputArray - The array to sort
     * @returns {Step[]} Array of step objects
     */
    generateSteps(inputArray) {
        this.reset();
        const arr = [...inputArray];
        this.quickSortRecursive(arr, 0, arr.length - 1);

        // Mark all as sorted at the end
        for (let i = 0; i < arr.length; i++) {
            this.steps.push(this.createStep(
                StepType.SORTED,
                [i],
                arr,
                `Array is completely sorted`,
                false
            ));
        }

        return this.steps;
    }

    /**
     * Recursive quick sort with step tracking
     * @param {number[]} arr - Array being sorted
     * @param {number} low - Left boundary
     * @param {number} high - Right boundary
     */
    quickSortRecursive(arr, low, high) {
        if (low >= high) {
            if (low === high) {
                this.steps.push(this.createStep(
                    StepType.SORTED,
                    [low],
                    arr,
                    `Single element ${arr[low]} is sorted`,
                    false
                ));
            }
            return;
        }

        // Record the divide step
        this.steps.push(this.createStep(
            StepType.DIVIDE,
            [low, high],
            arr,
            `Sorting subarray from index ${low} to ${high}`,
            false
        ));

        // Partition and get pivot position
        const pivotIndex = this.partition(arr, low, high);

        // Mark pivot as sorted
        this.steps.push(this.createStep(
            StepType.SORTED,
            [pivotIndex],
            arr,
            `Pivot ${arr[pivotIndex]} is now in its final position`,
            false
        ));

        // Recursively sort elements before and after partition
        this.quickSortRecursive(arr, low, pivotIndex - 1);
        this.quickSortRecursive(arr, pivotIndex + 1, high);
    }

    /**
     * Partition the array around a pivot with step tracking
     * Using Lomuto partition scheme with last element as pivot
     * @param {number[]} arr - Array being sorted
     * @param {number} low - Left boundary
     * @param {number} high - Right boundary
     * @returns {number} Final pivot position
     */
    partition(arr, low, high) {
        const pivot = arr[high];

        // Mark pivot selection
        this.steps.push(this.createStep(
            StepType.PIVOT,
            [high],
            arr,
            `Selected pivot: ${pivot} (last element)`,
            false
        ));

        let i = low - 1;  // Index of smaller element

        for (let j = low; j < high; j++) {
            // Compare current element with pivot
            this.steps.push(this.createStep(
                StepType.COMPARE,
                [j, high],
                arr,
                `Comparing ${arr[j]} with pivot ${pivot}`,
                false
            ));

            if (arr[j] < pivot) {
                i++;

                if (i !== j) {
                    // Swap elements - user action
                    this.steps.push(this.createStep(
                        StepType.SWAP,
                        [i, j],
                        arr,
                        `${arr[j]} < ${pivot}: Swap ${arr[i]} and ${arr[j]} to move smaller element left`,
                        true  // User must perform this swap
                    ));

                    // Perform the swap
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                } else {
                    this.steps.push(this.createStep(
                        StepType.SELECT,
                        [i],
                        arr,
                        `${arr[i]} < ${pivot}: Element already in correct position`,
                        false
                    ));
                }
            }
        }

        // Place pivot in its final position
        const pivotFinalPos = i + 1;

        if (pivotFinalPos !== high) {
            this.steps.push(this.createStep(
                StepType.SWAP,
                [pivotFinalPos, high],
                arr,
                `Move pivot ${pivot} to its final position by swapping with ${arr[pivotFinalPos]}`,
                true  // User must perform this swap
            ));

            // Perform the swap
            [arr[pivotFinalPos], arr[high]] = [arr[high], arr[pivotFinalPos]];
        }

        return pivotFinalPos;
    }

    /**
     * Validate if user's swap is correct for quick sort
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
            return { valid: true, message: 'Correct! You performed the right partition swap.' };
        }

        return {
            valid: false,
            message: `Incorrect. In Quick Sort partitioning, swap elements to ensure smaller values are left of the pivot.`
        };
    }

    getExplanation() {
        return `
**Quick Sort** is a highly efficient, divide-and-conquer sorting algorithm. It works by selecting a "pivot" element and partitioning the array around it.

### How It Works:
1. **Choose a Pivot**: Select an element as the pivot (we use the last element)
2. **Partition**: Rearrange so elements smaller than pivot are on the left, larger on the right
3. **Recurse**: Apply the same process to the left and right subarrays
4. **Combine**: No explicit combine step needed - array is sorted in place!

### The Partition Process:
- Maintain a partition index
- Iterate through elements, comparing each to the pivot
- When finding a smaller element, swap it to the left side
- Finally, place the pivot between the two groups

### Key Characteristics:
- **Not Stable**: May change relative order of equal elements
- **In-place**: Requires only O(log n) stack space
- **Cache Efficient**: Good locality of reference
- **Average Case Excellent**: Usually faster than merge sort in practice

### When to Use:
- General-purpose sorting when average-case performance matters
- When in-place sorting is preferred
- When cache performance is important
- Avoid for nearly sorted data or data with many duplicates (use 3-way quicksort for duplicates)
        `.trim();
    }

    getPseudocode() {
        return `
procedure quickSort(A, low, high)
    if low < high then
        pivotIndex := partition(A, low, high)
        quickSort(A, low, pivotIndex - 1)   // Sort left of pivot
        quickSort(A, pivotIndex + 1, high)  // Sort right of pivot
    end if
end procedure

procedure partition(A, low, high)
    pivot := A[high]           // Choose last element as pivot
    i := low - 1               // Index of smaller element
    
    for j := low to high - 1 do
        if A[j] < pivot then
            i := i + 1
            swap(A[i], A[j])   // Move smaller element to left
        end if
    end for
    
    swap(A[i + 1], A[high])    // Place pivot in correct position
    return i + 1               // Return pivot's final index
end procedure
        `.trim();
    }

    getExampleWalkthrough() {
        return [
            { array: [10, 80, 30, 90, 40, 50, 70], action: 'Initial array, pivot = 70', highlight: [], pivot: 6 },
            { array: [10, 80, 30, 90, 40, 50, 70], action: '10 < 70, already in position', highlight: [0], pivot: 6 },
            { array: [10, 80, 30, 90, 40, 50, 70], action: '80 > 70, skip', highlight: [1], pivot: 6 },
            { array: [10, 30, 80, 90, 40, 50, 70], action: '30 < 70, swap with 80', highlight: [1, 2], pivot: 6 },
            { array: [10, 30, 80, 90, 40, 50, 70], action: '90 > 70, skip', highlight: [3], pivot: 6 },
            { array: [10, 30, 40, 90, 80, 50, 70], action: '40 < 70, swap with 80', highlight: [2, 4], pivot: 6 },
            { array: [10, 30, 40, 50, 80, 90, 70], action: '50 < 70, swap with 90', highlight: [3, 5], pivot: 6 },
            { array: [10, 30, 40, 50, 70, 90, 80], action: 'Place pivot: swap 80 with 70', highlight: [4, 6], sorted: [4] },
            { array: [10, 30, 40, 50, 70, 90, 80], action: 'Left side [10,30,40,50] already has correct order', highlight: [0, 1, 2, 3], sorted: [0, 1, 2, 3, 4] },
            { array: [10, 30, 40, 50, 70, 80, 90], action: 'Right side: swap 90 and 80', highlight: [5, 6], sorted: [0, 1, 2, 3, 4, 5, 6] },
            { array: [10, 30, 40, 50, 70, 80, 90], action: 'Final sorted array', highlight: [], sorted: [0, 1, 2, 3, 4, 5, 6] }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuickSort };
}
