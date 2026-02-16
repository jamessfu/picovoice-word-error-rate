/**
 * Computes the edit distance matrix between two word arrays.
 *
 * @param props.referenceWords Array of words from the reference sentence.
 * @param props.hypothesisWords Array of words from the hypothesis sentence.
 * @returns 2D array (matrix) of edit distances.
 */

export function buildEditDistanceMatrix(
    props: buildEditDistanceMatrixProps
) {
    const { referenceWords, hypothesisWords } = props

    const numberOfRows = referenceWords.length + 1;
    const numberOfColumns = hypothesisWords.length + 1;

    // Creates a 2D array `numberOfRows x numberOfColumns`
    const editDistanceMatrix: number[][] = Array.from({ length: numberOfRows }, () => Array(numberOfColumns).fill(0));

    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        editDistanceMatrix[rowIndex][0] = rowIndex;
    }

    for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
        editDistanceMatrix[0][columnIndex] = columnIndex;
    }

    for (let rowIndex = 1; rowIndex < numberOfRows; rowIndex++) {
        for (let columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
            const referenceWord = referenceWords[rowIndex - 1];
            const hypothesisWord = hypothesisWords[columnIndex - 1];

            if (referenceWord === hypothesisWord) {
                editDistanceMatrix[rowIndex][columnIndex] =
                    editDistanceMatrix[rowIndex - 1][columnIndex - 1];
            } else {
                editDistanceMatrix[rowIndex][columnIndex] = Math.min(
                    editDistanceMatrix[rowIndex - 1][columnIndex - 1] + 1, // substitution
                    editDistanceMatrix[rowIndex - 1][columnIndex] + 1,     // deletion
                    editDistanceMatrix[rowIndex][columnIndex - 1] + 1      // insertion
                );
            }
        }
    }

    return editDistanceMatrix;
}

export type buildEditDistanceMatrixProps = {
    referenceWords: string[];
    hypothesisWords: string[];
}