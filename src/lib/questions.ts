import questionBank from '@/content/questions.json';

export type Question = {
  id: string;
  prompt: string;
  choices: { id: string; text: string }[];
  correctChoiceId: string;
  explanation: string;
};

export type Topic = {
  slug: string;
  title: string;
  unit: string;
  blurb: string;
  questions: Question[];
};

const topics = questionBank.topics as Topic[];

export function getAllTopics(): Topic[] {
  return topics;
}

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
