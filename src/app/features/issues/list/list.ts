import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from '../../../core/models/issue.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [DatePipe],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private readonly router = inject(Router);
  readonly issues = input.required<Issue[]>();

  protected viewIssueDetails(issueId: number): void {
    this.router.navigate(['/issues', issueId]);
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
