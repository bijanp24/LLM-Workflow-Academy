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
 *
 * Keys are namespaced as "{courseId}/{lessonId}" to avoid collisions across
 * courses that might share lesson IDs.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly storageKey = 'lwa-progress-v2';
  private readonly _state = signal<ProgressState>(this.load());
  readonly state = this._state.asReadonly();

  /** Builds the namespaced key used for storage lookups. */
  lessonKey(courseId: string, lessonId: string): string {
    return `${courseId}/${lessonId}`;
  }

  markRead(courseId: string, lessonId: string): void {
    this.update(this.lessonKey(courseId, lessonId), { read: true });
  }

  recordQuiz(courseId: string, lessonId: string, result: QuizResult): void {
    this.update(this.lessonKey(courseId, lessonId), { quiz: result });
  }

  reset(): void {
    this.persist({});
  }

  isRead(courseId: string, lessonId: string): boolean {
    return !!this._state()[this.lessonKey(courseId, lessonId)]?.read;
  }

  quizResult(courseId: string, lessonId: string): QuizResult | undefined {
    return this._state()[this.lessonKey(courseId, lessonId)]?.quiz;
  }

  private update(key: string, patch: LessonProgress): void {
    const next: ProgressState = { ...this._state() };
    next[key] = { ...next[key], ...patch };
    this.persist(next);
  }

  private persist(state: ProgressState): void {
    this._state.set(state);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode); progress stays in-memory */
    }
  }

  private load(): ProgressState {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) ?? '{}') as ProgressState;
    } catch {
      return {};
    }
  }
}
