import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesService } from '../../../core/api/issues.service';
import { Issue } from '../../../core/models/issue.interface';
import { IssueStyleHelper } from '../../../core/utils/issue-style.helper';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [DatePipe],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly issuesService = inject(IssuesService);

  protected readonly issue = signal<Issue | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected getPriorityClasses = IssueStyleHelper.getPriorityClasses;
  protected getStatusClasses = IssueStyleHelper.getStatusClasses;
  protected getPriorityDisplayText = IssueStyleHelper.getPriorityDisplayText;
  protected getStatusDisplayText = IssueStyleHelper.getStatusDisplayText;

  ngOnInit(): void {
    this.loadIssue();
  }

  private loadIssue(): void {
    const issueId = this.route.snapshot.paramMap.get('id');

    if (!issueId) {
      this.error.set('Invalid issue ID');
      this.loading.set(false);
      return;
    }

    const id = Number(issueId);
    if (isNaN(id)) {
      this.error.set('Invalid issue ID format');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.issuesService.getIssueById(id).subscribe({
      next: (issue) => {
        this.issue.set(issue);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading issue:', err);
        this.error.set('Issue not found or failed to load');
        this.loading.set(false);
      },
    });
  }

  protected goBackToList(): void {
    const viewMode = this.route.snapshot.queryParams['view'];

    this.router.navigate(['/issues/dashboard'], {
      queryParams: { view: viewMode || 'list' },
    });
  }

  protected editIssue(): void {
    if (!this.issue()) return;

    this.router.navigate(['/issues', this.issue()!.id, 'edit']);
  }

  protected deleteIssue(): void {
    if (!this.issue()) return;

    const issueTitle = this.issue()!.title;
    const issueId = this.issue()!.id;

    if (confirm(`Are you sure you want to delete "${issueTitle}"?`)) {
      this.issuesService.deleteIssue(issueId).subscribe({
        next: () => this.goBackToList(),
        error: (error) => {
          console.error('Error deleting issue:', error);
          alert('Failed to delete issue. Please try again.');
        },
      });
    }
  }
}
