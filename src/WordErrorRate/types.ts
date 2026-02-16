export const Operation = {
    Match: "match",
    Substitution: "substitution",
    Deletion: "deletion",
    Insertion: "insertion",
} as const;

export type Operation = typeof Operation[keyof typeof Operation];

export type AlignmentStep = {
    operation: Operation;
    referenceWord?: string;
    hypothesisWord?: string;
}

export type WERResult = {
    wer: number;
    substitutions: number;
    deletions: number;
    insertions: number;
    referenceLength: number;
    alignment: AlignmentStep[];
}