import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-closable-chip',
  imports: [],
  templateUrl: './closable-chip.html',
  styleUrl: './closable-chip.scss',
})
export class ClosableChip {
  text = input<string>();

  closeChip = output();

  public triggerClose(): void {
    this.closeChip.emit();
  }
}
