import { Component, input, output } from '@angular/core';
import { PrimaryButton } from "../../primary-button/primary-button";

@Component({
  selector: 'app-base-dialog',
  imports: [PrimaryButton],
  templateUrl: './base-dialog.html',
  styleUrl: './base-dialog.scss',
})
export class BaseDialog {
  dialogTitle = input<string>();
  primaryBtnText = input<string>();

  closed = output<void>();
  primaryClicked = output<void>();

  public close(): void {
    this.closed.emit();
  }

  public primaryClick(): void {
    this.primaryClicked.emit();
  }
}
