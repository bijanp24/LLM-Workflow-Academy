import { Injectable, signal } from '@angular/core';

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
}

export interface LessonProgress {
  read?: boolean;
  quiz?: QuizResult;
}

export type ProgressState = Record<string, LessonProgress>;

/**
 * Persists per-lesson progress (read + quiz result) to localStorage.
 * No backend — the academy is fully static.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly key = 'lwa-progress';
  private readonly _state = signal<ProgressState>(this.load());
  readonly state = this._state.asReadonly();

  markRead(lessonId: string): void {
    this.update(lessonId, { read: true });
  }

  recordQuiz(lessonId: string, result: QuizResult): void {
    this.update(lessonId, { quiz: result });
  }

  reset(): void {
    this.persist({});
  }

  isRead(lessonId: string): boolean {
    return !!this._state()[lessonId]?.read;
  }

  quizResult(lessonId: string): QuizResult | undefined {
    return this._state()[lessonId]?.quiz;
  }

  private update(lessonId: string, patch: LessonProgress): void {
    const next: ProgressState = { ...this._state() };
    next[lessonId] = { ...next[lessonId], ...patch };
    this.persist(next);
  }

  private persist(state: ProgressState): void {
    this._state.set(state);
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode); progress stays in-memory */
    }
  }

  private load(): ProgressState {
    try {
      return JSON.parse(localStorage.getItem(this.key) ?? '{}') as ProgressState;
    } catch {
      return {};
    }
  }
}
