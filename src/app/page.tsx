import Link from 'next/link';
import { getAllTopics } from '@/lib/questions';

export default function Home() {
  const topics = getAllTopics();

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-12 text-zinc-900 dark:bg-black dark:text-zinc-100 sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-5">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Early build · AP Biology · v0.1
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Practice AP Biology. Understand every wrong answer.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Pick a topic. Answer ten questions. Every wrong answer comes with a worked explanation
            in plain language — no &quot;just memorize this&quot;. Built for the May 2027 AP Bio
            exam.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/practice/"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:focus:ring-offset-black"
            >
              Start practicing →
            </Link>
            <a
              href="https://github.com/baobkt/exm-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700"
            >
              See the code
            </a>
          </div>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
            Topics available
          </h2>
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
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {topic.title}
                      </h3>
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
        </section>

        <footer className="mt-4 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          v0.1 — pre-baked AI explanations. Live conversational tutoring coming in v0.2.
        </footer>
      </div>
    </main>
  );
}
