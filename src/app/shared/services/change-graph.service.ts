import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeGraphService {

  private enviarFlagSubject = new Subject<any>();
  enviarflagObservable = this.enviarFlagSubject.asObservable();
  flag: number;

  private enviarFlagSubjectNumber = new Subject<any>();
  enviarflagObservableNumber = this.enviarFlagSubjectNumber.asObservable();
  flagNumber: number;

  private enviarFlagSubjectRange = new Subject<any>();
  enviarflagObservableRange = this.enviarFlagSubjectRange.asObservable();
  flagRange: number;

  private enviarFlagSubjectTotal = new Subject<any>();
  enviarflagObservableTotal = this.enviarFlagSubjectTotal.asObservable();
  flagTotal: number;

  private enviarFlagSubjectDisp = new Subject<any>();
  enviarflagObservableDisp = this.enviarFlagSubjectDisp.asObservable();
  flagDisp: number;
  
  constructor() { }

  sendOrder(flag: number,flag2: number){
    this.enviarFlagSubject.next({viewGraph: flag, typeGraph:flag2});
  }

  changeTab(flag: number){
    this.enviarFlagSubjectNumber.next(flag);
  }

  changeRange(flagRange: number){
    this.enviarFlagSubjectRange.next(flagRange);
  }

  changetotal(flagTotal: number){
    this.enviarFlagSubjectTotal.next(flagTotal);
  }

  changeDispositivo(flagDisp: string){
    this.enviarFlagSubjectDisp.next(flagDisp);
  }
}
