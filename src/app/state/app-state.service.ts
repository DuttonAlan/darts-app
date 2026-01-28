import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppState } from './app-state';
import { defaultSettings } from '../interfaces/game-settings';

@Injectable({
	providedIn: 'root'
})
export class AppStateService {
	private readonly defaultState: AppState = {
		// Set initial values for your state properties here
		currentSettings: defaultSettings
	};

	private readonly appState$ = new BehaviorSubject<AppState>({ ...this.defaultState });

	/**
	 * Returns an Observable of the current AppState.
	 * @param key key of AppState to be read
	 * @returns selected property of AppState
	 */
	public get<K extends keyof AppState>(key: K): AppState[K] {
		return this.appState$.getValue()[key];
	}

	/**
	 * Set a new value for a property of the AppState.
	 * @param key key of AppState to be updated
	 * @param value new value for AppState
	 */
	public set<K extends keyof AppState>(key: K, value: AppState[K]): void {
		const currentState = this.appState$.getValue();

		currentState[key] = value;

		this.appState$.next(currentState);
	}

	/**
	 * Set multiple values and properties of the AppState in one go.
	 * @param partialValue new value for AppState to be merged
	 */
	public setMultiple(partialValue: Partial<AppState>): void {
		const currentState = this.appState$.getValue();

		this.appState$.next({ ...currentState, ...partialValue });
	}

	public getAsObservable(): BehaviorSubject<AppState> {
		return this.appState$;
	}
}
