import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { IssuesService } from '../../../core/api/issues.service';
import { Issue } from '../../../core/models/issue.interface';
import { List } from '../list/list';
import { Kanban } from '../kanban/kanban';
import { IssueFiltration } from '../issue-filtration/issue-filtration';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-dashboard',
  imports: [SearchInput, IssueFiltration, List, Kanban, InfiniteScrollDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly issuesService = inject(IssuesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isFilterOpen = signal(false);
  protected readonly issues = signal<Issue[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly currentOffset = signal(0);
  protected readonly pageSize = signal(12);
  protected readonly hasMoreIssues = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<string[]>([]);

  protected readonly viewMode = signal<'list' | 'kanban'>('list');

  ngOnInit(): void {
    this.initilaizeQueryParams();

    if (this.viewMode() === 'list') {
      this.loadIssues();
    } else {
      this.loadAllIssues();
    }
  }

  private initilaizeQueryParams(): void {
    const params = this.route.snapshot.queryParams;
    const viewMode = params['view'] as 'list' | 'kanban';

    this.viewMode.set(viewMode || 'list');

    const searchTerm = params['search'] as string;
    const statusFilter =
      typeof params['status'] === 'string' ? [params['status']] : params['status'];

    if (searchTerm) {
      this.searchTerm.set(searchTerm);
    }

    if (statusFilter && statusFilter.length > 0) {
      this.statusFilter.set(statusFilter);
    }
  }

  protected onScroll(): void {
    if (!this.shouldLoadMore()) return;

    this.loadMoreIssues();
  }

  protected onSearchChange(searchValue: string): void {
    this.searchTerm.set(searchValue);
    this.updateUrlQueryParams();

    if (this.viewMode() === 'list') {
      this.currentOffset.set(0);
      this.hasMoreIssues.set(true);
      this.loadIssues();
    } else {
      this.loadAllIssues();
    }
  }

  protected onStatusFilterChange(statuses: string[]): void {
    this.statusFilter.set(statuses);
    this.updateUrlQueryParams();

    if (this.viewMode() === 'list') {
      this.currentOffset.set(0);
      this.hasMoreIssues.set(true);
      this.loadIssues();
    } else {
      this.loadAllIssues();
    }
  }

  private updateUrlQueryParams(): void {
    const queryParams: Record<string, string | string[]> = {
      view: this.viewMode(),
    };

    if (this.searchTerm()) {
      queryParams['search'] = this.searchTerm();
    }

    if (this.statusFilter().length > 0) {
      queryParams['status'] = this.statusFilter();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set([]);
    this.updateUrlQueryParams();

    if (this.viewMode() === 'list') {
      this.currentOffset.set(0);
      this.hasMoreIssues.set(true);
      this.loadIssues();
    } else {
      this.loadAllIssues();
    }
  }

  protected onIssueDeleted(issueId: number): void {
    this.issues.update((currentIssues) => currentIssues.filter((issue) => issue.id !== issueId));

    if (
      this.viewMode() === 'list' &&
      this.issues().length < this.pageSize() &&
      this.hasMoreIssues()
    ) {
      this.loadMoreIssues();
    }
  }

  protected toggleViewMode(mode: 'list' | 'kanban'): void {
    this.viewMode.set(mode);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: mode },
      replaceUrl: true,
    });

    if (mode === 'list') {
      this.currentOffset.set(0);
      this.hasMoreIssues.set(true);
      this.loadIssues();
    } else {
      this.loadAllIssues();
    }
  }

  protected createNewIssue(): void {
    this.router.navigate(['/issues/new']);
  }

  private shouldLoadMore(): boolean {
    if (this.loading() || this.loadingMore() || !this.hasMoreIssues()) {
      return false;
    }

    return true;
  }

  protected loadIssues(): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentOffset.set(0);
    this.hasMoreIssues.set(true);

    const searchTerm = this.searchTerm();
    const statusFilter = this.statusFilter();

    this.issuesService
      .searchAndFilterIssues(searchTerm, statusFilter, 0, this.pageSize())
      .subscribe({
        next: (newIssues) => {
          this.issues.set(newIssues);
          this.currentOffset.set(newIssues.length);
          this.hasMoreIssues.set(newIssues.length === this.pageSize());
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading issues:', err);
          this.error.set('Failed to load issues. Please try again later.');
          this.loading.set(false);
        },
      });
  }

  protected loadAllIssues(): void {
    this.loading.set(true);
    this.error.set(null);

    const searchTerm = this.searchTerm();
    const statusFilter = this.statusFilter();

    if (!searchTerm && (!statusFilter || statusFilter.length === 0)) {
      this.issuesService.getIssues().subscribe({
        next: (allIssues) => {
          this.issues.set(allIssues);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading all issues:', err);
          this.error.set('Failed to load all issues. Please try again later.');
          this.loading.set(false);
        },
      });
    } else {
      this.issuesService.getIssues().subscribe({
        next: (allIssues) => {
          let filteredIssues = allIssues;

          if (searchTerm && searchTerm.trim()) {
            filteredIssues = filteredIssues.filter((issue) =>
              issue.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
            );
          }

          if (statusFilter && statusFilter.length > 0) {
            filteredIssues = filteredIssues.filter((issue) => statusFilter.includes(issue.status));
          }

          this.issues.set(filteredIssues);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading all issues:', err);
          this.error.set('Failed to load all issues. Please try again later.');
          this.loading.set(false);
        },
      });
    }
  }

  private loadMoreIssues(): void {
    if (this.loadingMore() || !this.hasMoreIssues()) {
      return;
    }

    this.loadingMore.set(true);

    const searchTerm = this.searchTerm();
    const statusFilter = this.statusFilter();

    this.issuesService
      .searchAndFilterIssues(searchTerm, statusFilter, this.currentOffset(), this.pageSize())
      .subscribe({
        next: (newIssues) => {
          if (newIssues.length > 0) {
            this.issues.update((currentIssues) => [...currentIssues, ...newIssues]);
            this.currentOffset.update((offset) => offset + newIssues.length);
            this.hasMoreIssues.set(newIssues.length === this.pageSize());
          } else {
            this.hasMoreIssues.set(false);
          }
          this.loadingMore.set(false);
        },
        error: (err) => {
          console.error('Error loading more issues:', err);
          this.loadingMore.set(false);
        },
      });
  }
}
