import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { IssueFiltration } from '../issue-filtration/issue-filtration';
import { Issue } from '../../../core/models/issue.interface';
import { IssuesService } from '../../../core/api/issues.service';
import { List } from '../list/list';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-dashboard',
  imports: [SearchInput, IssueFiltration, List, InfiniteScrollDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly issuesService = inject(IssuesService);
  private readonly router = inject(Router);

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

  ngOnInit(): void {
    this.loadIssues();
  }

  protected onScroll(): void {
    if (!this.shouldLoadMore()) return;

    this.loadMoreIssues();
  }

  protected onSearchChange(searchValue: string): void {
    this.searchTerm.set(searchValue);
    this.currentOffset.set(0);
    this.hasMoreIssues.set(true);
    this.loadIssues();
  }

  protected onStatusFilterChange(statuses: string[]): void {
    this.statusFilter.set(statuses);
    this.currentOffset.set(0);
    this.hasMoreIssues.set(true);
    this.loadIssues();
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set([]);
    this.currentOffset.set(0);
    this.hasMoreIssues.set(true);
    this.loadIssues();
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
