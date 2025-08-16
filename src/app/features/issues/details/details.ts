import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesService } from '../../../core/api/issues.service';
import { Issue } from '../../../core/models/issue.interface';
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
    this.router.navigate(['/issues']);
  }

  protected editIssue(): void {
    if (!this.issue()) return;

    this.router.navigate(['/issues', this.issue()!.id, 'edit']);
  }

  protected getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  protected getStatusColor(status: string): string {
    switch (status) {
      case 'Done':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'To Do':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }
}
