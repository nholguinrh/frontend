import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  QueryList,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { TimerComponent } from '../timer';
import { CodeInputComponent } from 'angular-code-input';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.css'],
})
export class PincodeComponent implements OnInit {
  @Input() numOfDigits;
  @ViewChildren('inputs') inputs: QueryList<any>;
  @ViewChild('codeInput') codeInput !: CodeInputComponent;
  @ViewChild('timer') timer:TimerComponent;
  @Output() notifyParentBtn = new EventEmitter<boolean>();
  @Output() notifyTimeOut = new EventEmitter<boolean>();

  confirmCodeForm: FormGroup;
  countDown: Subscription;
  tick = 1000;
  timeLimit: number = 2;
  message: string = '';
  code: string = '';
  aux: string = '';

  constructor(private fb: FormBuilder) {
    this.confirmCodeForm = this.fb.group({
      digits: this.fb.array([]),
    });
  }

  ngOnInit(): void {
  
  }

  ngOnDestroy() {
    this.countDown = null;
  }

  emit(active: boolean): void {
    this.notifyParentBtn.emit(active);
  }

  timeOut():void{
    this.notifyTimeOut.emit(true)
  }

   // this called every time when user changed the code
  onCodeChanged(code: string) {
    
    this.aux = code;
    
    this.emit(true);
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.code = code;
    this.emit(false);
  }


  confirmCode(): string {
    return this.code;
  }

  setErrorMessage(message: string){
    if(message === "Error:El código de verificación es incorrecto" ){
      this.message = "El código de verificación es incorrecto";
    }else{
      this.message = message;
    }
  }
}
