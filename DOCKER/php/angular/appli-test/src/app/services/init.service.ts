import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private initSubject = new BehaviorSubject<boolean>(false);
  init$: Observable<boolean> = this.initSubject.asObservable();

  setInitialized() {
    this.initSubject.next(true);
  }
}