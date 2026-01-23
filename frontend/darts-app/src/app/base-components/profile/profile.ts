import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-profile',
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  public onLogout(): void {
    // TODO
  }
}
