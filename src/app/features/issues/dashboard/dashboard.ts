import { Component, signal, OnInit, inject } from '@angular/core';
import { SearchInput } from '../../../shared/ui/components/search-input/search-input';
import { IssueFiltration } from '../issue-filtration/issue-filtration';
import { Issue } from '../../../core/models/issue.interface';
import { IssuesService } from '../../../core/api/issues.service';
import { List } from '../list/list';

@Component({
  selector: 'app-dashboard',
  imports: [SearchInput, IssueFiltration, List],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly issuesService = inject(IssuesService);

  protected readonly isFilterOpen = signal(false);
  protected readonly issues = signal<Issue[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadIssues();
  }

  protected loadIssues(): void {
    this.loading.set(true);
    this.error.set(null);

    this.issuesService.getIssues().subscribe({
      next: (issues) => {
        this.issues.set(issues);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading issues:', err);
        this.error.set('Failed to load issues. Please try again later.');
        this.loading.set(false);
      },
    });
  }
}
