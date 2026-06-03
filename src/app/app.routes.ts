import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/course-home/course-home').then((m) => m.CourseHome)
  },
  {
    path: 'lesson/:id',
    loadComponent: () => import('./pages/lesson-view/lesson-view').then((m) => m.LessonView)
  },
  { path: '**', redirectTo: '' }
];
