import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';

import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';
import { QuizPlayer } from '../../components/quiz/quiz';

@Component({
  selector: 'app-lesson-view',
  imports: [RouterLink, MarkdownComponent, QuizPlayer],
  templateUrl: './lesson-view.html',
  styleUrl: './lesson-view.scss'
})
export class LessonView {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  private readonly progress = inject(ProgressService);

  protected readonly courseId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('courseId') ?? '')),
    { initialValue: '' }
  );

  private readonly lessonId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('lessonId') ?? '')),
    { initialValue: '' }
  );

  protected readonly course = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('courseId') ?? ''),
      switchMap((id) => this.content.getCourseById(id))
    )
  );

  protected readonly lessons = computed(() => this.course()?.lessons ?? []);
  protected readonly index = computed(() => this.lessons().findIndex((l) => l.id === this.lessonId()));
  protected readonly lesson = computed(() => this.lessons()[this.index()] ?? null);
  protected readonly docUrl = computed(() => {
    const l = this.lesson();
    return l ? this.content.docUrl(l) : '';
  });

  protected readonly prev = computed(() => this.lessons()[this.index() - 1] ?? null);
  protected readonly next = computed(() => this.lessons()[this.index() + 1] ?? null);

  protected onReady(): void {
    const l = this.lesson();
    if (l) this.progress.markRead(this.courseId(), l.id);
  }
}
