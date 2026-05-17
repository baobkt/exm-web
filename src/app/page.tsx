export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Early build · AP Biology
        </div>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Targeted AP prep. Real explanations. No fluff.
        </h1>

        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          We&apos;re building an AI tutor for AP Biology that picks the next question worth
          answering and explains every wrong one in plain language. Aiming for the May 2027 exam
          cycle.
        </p>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">What works today</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Static hello-world deploy</li>
            <li>Continuous integration on every push</li>
            <li>Repo a new contributor can clone, run, and deploy</li>
          </ul>
          <p className="mt-4 font-medium text-zinc-900 dark:text-zinc-100">Up next</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Question bank + adaptive practice loop</li>
            <li>Claude-powered explanations</li>
            <li>Score-trajectory dashboard</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
