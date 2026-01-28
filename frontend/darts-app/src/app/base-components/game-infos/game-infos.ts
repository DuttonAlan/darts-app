import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AppStateService } from '../../state/app-state.service';
import { Subject, takeUntil } from 'rxjs';
import { GameSettings, InMode, OutMode, defaultSettings, formatInMode, formatOutMode } from '../../interfaces/game-settings';

@Component({
  selector: 'app-game-infos',
  imports: [],
  templateUrl: './game-infos.html',
  styleUrl: './game-infos.scss',
})
export class GameInfos implements OnInit, OnDestroy {
  private appStateService = inject(AppStateService);

  private destroy$ = new Subject<void>();
    
  settings: GameSettings = defaultSettings;

  ngOnInit(): void {
    this.appStateService
      .getAsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.settings = state.currentSettings;
      });
  }

  ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

  public getInMode(inMode: InMode): string {
    return formatInMode(inMode);
  }

  public getOutMode(outMode: OutMode): string {
    return formatOutMode(outMode);
  }
}
