import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay, switchMap, map } from 'rxjs';
import { Catalog, Course, Lesson, Quiz } from '../models/course';

/**
 * Loads course content served from the `LLM-Workflow` git submodule, the single
 * source of static content. Its files are copied to `/content` at build time
 * (see angular.json assets), preserving their repo-relative paths. The master
 * `catalog.json` lives at the content root and lists every course.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly base = 'content';

  private readonly catalog$ = this.http
    .get<Catalog>(`${this.base}/catalog.json`)
    .pipe(shareReplay(1));

  private readonly courseCache = new Map<string, Observable<Course>>();

  getCatalog(): Observable<Catalog> {
    return this.catalog$;
  }

  getCourseById(courseId: string): Observable<Course> {
    const cached = this.courseCache.get(courseId);
    if (cached) return cached;

    const course$ = this.catalog$.pipe(
      map((catalog) => {
        const summary = catalog.courses.find((c) => c.id === courseId);
        if (!summary) throw new Error(`Course not found: ${courseId}`);
        return summary.manifest;
      }),
      switchMap((manifest) => this.http.get<Course>(`${this.base}/${manifest}`)),
      shareReplay(1)
    );
    this.courseCache.set(courseId, course$);
    return course$;
  }

  /** Absolute (app-rooted) URL of a lesson's markdown doc. */
  docUrl(lesson: Lesson): string {
    return `${this.base}/${lesson.doc}`;
  }

  getQuiz(quizPath: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.base}/${quizPath}`);
  }
}
