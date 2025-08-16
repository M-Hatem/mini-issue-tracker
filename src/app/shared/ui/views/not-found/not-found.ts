import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.html',
})
export class NotFound {
  private readonly router = inject(Router);

  goToDashboard(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}
