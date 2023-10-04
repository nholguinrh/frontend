import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { AdministratorService } from './administrator.service';

@Injectable({
  providedIn: 'root',
})
export class ReloadDataService {
  private _interval: any;
  private _interval2: any;

  private readonly _milisecondsTimeout: number = 90000;
  private readonly _milisecondsTimeout2: number = 5000;

  private readonly _updateNow = new BehaviorSubject<boolean>(true);

  private readonly _updateNow2 = new BehaviorSubject<boolean>(true);

  get requireUpdate() {
    return this._updateNow.asObservable();
  }

  get requireUpdate2() {
    return this._updateNow2.asObservable();
  }
  

  constructor(private administratorService: AdministratorService) {

    this.administratorService.configuracion(2).subscribe({
      next: (response) => {
        if(response?.valor){          
          let valueTime = Number(response?.valor);
          this._interval = setInterval(() => {
            this._updateNow.next(true);
          }, Number(valueTime));
        }
      }
    });

    this._interval2 = setInterval(() => {
      this._updateNow2.next(true);
    }, this._milisecondsTimeout2);

    let typeObject = localStorage.getItem('type-service');
    if(typeObject){
      this.setType(<1 | 2 | 3>Number(typeObject))
    }
  }

  

  clearTimer() {
    clearInterval(this._interval);
    clearInterval(this._interval2);
  }

  private _type = new BehaviorSubject<1 | 2 | 3>(1);

  get type(): 1 | 2 | 3 {
    return this._type.value;
  }

  setType(type: 1 | 2 | 3) {
    this._type.next(type);
    localStorage.setItem('type-service', type.toString());
    this._updateNow.next(true);
  }

}
