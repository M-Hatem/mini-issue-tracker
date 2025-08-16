import { Component, output, signal, input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {
  searchChange = output<string>();
  searchTerm = input<string>('');

  private searchSubject = new Subject<string>();
  protected readonly searchValue = signal('');

  constructor() {
    effect(() => {
      this.searchValue.set(this.searchTerm());
    });

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchChange.emit(searchTerm);
    });
  }

  protected onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
    this.searchSubject.next(value);
  }
}
