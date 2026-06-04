import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/catalog-home/catalog-home').then((m) => m.CatalogHome)
  },
  {
    path: 'course/:courseId',
    loadComponent: () => import('./pages/course-home/course-home').then((m) => m.CourseHome)
  },
  {
    path: 'course/:courseId/lesson/:lessonId',
    loadComponent: () => import('./pages/lesson-view/lesson-view').then((m) => m.LessonView)
  },
  { path: '**', redirectTo: '' }
];
