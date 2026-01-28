import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [MatButtonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {
  private router = inject(Router);

  public navigateToSettings(): void {
    this.router.navigate(['/game-settings'])
  }
}
