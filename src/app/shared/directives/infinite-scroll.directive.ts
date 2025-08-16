import { Directive, HostListener, input, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective {
  threshold = input<number>(100);
  disabled = input<boolean>(false);
  scrolled = output<void>();

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.disabled()) {
      return;
    }

    if (this.shouldLoadMore()) {
      this.scrolled.emit();
    }
  }

  private shouldLoadMore(): boolean {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    return scrollPosition >= documentHeight - this.threshold();
  }
}
