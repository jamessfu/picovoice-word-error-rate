import { useEffect, useRef, useState } from "react";
import type { WERResult, AlignmentStep } from "./types";
import { computeWordErrorRate } from "../utils/computeWordErrorRate";
import {
  startAlignmentAnimation,
  stopAlignmentAnimation,
} from "../styles/animation";

const operationColors: Record<string, string> = {
  match: "bg-green-100",
  substitution: "bg-yellow-100",
  deletion: "bg-red-100",
  insertion: "bg-blue-100",
};

export function WordErrorRate() {
  const [referenceSentence, setReferenceSentence] = useState<string>("");
  const [hypothesisSentence, setHypothesisSentence] = useState<string>("");
  const [werResult, setWerResult] = useState<WERResult | null>(null);

  const [currentAlignmentIndex, setCurrentAlignmentIndex] = useState(0);
  const animationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isComputeDisabled =
    !referenceSentence.trim() || !hypothesisSentence.trim();

  const handleCompute = () => {
    const result = computeWordErrorRate({
      referenceSentence,
      hypothesisSentence,
    });

    setWerResult(result);
    setCurrentAlignmentIndex(0);
    stopAlignmentAnimation(animationTimerRef.current);
  };

  const handleStart = () => {
    if (animationTimerRef.current) return;
    animationTimerRef.current = startAlignmentAnimation(() => {
      setCurrentAlignmentIndex((prev) => prev + 1);
    }, 500);
  };

  const handlePause = () => {
    stopAlignmentAnimation(animationTimerRef.current);
  };

  const handleReset = () => {
    stopAlignmentAnimation(animationTimerRef.current);
    setCurrentAlignmentIndex(0);
  };

  useEffect(() => {
    if (!werResult) return;
    if (currentAlignmentIndex >= werResult.alignment.length) {
      stopAlignmentAnimation(animationTimerRef.current);
    }
  }, [currentAlignmentIndex, werResult]);

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Word Error Rate (WER)</h1>

      <label
        htmlFor="referenceSentence"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Reference Sentence
      </label>
      <textarea
        id="referenceSentence"
        className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Reference sentence"
        value={referenceSentence}
        onChange={(e) => setReferenceSentence(e.target.value)}
      />

      <label
        htmlFor="hypothesisSentence"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Hypothesis Sentence
      </label>
      <textarea
        id="hypothesisSentence"
        className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Hypothesis sentence"
        value={hypothesisSentence}
        onChange={(e) => setHypothesisSentence(e.target.value)}
      />

      <div className="flex gap-2 mb-4 justify-between">
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 disabled:bg-gray-700 disabled:cursor-not-allowed"
          onClick={handleCompute}
          disabled={isComputeDisabled}
        >
          Calculate WER
        </button>
        {werResult && (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800"
              onClick={handleStart}
            >
              Start
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
              onClick={handlePause}
            >
              Pause
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {werResult && (
        <>
          <div className="mb-2">
            <strong>WER:</strong> {werResult.wer.toFixed(3)}
          </div>

          <div className="mb-4">
            <div>
              <strong>Substitution:</strong> {werResult.substitutions}
            </div>
            <div>
              <strong>Deletion:</strong> {werResult.deletions}
            </div>
            <div>
              <strong>Insertion:</strong> {werResult.insertions}
            </div>
            <strong>Number of words:</strong> {werResult.referenceLength}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Alignment</h3>

            <div className="flex flex-col gap-2">
              {werResult.alignment.map((step: AlignmentStep, index: number) => (
                <div
                  key={index}
                  className={`${operationColors[step.operation]} rounded-md p-2 transition-opacity duration-300 ${
                    index < currentAlignmentIndex ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <span className="font-semibold capitalize">
                    {step.operation}:{" "}
                  </span>
                  <span className="mr-2">{step.referenceWord ?? "-"}</span> |
                  <span className="ml-2">{step.hypothesisWord ?? "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
