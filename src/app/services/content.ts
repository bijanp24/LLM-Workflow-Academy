import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Course, Lesson, Quiz } from '../models/course';

/**
 * Loads course content served from the `LLM-Workflow` git submodule.
 * The submodule's markdown + JSON are copied to `/content` at build time
 * (see angular.json assets), preserving their repo-relative paths.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly base = 'content';

  private readonly course$ = this.http
    .get<Course>(`${this.base}/course.json`)
    .pipe(shareReplay(1));

  getCourse(): Observable<Course> {
    return this.course$;
  }

  /** Absolute (app-rooted) URL of a lesson's markdown doc. */
  docUrl(lesson: Lesson): string {
    return `${this.base}/${lesson.doc}`;
  }

  getQuiz(quizPath: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.base}/${quizPath}`);
  }
}
