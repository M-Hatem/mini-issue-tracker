import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-issue-filtration',
  imports: [FormsModule],
  templateUrl: './issue-filtration.html',
  styleUrl: './issue-filtration.scss',
})
export class IssueFiltration {
  statusChange = output<string[]>();
  statuses = input<string[]>([]);

  protected readonly selectedStatuses = signal<string[]>([]);
  protected readonly availableStatuses = ['To Do', 'In Progress', 'Done'];

  constructor() {
    effect(() => {
      this.selectedStatuses.set(this.statuses());
    });
  }

  protected onStatusChange(status: string, checked: boolean): void {
    if (checked) {
      this.selectedStatuses.update((statuses) => [...statuses, status]);
    } else {
      this.selectedStatuses.update((statuses) => statuses.filter((s) => s !== status));
    }

    this.statusChange.emit(this.selectedStatuses());
  }

  protected isStatusSelected(status: string): boolean {
    return this.selectedStatuses().includes(status);
  }
}
