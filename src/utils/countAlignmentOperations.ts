import type { AlignmentStep } from "../WordErrorRate/types";
import { Operation } from "../WordErrorRate/types";

/**
 * Counts substitutions, deletions, and insertions from alignment steps.
 *
 * @param props Object containing alignment steps.
 * @param props.alignmentSteps Array of alignment steps to count.
 * @returns Counts of substitutions, deletions, and insertions.
 */
export function countAlignmentOperations(props: countAlignmentOperationsProps): AlignmentCounts {
    const { alignmentSteps } = props

    let substitutions = 0;
    let deletions = 0;
    let insertions = 0;

    alignmentSteps.forEach(step => {
        if (step.operation === Operation.Substitution) substitutions++;
        if (step.operation === Operation.Deletion) deletions++;
        if (step.operation === Operation.Insertion) insertions++;
    });

    return { substitutions, deletions, insertions };
}

export type countAlignmentOperationsProps = {
    alignmentSteps: AlignmentStep[]
}

export type AlignmentCounts = {
    substitutions: number;
    deletions: number;
    insertions: number;
};
