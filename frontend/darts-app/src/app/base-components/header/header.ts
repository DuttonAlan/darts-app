import { Component } from '@angular/core';
import { Profile } from "../profile/profile";

@Component({
  selector: 'app-header',
  imports: [Profile],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

}
