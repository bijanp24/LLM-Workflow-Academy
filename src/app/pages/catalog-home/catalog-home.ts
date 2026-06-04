import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';

@Component({
  selector: 'app-catalog-home',
  imports: [RouterLink],
  templateUrl: './catalog-home.html',
  styleUrl: './catalog-home.scss'
})
export class CatalogHome {
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);

  protected readonly catalog = toSignal(this.content.getCatalog());

  protected readonly courses = computed(() => this.catalog()?.courses ?? []);
}
