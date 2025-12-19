/**
 * Merge Sort Algorithm with Step Tracking
 * Time Complexity: O(n log n) for all cases
 * Space Complexity: O(n)
 * 
 * Divides the array into halves recursively, then merges the sorted halves.
 * A divide-and-conquer algorithm.
 */
class MergeSort extends SortingAlgorithm {
    constructor() {
        super(
            'Merge Sort',
            { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
            'O(n)'
        );
        this.workingArray = [];
    }

    /**
     * Generate all steps for merge sort
     * @param {number[]} inputArray - The array to sort
     * @returns {Step[]} Array of step objects
     */
    generateSteps(inputArray) {
        this.reset();
        this.workingArray = [...inputArray];

        // Start the merge sort
        this.mergeSortRecursive(0, this.workingArray.length - 1);

        // Mark all as sorted at the end
        for (let i = 0; i < this.workingArray.length; i++) {
            this.steps.push(this.createStep(
                StepType.SORTED,
                [i],
                this.workingArray,
                `Array is completely sorted`,
                false
            ));
        }

        return this.steps;
    }

    /**
     * Recursive merge sort with step tracking
     * Using left + (right - left) / 2 to avoid overflow
     * @param {number} left - Left boundary
     * @param {number} right - Right boundary
     */
    mergeSortRecursive(left, right) {
        if (left >= right) {
            return;
        }

        // Calculate mid using the safer formula
        const mid = left + Math.floor((right - left) / 2);

        // Record the divide step
        const leftPart = this.workingArray.slice(left, mid + 1);
        const rightPart = this.workingArray.slice(mid + 1, right + 1);

        this.steps.push(this.createStep(
            StepType.DIVIDE,
            [left, right],
            [...this.workingArray],
            `Divide: [${leftPart.join(', ')}] and [${rightPart.join(', ')}]`,
            false
        ));

        // Recursively sort left half
        this.mergeSortRecursive(left, mid);

        // Recursively sort right half
        this.mergeSortRecursive(mid + 1, right);

        // Merge the sorted halves
        this.merge(left, mid, right);
    }

    /**
     * Merge two sorted subarrays with step tracking
     * Following the standard merge sort algorithm
     * @param {number} left - Left boundary
     * @param {number} mid - Middle index
     * @param {number} right - Right boundary
     */
    merge(left, mid, right) {
        // Calculate sizes of the two subarrays
        const n1 = mid - left + 1;
        const n2 = right - mid;

        // Create temporary arrays
        const L = [];
        const R = [];

        // Copy data to temp arrays
        for (let i = 0; i < n1; i++) {
            L[i] = this.workingArray[left + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = this.workingArray[mid + 1 + j];
        }

        this.steps.push(this.createStep(
            StepType.MERGE,
            [left, right],
            [...this.workingArray],
            `Merging [${L.join(', ')}] and [${R.join(', ')}]`,
            false
        ));

        let i = 0;  // Initial index of first subarray
        let j = 0;  // Initial index of second subarray
        let k = left;  // Initial index of merged subarray

        // Merge the temp arrays back into workingArray[left..right]
        while (i < n1 && j < n2) {
            // Compare elements from both arrays
            this.steps.push(this.createStep(
                StepType.COMPARE,
                [left + i, mid + 1 + j],
                [...this.workingArray],
                `Comparing ${L[i]} and ${R[j]}`,
                false
            ));

            if (L[i] <= R[j]) {
                // Place element from left array
                this.steps.push(this.createStep(
                    StepType.SELECT,
                    [k],
                    [...this.workingArray],
                    `Place ${L[i]} at position ${k} (smaller/equal from left subarray)`,
                    true  // User must select correct element
                ));
                this.workingArray[k] = L[i];
                i++;
            } else {
                // Place element from right array
                this.steps.push(this.createStep(
                    StepType.SELECT,
                    [k],
                    [...this.workingArray],
                    `Place ${R[j]} at position ${k} (smaller from right subarray)`,
                    true  // User must select correct element
                ));
                this.workingArray[k] = R[j];
                j++;
            }
            k++;
        }

        // Copy remaining elements of L[], if any
        while (i < n1) {
            this.steps.push(this.createStep(
                StepType.SELECT,
                [k],
                [...this.workingArray],
                `Place remaining ${L[i]} at position ${k}`,
                true
            ));
            this.workingArray[k] = L[i];
            i++;
            k++;
        }

        // Copy remaining elements of R[], if any
        while (j < n2) {
            this.steps.push(this.createStep(
                StepType.SELECT,
                [k],
                [...this.workingArray],
                `Place remaining ${R[j]} at position ${k}`,
                true
            ));
            this.workingArray[k] = R[j];
            j++;
            k++;
        }
    }

    /**
     * Validate if user's selection is correct for merge sort
     * @param {number} stepIndex - Current step index
     * @param {Object} userAction - {type: 'select', value: number}
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

        if (userAction.type !== 'select') {
            return { valid: false, message: 'Expected a selection action' };
        }

        // For merge sort, user selects which value to place
        const expectedValue = step.values[0];

        if (userAction.value === expectedValue) {
            return { valid: true, message: 'Correct! You selected the right element for the merge.' };
        }

        return {
            valid: false,
            message: `Incorrect. In Merge Sort, always pick the smaller element from the two sorted subarrays.`
        };
    }

    getExplanation() {
        return `
**Merge Sort** is an efficient, divide-and-conquer sorting algorithm. It divides the array into smaller subarrays, sorts them, and then merges them back together.

### How It Works:
1. **Divide**: Split the array into two halves until each subarray has one element
2. **Conquer**: Each single-element subarray is already sorted
3. **Merge**: Merge the sorted subarrays back together in sorted order

### The Merge Process:
- Create temporary arrays for left and right halves
- Compare elements from both sorted subarrays
- Pick the smaller element and place it in the result
- Repeat until all elements are merged

### Key Characteristics:
- **Stable**: Equal elements maintain their relative order
- **Not In-place**: Requires O(n) additional space
- **Consistent Performance**: Always O(n log n), regardless of input
- **Parallelizable**: Can be efficiently parallelized

### When to Use:
- Large datasets where consistent performance is needed
- When stability is required
- External sorting (data on disk that doesn't fit in memory)
- Linked list sorting (no random access penalty)
        `.trim();
    }

    getPseudocode() {
        return `
procedure mergeSort(A, left, right)
    if left >= right then
        return
    end if
    
    mid := left + (right - left) / 2
    
    mergeSort(A, left, mid)       // Sort left half
    mergeSort(A, mid+1, right)    // Sort right half
    merge(A, left, mid, right)    // Merge sorted halves
end procedure

procedure merge(A, left, mid, right)
    n1 := mid - left + 1
    n2 := right - mid
    
    // Create temp arrays L and R
    for i := 0 to n1-1 do
        L[i] := A[left + i]
    end for
    for j := 0 to n2-1 do
        R[j] := A[mid + 1 + j]
    end for
    
    i := 0, j := 0, k := left
    
    // Merge elements in sorted order
    while i < n1 and j < n2 do
        if L[i] <= R[j] then
            A[k] := L[i]
            i := i + 1
        else
            A[k] := R[j]
            j := j + 1
        end if
        k := k + 1
    end while
    
    // Copy remaining elements of L[]
    while i < n1 do
        A[k] := L[i]
        i := i + 1
        k := k + 1
    end while
    
    // Copy remaining elements of R[]
    while j < n2 do
        A[k] := R[j]
        j := j + 1
        k := k + 1
    end while
end procedure
        `.trim();
    }

    getExampleWalkthrough() {
        return [
            { array: [38, 27, 43, 10], action: 'Initial array [38, 27, 43, 10]', highlight: [], sorted: [] },
            { array: [38, 27, 43, 10], action: 'Divide: [38, 27] and [43, 10]', highlight: [0, 1, 2, 3], divide: [1, 2] },
            { array: [38, 27, 43, 10], action: 'Divide: [38] and [27]', highlight: [0, 1], divide: [0, 1] },
            { array: [38, 27, 43, 10], action: '[38] is already sorted (single element)', highlight: [0], sorted: [0] },
            { array: [38, 27, 43, 10], action: '[27] is already sorted (single element)', highlight: [1], sorted: [1] },
            { array: [27, 38, 43, 10], action: 'Merge [38] and [27] → [27, 38]', highlight: [0, 1], sorted: [0, 1] },
            { array: [27, 38, 43, 10], action: 'Divide: [43] and [10]', highlight: [2, 3], divide: [2, 3] },
            { array: [27, 38, 10, 43], action: 'Merge [43] and [10] → [10, 43]', highlight: [2, 3], sorted: [0, 1, 2, 3] },
            { array: [10, 27, 38, 43], action: 'Final merge: [27, 38] and [10, 43] → [10, 27, 38, 43]', highlight: [], sorted: [0, 1, 2, 3] }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MergeSort };
}
