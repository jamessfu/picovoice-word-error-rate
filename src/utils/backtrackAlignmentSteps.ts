import type { AlignmentStep } from "../WordErrorRate/types";
import { Operation } from "../WordErrorRate/types";

/**
 * Finds out how two sentences differ word by word.
 *
 * Responsibility: etermines the sequence of alignment operations.
 *
 * @param props.editDistanceMatrix 2D array computed by `buildEditDistanceMatrix`.
 * @param props.referenceWords Array of words from the reference sentence.
 * @param props.hypothesisWords Array of words from the hypothesis sentence.
 * @returns Array of `AlignmentStep` objects describing the word-by-word alignment.
 */
export function backtrackAlignmentSteps(props: backtrackAlignmentStepsProps): AlignmentStep[] {

    const { editDistanceMatrix, referenceWords, hypothesisWords } = props

    const alignmentSteps: AlignmentStep[] = [];

    // Start from bottom-right of the matrix
    let referenceIndex = referenceWords.length;
    let hypothesisIndex = hypothesisWords.length;

    // Helper functions for determining operation type
    const currentRefWord = () => (referenceIndex > 0 ? referenceWords[referenceIndex - 1] : undefined);
    const currentHypWord = () => (hypothesisIndex > 0 ? hypothesisWords[hypothesisIndex - 1] : undefined);


    const isMatch = () =>
        referenceIndex > 0 &&
        hypothesisIndex > 0 &&
        currentRefWord() === currentHypWord() &&
        editDistanceMatrix[referenceIndex][hypothesisIndex] ===
        editDistanceMatrix[referenceIndex - 1][hypothesisIndex - 1];

    const isSubstitution = () =>
        referenceIndex > 0 &&
        hypothesisIndex > 0 &&
        editDistanceMatrix[referenceIndex][hypothesisIndex] ===
        editDistanceMatrix[referenceIndex - 1][hypothesisIndex - 1] + 1;

    const isDeletion = () =>
        referenceIndex > 0 &&
        editDistanceMatrix[referenceIndex][hypothesisIndex] ===
        editDistanceMatrix[referenceIndex - 1][hypothesisIndex] + 1;

    const isInsertion = () =>
        hypothesisIndex > 0 &&
        editDistanceMatrix[referenceIndex][hypothesisIndex] ===
        editDistanceMatrix[referenceIndex][hypothesisIndex - 1] + 1;

    while (referenceIndex > 0 || hypothesisIndex > 0) {
        if (isMatch()) {
            alignmentSteps.unshift({
                operation: Operation.Match,
                referenceWord: currentRefWord(),
                hypothesisWord: currentHypWord(),
            });
            referenceIndex--;
            hypothesisIndex--;
            continue;
        }

        if (isSubstitution()) {
            alignmentSteps.unshift({
                operation: Operation.Substitution,
                referenceWord: currentRefWord(),
                hypothesisWord: currentHypWord(),
            });
            referenceIndex--;
            hypothesisIndex--;
            continue;
        }

        if (isDeletion()) {
            alignmentSteps.unshift({
                operation: Operation.Deletion,
                referenceWord: currentRefWord(),
            });
            referenceIndex--;
            continue;
        }

        if (isInsertion()) {
            alignmentSteps.unshift({
                operation: Operation.Insertion,
                hypothesisWord: currentHypWord(),
            });
            hypothesisIndex--;
            continue;
        }

        // Safety fallback
        console.warn("Unexpected backtracking state", { referenceIndex, hypothesisIndex });
        break;
    }

    return alignmentSteps;
}

export type backtrackAlignmentStepsProps = {
    editDistanceMatrix: number[][];
    referenceWords: string[];
    hypothesisWords: string[];
};