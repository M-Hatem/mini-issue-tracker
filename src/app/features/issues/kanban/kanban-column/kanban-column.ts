import { Component, input, output, inject } from '@angular/core';
import { Issue } from '../../../../core/models/issue.interface';
import { IssueStyleHelper } from '../../../../core/utils/issue-style.helper';
import { IssueCard } from '../../../../shared/ui/components/issue-card/issue-card';
import { KanbanColumnConfig } from '../../../../core/models/kanban-column.interface';

@Component({
  selector: 'app-kanban-column',
  imports: [IssueCard],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
})
export class KanbanColumn {
  readonly config = input.required<KanbanColumnConfig>();

  readonly issueDeleted = output<number>();
  readonly issueClicked = output<number>();

  protected getStatusColumnClasses = IssueStyleHelper.getStatusColumnClasses;

  protected onIssueDeleted(issueId: number): void {
    this.issueDeleted.emit(issueId);
  }

  protected onIssueClicked(issueId: number): void {
    this.issueClicked.emit(issueId);
  }
}
