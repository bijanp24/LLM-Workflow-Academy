export type QuestionType = 'multiple-choice' | 'true-false';

interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  /** 0-based index into options */
  answer: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  answer: boolean;
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion;

export interface Quiz {
  id: string;
  title: string;
  /** fraction (0–1) of correct answers required to pass */
  passingScore: number;
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  /** path to the markdown doc, relative to the content repo root */
  doc: string;
  /** path to the quiz JSON, or null for a reading-only lesson */
  quiz: string | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  version: string;
  lessons: Lesson[];
}
