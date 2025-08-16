import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-issue-filtration',
  imports: [FormsModule],
  templateUrl: './issue-filtration.html',
  styleUrl: './issue-filtration.scss',
})
export class IssueFiltration {
  statusChange = output<string>();

  protected readonly selectedStatus = signal('All');

  protected onStatusChange(status: string): void {
    this.selectedStatus.set(status);
    this.statusChange.emit(status);
  }
}
