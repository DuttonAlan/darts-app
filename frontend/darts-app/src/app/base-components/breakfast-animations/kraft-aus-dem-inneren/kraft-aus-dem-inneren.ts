import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-kraft-aus-dem-inneren',
  imports: [],
  templateUrl: './kraft-aus-dem-inneren.html',
  styleUrl: './kraft-aus-dem-inneren.scss',
})
export class KraftAusDemInneren implements OnInit {
  private audio = new Audio('assets/sounds/DieKraftausdemInneren.m4a');

  ngOnInit(): void {
    this.audio.currentTime = 0;
    this.audio.play();

    timer(11_000).subscribe(() => {
      this.audio.pause();
    });
  }
}
