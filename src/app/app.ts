import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith, switchMap, of } from 'rxjs';

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
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);

  private readonly courseId$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map((e) => e.urlAfterRedirects),
    startWith(this.router.url),
    map((url) => {
      const match = url.match(/^\/course\/([^/]+)/);
      return match ? match[1] : null;
    })
  );

  protected readonly courseId = toSignal(this.courseId$, {
    initialValue: this.extractCourseId(this.router.url)
  });

  protected readonly catalog = toSignal(this.content.getCatalog());

  protected readonly activeCourse = toSignal(
    this.courseId$.pipe(
      switchMap((id) => (id ? this.content.getCourseById(id) : of(null)))
    )
  );

  protected readonly lessons = computed<Lesson[]>(() => this.activeCourse()?.lessons ?? []);

  protected readonly completed = computed(() => {
    const cId = this.courseId();
    if (!cId) return 0;
    const state = this.progress.state();
    return this.lessons().filter((lesson) => {
      const p = state[this.progress.lessonKey(cId, lesson.id)];
      if (!p?.read) return false;
      return lesson.quiz ? !!p.quiz?.passed : true;
    }).length;
  });

  protected readonly percent = computed(() => {
    const total = this.lessons().length;
    return total ? Math.round((this.completed() / total) * 100) : 0;
  });

  protected lessonComplete(lesson: Lesson): boolean {
    const cId = this.courseId();
    if (!cId) return false;
    const p = this.progress.state()[this.progress.lessonKey(cId, lesson.id)];
    if (!p?.read) return false;
    return lesson.quiz ? !!p.quiz?.passed : true;
  }

  private extractCourseId(url: string): string | null {
    const match = url.match(/^\/course\/([^/]+)/);
    return match ? match[1] : null;
  }
}
