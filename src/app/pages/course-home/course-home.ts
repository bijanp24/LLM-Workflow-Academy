import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

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
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);

  protected readonly course = toSignal(this.content.getCourse());

  protected readonly firstLessonId = computed(() => this.course()?.lessons[0]?.id ?? null);

  protected lessonComplete(lesson: Lesson): boolean {
    const p = this.progress.state()[lesson.id];
    if (!p?.read) return false;
    return lesson.quiz ? !!p.quiz?.passed : true;
  }
}
