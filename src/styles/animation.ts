/**
 * Starts a step-based animation loop.
 */
export function startAlignmentAnimation(
    onStepAdvance: () => void,
    delayMs: number
): ReturnType<typeof setInterval> {

    return setInterval(onStepAdvance, delayMs);
}

/**
 * Stops animation loop.
 */
export function stopAlignmentAnimation(
    timerId: ReturnType<typeof setInterval> | null
) {
    if (timerId !== null) {
        clearInterval(timerId);
    }
}
