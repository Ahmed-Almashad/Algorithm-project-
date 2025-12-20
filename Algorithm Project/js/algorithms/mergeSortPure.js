/**
 * ============================================================================
 * MERGE SORT - Pure Implementation
 * ============================================================================
 * 
 * A divide-and-conquer sorting algorithm that divides the input array into
 * two halves, recursively sorts them, and then merges the sorted halves.
 * 
 * Time Complexity:
 *   - Best Case:    O(n log n)
 *   - Average Case: O(n log n)  
 *   - Worst Case:   O(n log n)
 * 
 * Space Complexity: O(n) - requires auxiliary space for merging
 * 
 * Properties:
 *   - Stable: Yes (maintains relative order of equal elements)
 *   - In-place: No (requires O(n) extra space)
 *   - Comparison-based: Yes
 */

/**
 * Main merge sort function
 * Sorts an array in ascending order using the merge sort algorithm
 * 
 * @param {number[]} arr - The array to sort
 * @returns {number[]} - The sorted array
 * 
 * @example
 * const arr = [38, 27, 43, 10];
 * const sorted = mergeSort(arr);
 * console.log(sorted); // [10, 27, 38, 43]
 */
function mergeSort(arr) {
    // Base case: arrays with 0 or 1 element are already sorted
    if (arr.length <= 1) {
        return arr;
    }

    // Divide: Find the middle point and split the array
    const mid = Math.floor(arr.length / 2);
    const leftHalf = arr.slice(0, mid);
    const rightHalf = arr.slice(mid);

    // Conquer: Recursively sort both halves
    const sortedLeft = mergeSort(leftHalf);
    const sortedRight = mergeSort(rightHalf);

    // Combine: Merge the sorted halves
    return merge(sortedLeft, sortedRight);
}

/**
 * Merge two sorted arrays into one sorted array
 * 
 * @param {number[]} left - First sorted array
 * @param {number[]} right - Second sorted array
 * @returns {number[]} - Merged sorted array
 */
function merge(left, right) {
    const result = [];
    let i = 0;  // Index for left array
    let j = 0;  // Index for right array

    // Compare elements from both arrays and add the smaller one
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // Add remaining elements from left array (if any)
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }

    // Add remaining elements from right array (if any)
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
}

/**
 * ============================================================================
 * IN-PLACE MERGE SORT VARIANT
 * ============================================================================
 * 
 * This version sorts the array in-place using indices instead of creating
 * new arrays at each recursion level. More efficient for memory but still
 * requires O(n) auxiliary space for the merge operation.
 */

/**
 * In-place merge sort using indices
 * 
 * @param {number[]} arr - The array to sort (modified in-place)
 * @param {number} left - Left boundary index (default: 0)
 * @param {number} right - Right boundary index (default: arr.length - 1)
 * 
 * @example
 * const arr = [38, 27, 43, 10];
 * mergeSortInPlace(arr, 0, arr.length - 1);
 * console.log(arr); // [10, 27, 38, 43]
 */
function mergeSortInPlace(arr, left = 0, right = arr.length - 1) {
    // Base case: single element or invalid range
    if (left >= right) {
        return;
    }

    // Calculate middle index (avoids integer overflow for large arrays)
    const mid = left + Math.floor((right - left) / 2);

    // Recursively sort left half
    mergeSortInPlace(arr, left, mid);

    // Recursively sort right half
    mergeSortInPlace(arr, mid + 1, right);

    // Merge the sorted halves
    mergeInPlace(arr, left, mid, right);
}

/**
 * Merge two sorted subarrays within the main array
 * 
 * @param {number[]} arr - The main array
 * @param {number} left - Left boundary
 * @param {number} mid - Middle index (end of left subarray)
 * @param {number} right - Right boundary
 */
