import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';
import { MultipleChoiceQuestion, Question } from '../../models/course';

type AnswerValue = number | boolean;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss'
})
export class QuizPlayer {
  private readonly content = inject(ContentService);
  private readonly progress = inject(ProgressService);

  readonly quizPath = input.required<string>();
  readonly lessonId = input.required<string>();

  protected readonly quiz = toSignal(
    toObservable(this.quizPath).pipe(switchMap((path) => this.content.getQuiz(path))),
    { initialValue: null }
  );

  protected readonly answers = signal<Record<string, AnswerValue>>({});
  protected readonly submitted = signal(false);

  protected readonly allAnswered = computed(() => {
    const q = this.quiz();
    if (!q) return false;
    const a = this.answers();
    return q.questions.every((question) => a[question.id] !== undefined);
  });

  protected readonly result = computed(() => {
    const q = this.quiz();
    if (!q) return null;
    const a = this.answers();
    const score = q.questions.filter((question) => a[question.id] === question.answer).length;
    const total = q.questions.length;
    return { score, total, passed: score / total >= q.passingScore };
  });

  protected select(questionId: string, value: AnswerValue): void {
    if (this.submitted()) return;
    this.answers.update((a) => ({ ...a, [questionId]: value }));
  }

  protected isSelected(questionId: string, value: AnswerValue): boolean {
    return this.answers()[questionId] === value;
  }

  protected isCorrect(question: Question): boolean {
    return this.answers()[question.id] === question.answer;
  }

  protected options(question: Question): string[] {
    return (question as MultipleChoiceQuestion).options;
  }

  protected submit(): void {
    if (!this.allAnswered()) return;
    this.submitted.set(true);
    const r = this.result();
    if (r) this.progress.recordQuiz(this.lessonId(), r);
  }

  protected retry(): void {
    this.submitted.set(false);
    this.answers.set({});
  }
}
