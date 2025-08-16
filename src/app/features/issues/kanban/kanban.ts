import { Component, input, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '../../../core/models/issue.interface';
import { KanbanColumn } from './kanban-column/kanban-column';
import { KanbanColumnConfig } from '../../../core/models/kanban-column.interface';
import { ViewMode } from '../../../core/models/view-mode.enum';

@Component({
  selector: 'app-kanban',
  imports: [KanbanColumn],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss',
})
export class Kanban {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly issues = input.required<Issue[]>();

  issueDeleted = output<number>();
  issueClicked = output<number>();

  protected readonly statusColumns: KanbanColumnConfig[] = [
    { key: 'To Do', title: 'To Do', status: 'To Do', color: 'bg-gray-500', issues: [] },
    {
      key: 'In Progress',
      title: 'In Progress',
      status: 'In Progress',
      color: 'bg-blue-500',
      issues: [],
    },
    { key: 'Done', title: 'Done', status: 'Done', color: 'bg-green-500', issues: [] },
  ];

  protected getKanbanColumns(): KanbanColumnConfig[] {
    return this.statusColumns.map((column) => ({
      ...column,
      issues: this.getIssuesByStatus(column.key),
    }));
  }

  protected getIssuesByStatus(status: string): Issue[] {
    return this.issues().filter((issue) => issue.status === status);
  }

  protected onIssueDeleted(issueId: number): void {
    this.issueDeleted.emit(issueId);
  }

  protected onIssueClicked(issueId: number): void {
    const viewMode = this.route.snapshot.queryParams['view'];
    this.router.navigate(['/issues', issueId], {
      queryParams: { view: viewMode || ViewMode.LIST },
    });
  }
}
