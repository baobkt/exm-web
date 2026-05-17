import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PracticeSession } from '@/components/PracticeSession';
import { getAllTopics, getTopic } from '@/lib/questions';

export function generateStaticParams() {
  return getAllTopics().map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic) {
    return { title: 'Topic not found · AP Biology Practice' };
  }
  return {
    title: `${topic.title} · AP Biology Practice`,
    description: topic.blurb,
  };
}

export default async function TopicPracticePage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-10 text-zinc-900 dark:bg-black dark:text-zinc-100 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <nav className="text-xs text-zinc-500 dark:text-zinc-500">
          <Link href="/practice/" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            ← All topics
          </Link>
        </nav>

        <header className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {topic.unit}
          </p>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            {topic.title}
          </h1>
        </header>

        <PracticeSession topic={topic} />
      </div>
    </main>
  );
}
