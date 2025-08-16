import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesService } from '../../../core/api/issues.service';
import { Issue } from '../../../core/models/issue.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly issuesService = inject(IssuesService);

  protected readonly issueForm: FormGroup;
  protected readonly isEditMode = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly issueId = signal<number | null>(null);

  protected readonly statusOptions = ['To Do', 'In Progress', 'Done'];
  protected readonly priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  constructor() {
    this.issueForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['To Do', Validators.required],
      priority: ['Medium', Validators.required],
      assignee: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      const issueId = parseInt(id, 10);
      if (!isNaN(issueId)) {
        this.isEditMode.set(true);
        this.issueId.set(issueId);
        this.loadIssueForEdit(issueId);
      }
    }
  }

  private loadIssueForEdit(issueId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.issuesService.getIssueById(issueId).subscribe({
      next: (issue) => {
        this.issueForm.patchValue({
          title: issue.title,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
          assignee: issue.assignee,
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading issue for edit:', err);
        this.error.set('Failed to load issue for editing');
        this.loading.set(false);
      },
    });
  }

  protected onSubmit(): void {
    if (this.issueForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.issueForm.value;
    const currentDate = new Date().toISOString();

    if (this.isEditMode() && this.issueId()) {
      const updateData: Partial<Issue> = {
        ...formValue,
        updateDate: currentDate,
      };

      this.issuesService.updateIssue(this.issueId()!, updateData).subscribe({
        next: (updatedIssue) => {
          this.loading.set(false);
          this.router.navigate(['/issues', updatedIssue.id]);
        },
        error: (err) => {
          console.error('Error updating issue:', err);
          this.error.set('Failed to update issue. Please try again.');
          this.loading.set(false);
        },
      });
    } else {
      const newIssue: Omit<Issue, 'id'> = {
        ...formValue,
        creationDate: currentDate,
        updateDate: currentDate,
      };

      this.issuesService.createIssue(newIssue).subscribe({
        next: (createdIssue) => {
          this.loading.set(false);
          this.router.navigate(['/issues', createdIssue.id]);
        },
        error: (err) => {
          console.error('Error creating issue:', err);
          this.error.set('Failed to create issue. Please try again.');
          this.loading.set(false);
        },
      });
    }
  }

  protected onCancel(): void {
    if (this.isEditMode()) {
      this.router.navigate(['/issues', this.issueId()]);
    } else {
      this.goBackToList();
    }
  }

  private goBackToList(): void {
    this.router.navigate(['/issues/dashboard']);
  }

  protected deleteIssue(): void {
    if (!this.isEditMode() || !this.issueId()) return;

    const issueTitle = this.issueForm.get('title')?.value || 'this issue';

    if (confirm(`Are you sure you want to delete "${issueTitle}"?`)) {
      this.loading.set(true);
      this.error.set(null);

      this.issuesService.deleteIssue(this.issueId()!).subscribe({
        next: () => {
          this.loading.set(false);
          this.goBackToList();
        },
        error: (err) => {
          console.error('Error deleting issue:', err);
          this.error.set('Failed to delete issue. Please try again.');
          this.loading.set(false);
        },
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.issueForm.controls).forEach((key) => {
      const control = this.issueForm.get(key);
      control?.markAsTouched();
    });
  }

  protected getErrorMessage(controlName: string): string {
    const control = this.issueForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldDisplayName(controlName)} is required`;
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `${this.getFieldDisplayName(
        controlName
      )} must be at least ${requiredLength} characters`;
    }

    if (control.errors['maxlength']) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return `${this.getFieldDisplayName(
        controlName
      )} must be no more than ${requiredLength} characters`;
    }

    return `${this.getFieldDisplayName(controlName)} is invalid`;
  }

  private getFieldDisplayName(controlName: string): string {
    const displayNames: { [key: string]: string } = {
      title: 'Title',
      description: 'Description',
      status: 'Status',
      priority: 'Priority',
      assignee: 'Assignee',
    };
    return displayNames[controlName] || controlName;
  }

  protected isFieldInvalid(controlName: string): boolean {
    const control = this.issueForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}
