/**
 * Splits a sentence into an array of lowercase words for word-level processing.
 *
 * @param props The input object to be tokenized.
 * @param props.sentence The sentence string to be tokenized.
 * @returns An array of words in lowercase, with extra whitespace removed.
 */
export function tokenize(props: tokenizeProps): string[] {
    const { sentence } = props;

    return sentence
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
}

export type tokenizeProps = {
    sentence: string
}