function mergeInPlace(arr, left, mid, right) {
    // Calculate sizes of the two subarrays
    const n1 = mid - left + 1;
    const n2 = right - mid;

    // Create temporary arrays
    const L = new Array(n1);
    const R = new Array(n2);

    // Copy data to temporary arrays
    for (let i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (let j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }

    // Merge the temporary arrays back into arr[left..right]
    let i = 0;      // Initial index of left subarray
    let j = 0;      // Initial index of right subarray
    let k = left;   // Initial index of merged subarray

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    // Copy remaining elements of L[], if any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    // Copy remaining elements of R[], if any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

/**
 * ============================================================================
 * EXPLANATION OF THE ALGORITHM
 * ============================================================================
 * 
 * DIVIDE AND CONQUER APPROACH:
 * 
 * 1. DIVIDE: Split the array into two halves
 *    - Find the middle index: mid = (left + right) / 2
 *    - Left half: arr[left..mid]
 *    - Right half: arr[mid+1..right]
 * 
 * 2. CONQUER: Recursively sort each half
 *    - Sort the left half
 *    - Sort the right half
 *    - Base case: array of size 0 or 1 is already sorted
 * 
 * 3. COMBINE: Merge the two sorted halves
 *    - Compare elements from both halves
 *    - Always pick the smaller element
 *    - Continue until all elements are merged
 * 
 * EXAMPLE WALKTHROUGH for [38, 27, 43, 10]:
 * 
 * Step 1 - Initial:      [38, 27, 43, 10]
 * 
 * Step 2 - Divide:       [38, 27]  |  [43, 10]
 * 
 * Step 3 - Divide:       [38] [27] |  [43] [10]
 * 
 * Step 4 - Conquer:      Single elements are sorted
 * 
 * Step 5 - Merge:        [27, 38]  |  [10, 43]
 *          (38 vs 27: 27 first, then 38)
 *          (43 vs 10: 10 first, then 43)
 * 
 * Step 6 - Final Merge:  [10, 27, 38, 43]
 *          Compare 27 vs 10: pick 10
 *          Compare 27 vs 43: pick 27
 *          Compare 38 vs 43: pick 38
 *          Pick remaining 43
 * 
 * Result: [10, 27, 38, 43]
 * 
 * 
 * RECURRENCE RELATION:
 * 
 *    T(n) = 2T(n/2) + O(n)
 *         = O(n log n)
 * 
 * Where:
 *    - 2T(n/2): Time to sort two halves
 *    - O(n): Time to merge the halves
 * 
 * 
 * PSEUDOCODE:
 * 
 * procedure mergeSort(A, left, right)
 *     if left >= right then
 *         return
 *     end if
 *     
 *     mid := left + (right - left) / 2
 *     
 *     mergeSort(A, left, mid)        // Sort left half
 *     mergeSort(A, mid + 1, right)   // Sort right half
 *     merge(A, left, mid, right)     // Merge sorted halves
 * end procedure
 * 
 * procedure merge(A, left, mid, right)
 *     n1 := mid - left + 1
 *     n2 := right - mid
 *     
 *     // Create temporary arrays L and R
 *     for i := 0 to n1 - 1 do
 *         L[i] := A[left + i]
 *     for j := 0 to n2 - 1 do
 *         R[j] := A[mid + 1 + j]
 *     
 *     i := 0, j := 0, k := left
 *     
 *     // Merge elements in sorted order
 *     while i < n1 and j < n2 do
 *         if L[i] <= R[j] then
 *             A[k] := L[i]
 *             i := i + 1
 *         else
 *             A[k] := R[j]
 *             j := j + 1
 *         k := k + 1
 *     
 *     // Copy remaining elements
 *     while i < n1 do
 *         A[k] := L[i]
 *         i := i + 1
 *         k := k + 1
 *     
 *     while j < n2 do
 *         A[k] := R[j]
 *         j := j + 1
 *         k := k + 1
 * end procedure
 */

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example 1: Using the simple version
function example1() {
    const arr = [38, 27, 43, 10];
    console.log("Original:", arr);

    const sorted = mergeSort(arr);
    console.log("Sorted:", sorted);
    // Output: [10, 27, 38, 43]
}

// Example 2: Using the in-place version
function example2() {
    const arr = [38, 27, 43, 10];
    console.log("Original:", arr);

    mergeSortInPlace(arr, 0, arr.length - 1);
    console.log("Sorted:", arr);
    // Output: [10, 27, 38, 43]
}

// Example 3: Larger array
function example3() {
    const arr = [12, 11, 13, 5, 6, 7, 3, 2, 1];
    console.log("Original:", arr);

    const sorted = mergeSort(arr);
    console.log("Sorted:", sorted);
    // Output: [1, 2, 3, 5, 6, 7, 11, 12, 13]
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mergeSort, mergeSortInPlace, merge, mergeInPlace };
}
