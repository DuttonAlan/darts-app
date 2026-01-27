import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-primary-button',
  imports: [MatButtonModule, NgClass],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.scss',
})
export class PrimaryButton {
  text = input<string>();

  redBColor = input<boolean>(false);

  clicked = output();

  public triggerClick(): void {
    this.clicked.emit();
  }
}
