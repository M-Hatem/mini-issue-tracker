import { Component, input, output } from '@angular/core';
import { Issue } from '../../../../core/models/issue.interface';
import { IssueStyleHelper } from '../../../../core/utils/issue-style.helper';
import { DatePipe } from '@angular/common';

export interface IssueCardConfig {
  showActions?: boolean;
  showDescription?: boolean;
  showMeta?: boolean;
  compact?: boolean;
  showStatus?: boolean;
}

@Component({
  selector: 'app-issue-card',
  imports: [DatePipe],
  templateUrl: './issue-card.html',
  styleUrl: './issue-card.scss',
})
export class IssueCard {
  readonly issue = input.required<Issue>();
  readonly config = input<IssueCardConfig>({
    showActions: true,
    showDescription: true,
    showMeta: true,
    compact: false,
    showStatus: false,
  });

  readonly issueDeleted = output<number>();
  readonly issueClicked = output<number>();

  protected getPriorityClasses = IssueStyleHelper.getPriorityClasses;
  protected getStatusClasses = IssueStyleHelper.getStatusClasses;
  protected getPriorityDisplayText = IssueStyleHelper.getPriorityDisplayText;
  protected getStatusDisplayText = IssueStyleHelper.getStatusDisplayText;

  protected onViewDetails(event: Event): void {
    event.stopPropagation();
    this.issueClicked.emit(this.issue().id);
  }

  protected onDeleteIssue(event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${this.issue().title}"?`)) {
      this.issueDeleted.emit(this.issue().id);
    }
  }

  protected onCardClick(): void {
    this.issueClicked.emit(this.issue().id);
  }
}
