'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Topic } from '@/lib/questions';

type SessionState = 'in-progress' | 'finished';

type Answer = {
  questionId: string;
  selectedChoiceId: string;
  isCorrect: boolean;
};

export function PracticeSession({ topic }: { topic: Topic }) {
  const questions = topic.questions;
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>('in-progress');

  const currentQuestion = questions[currentIndex];
  const correctCount = useMemo(() => answers.filter((a) => a.isCorrect).length, [answers]);

  if (sessionState === 'finished') {
    return <ResultsScreen topic={topic} answers={answers} onRetry={handleRetry} />;
  }

  function handleSelect(choiceId: string) {
    if (revealed) return;
    setSelectedChoiceId(choiceId);
  }

  function handleSubmit() {
    if (!selectedChoiceId || revealed) return;
    const isCorrect = selectedChoiceId === currentQuestion.correctChoiceId;
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedChoiceId, isCorrect },
    ]);
    setRevealed(true);
  }

  function handleNext() {
    if (currentIndex + 1 >= totalQuestions) {
      setSessionState('finished');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedChoiceId(null);
    setRevealed(false);
  }

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedChoiceId(null);
    setRevealed(false);
    setSessionState('in-progress');
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar current={currentIndex + 1} total={totalQuestions} correctSoFar={correctCount} />

      <article className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <h2 className="text-lg font-medium leading-7 text-zinc-900 dark:text-zinc-100 sm:text-xl">
          {currentQuestion.prompt}
        </h2>

        <ul className="flex flex-col gap-2.5">
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const isCorrect = choice.id === currentQuestion.correctChoiceId;
            const showCorrect = revealed && isCorrect;
            const showIncorrect = revealed && isSelected && !isCorrect;

            return (
              <li key={choice.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(choice.id)}
                  disabled={revealed}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition sm:text-base ${
                    showCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-100'
                      : showIncorrect
                        ? 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-100'
                        : isSelected
                          ? 'border-emerald-400 bg-emerald-50 text-zinc-900 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-zinc-100'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-700'
                  } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      showCorrect
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : showIncorrect
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : isSelected
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                    }`}
                    aria-hidden
                  >
                    {choice.id.toUpperCase()}
                  </span>
                  <span className="flex-1 leading-6">{choice.text}</span>
                  {showCorrect ? <span aria-hidden>✓</span> : null}
                  {showIncorrect ? <span aria-hidden>✗</span> : null}
                </button>
              </li>
            );
          })}
        </ul>

        {revealed ? (
          <Explanation
            isCorrect={selectedChoiceId === currentQuestion.correctChoiceId}
            explanation={currentQuestion.explanation}
          />
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Link
            href="/practice/"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700"
          >
            ← Change topic
          </Link>
          {revealed ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:focus:ring-offset-black"
            >
              {currentIndex + 1 >= totalQuestions ? 'See results' : 'Next question'} →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedChoiceId}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600 dark:focus:ring-offset-black"
            >
              Submit answer
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

function ProgressBar({
  current,
  total,
  correctSoFar,
}: {
  current: number;
  total: number;
  correctSoFar: number;
}) {
  const percent = Math.min(100, Math.max(0, ((current - 1) / total) * 100));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500">
        <span>
          {current} / {total}
        </span>
        <span>{correctSoFar} correct so far</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Explanation({ isCorrect, explanation }: { isCorrect: boolean; explanation: string }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isCorrect
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
          : 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30'
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wider ${
          isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
        }`}
      >
        {isCorrect ? 'Correct' : 'Not quite — here is why'}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">{explanation}</p>
    </div>
  );
}

function ResultsScreen({
  topic,
  answers,
  onRetry,
}: {
  topic: Topic;
  answers: Answer[];
  onRetry: () => void;
}) {
  const total = topic.questions.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const percent = Math.round((correct / total) * 100);
  const wrongAnswers = answers.filter((a) => !a.isCorrect);
  const wrongQuestions = wrongAnswers
    .map((a) => topic.questions.find((q) => q.id === a.questionId))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const headline =
    percent >= 80
      ? 'Strong session.'
      : percent >= 50
        ? 'Good progress.'
        : 'Plenty to learn from this one.';

  return (
    <div className="flex flex-col gap-7">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Session complete · {topic.title}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          {correct} / {total} <span className="text-zinc-400 dark:text-zinc-600">({percent}%)</span>
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">{headline}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            Retry this topic
          </button>
          <Link
            href="/practice/"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700"
          >
            Pick a different topic
          </Link>
        </div>
      </section>

      {wrongQuestions.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
            Worth revisiting ({wrongQuestions.length})
          </h3>
          <ul className="flex flex-col gap-3">
            {wrongQuestions.map((q) => {
              const answer = answers.find((a) => a.questionId === q.id)!;
              const yourChoice = q.choices.find((c) => c.id === answer.selectedChoiceId);
              const correctChoice = q.choices.find((c) => c.id === q.correctChoiceId);
              return (
                <li
                  key={q.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{q.prompt}</p>
                  <dl className="mt-3 flex flex-col gap-1 text-sm">
                    <div className="flex gap-2 text-rose-700 dark:text-rose-300">
                      <dt className="shrink-0 font-semibold">Your answer:</dt>
                      <dd>{yourChoice?.text}</dd>
                    </div>
                    <div className="flex gap-2 text-emerald-700 dark:text-emerald-300">
                      <dt className="shrink-0 font-semibold">Correct:</dt>
                      <dd>{correctChoice?.text}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {q.explanation}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
          Clean sweep — every question correct on this topic. Time to try another.
        </section>
      )}
    </div>
  );
}
