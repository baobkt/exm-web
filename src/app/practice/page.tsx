import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllTopics } from '@/lib/questions';
import { TopicSelectTelemetry } from '@/components/TopicSelectTelemetry';

export const metadata: Metadata = {
  title: 'Pick a topic · AP Biology Practice',
  description: 'Choose an AP Biology topic to start a ten-question practice session.',
};

export default function PracticeIndex() {
  const topics = getAllTopics();

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-10 text-zinc-900 dark:bg-black dark:text-zinc-100 sm:px-6 sm:py-14">
      <TopicSelectTelemetry topicCount={topics.length} />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <nav className="text-xs text-zinc-500 dark:text-zinc-500">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            ← Home
          </Link>
        </nav>

        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Pick a topic to practice
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Each session is ten multiple-choice questions. You can change topic any time.
          </p>
        </header>

        <ul className="flex flex-col gap-3">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={`/practice/${topic.slug}/`}
                className="group block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {topic.unit}
                    </p>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {topic.title}
                    </h2>
                    <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {topic.blurb}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:text-zinc-600 dark:group-hover:text-emerald-400"
                  >
                    →
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
                  <span>{topic.questions.length} questions</span>
                  <span aria-hidden>·</span>
                  <span>~10 min</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
