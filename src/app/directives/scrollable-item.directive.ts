import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
	selector: '[appScrollableItem]'
})
export class ScrollableItemDirective {
    index = input<number>();

    el = inject(ElementRef<HTMLElement>);

	public scrollIntoView(): void {
		this.el.nativeElement.scrollIntoView({ behavior: 'smooth' });
	}
}