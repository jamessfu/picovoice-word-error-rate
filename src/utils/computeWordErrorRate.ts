import type { WERResult } from "../WordErrorRate/types";
import { tokenize } from "./tokenize";
import { buildEditDistanceMatrix } from "./buildEditDistanceMatrix";
import { backtrackAlignmentSteps } from "./backtrackAlignmentSteps"
import { countAlignmentOperations } from "./countAlignmentOperations"

/**
 * Computes the Word Error Rate (WER) between hypothesis and reference.
 *
 * @param props Object with reference and hypothesis sentences.
 * @param props.referenceSentence The correct sentence.
 * @param props.hypothesisSentence The sentence to compare.
 * @returns WER, counts of substitutions, deletions, insertions, reference length, and alignment steps.
 */
export function computeWordErrorRate(props: computeWordErrorRateProps): WERResult {

    const { referenceSentence, hypothesisSentence } = props

    const referenceWords = tokenize({ sentence: referenceSentence });
    const hypothesisWords = tokenize({ sentence: hypothesisSentence });

    // Compute edit distance and alignment
    const editDistanceMatrix = buildEditDistanceMatrix({ referenceWords, hypothesisWords });
    const alignment = backtrackAlignmentSteps({ editDistanceMatrix, referenceWords, hypothesisWords });

    // Count operations
    const { substitutions, deletions, insertions } = countAlignmentOperations({ alignmentSteps: alignment });

    /**
     * Compute WER (word error rate) calculation
     * WER = (S + D + I) / N
     */
    const wer = referenceWords.length ? (substitutions + deletions + insertions) / referenceWords.length : 0;

    return {
        wer,
        substitutions,
        deletions,
        insertions,
        referenceLength: referenceWords.length,
        alignment,
    };
}

export type computeWordErrorRateProps = {
    referenceSentence: string;
    hypothesisSentence: string;
}