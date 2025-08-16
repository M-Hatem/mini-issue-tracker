import { Component, input, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '../../../core/models/issue.interface';
import { IssueCard } from '../../../shared/ui/components/issue-card/issue-card';
import { ViewMode } from '../../../core/models/view-mode.enum';

@Component({
  selector: 'app-list',
  imports: [IssueCard],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly issues = input.required<Issue[]>();

  issueDeleted = output<number>();
  issueClicked = output<number>();

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
