import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContentService } from './services/content';
import { ProgressService } from './services/progress';
import { Lesson } from './models/course';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);

  protected readonly course = toSignal(this.content.getCourse());
  protected readonly lessons = computed<Lesson[]>(() => this.course()?.lessons ?? []);

  protected readonly completed = computed(() => {
    const state = this.progress.state();
    return this.lessons().filter((lesson) => {
      const p = state[lesson.id];
      if (!p?.read) return false;
      return lesson.quiz ? !!p.quiz?.passed : true;
    }).length;
  });

  protected readonly percent = computed(() => {
    const total = this.lessons().length;
    return total ? Math.round((this.completed() / total) * 100) : 0;
  });

  protected lessonComplete(lesson: Lesson): boolean {
    const p = this.progress.state()[lesson.id];
    if (!p?.read) return false;
    return lesson.quiz ? !!p.quiz?.passed : true;
  }
}
