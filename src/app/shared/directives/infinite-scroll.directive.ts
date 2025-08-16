import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective {
  @Input() threshold = 100;
  @Input() disabled = false;
  @Output() scrolled = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.disabled) {
      return;
    }

    if (this.shouldLoadMore()) {
      this.scrolled.emit();
    }
  }

  private shouldLoadMore(): boolean {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    return scrollPosition >= documentHeight - this.threshold;
  }
}
