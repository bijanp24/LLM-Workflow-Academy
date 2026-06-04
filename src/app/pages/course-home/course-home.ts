import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs';

import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';
import { Lesson } from '../../models/course';

@Component({
  selector: 'app-course-home',
  imports: [RouterLink],
  templateUrl: './course-home.html',
  styleUrl: './course-home.scss'
})
export class CourseHome {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);

  protected readonly courseId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('courseId') ?? '')),
    { initialValue: '' }
  );

  protected readonly course = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('courseId') ?? ''),
      switchMap((id) => this.content.getCourseById(id))
    )
  );

  protected readonly firstLessonId = computed(() => this.course()?.lessons[0]?.id ?? null);

  protected lessonComplete(lesson: Lesson): boolean {
    const p = this.progress.state()[this.progress.lessonKey(this.courseId(), lesson.id)];
    if (!p?.read) return false;
    return lesson.quiz ? !!p.quiz?.passed : true;
  }

  protected quizResult(lesson: Lesson) {
    return this.progress.quizResult(this.courseId(), lesson.id);
  }
}
