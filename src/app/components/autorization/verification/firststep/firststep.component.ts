import { Component, Input,OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { PASOS } from 'src/app/shared/model/autorization.model';
import { Step } from 'src/app/shared/model/stteper.model';
import { PincodeComponent } from '../../../../shared/utils/pincode/pincode.component';

@Component({
  selector: 'app-firststep',
  templateUrl: './firststep.component.html',
  styleUrls: ['./firststep.component.css'],
})
export class FirststepComponent implements OnInit {
  @ViewChild('pincode') pincode: PincodeComponent;
  @Input()
  radioUsername: string = 'Usuario';
  @Input()
  emailPartial: string = 'c*****a@g*****.com';
  @Input()
  phonePartial: string = '55******80';
  initialStep: Step;
  steps: Step[] = [];
  imgLoad: boolean = false;

  @Output() notifyNextStep = new EventEmitter<number>();

  enabledPswCapture: boolean = false;
  optionSelected: number;
  btnControl: boolean = true;
  timeOut: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initialStep = new Step('VALIDACIÓN', true, true);
    this.steps.push(new Step('CONTRASEÑA', false, false));
  }

  sendValidationCode(): void {
    localStorage.setItem('code', this.optionSelected.toString())
    this.router.navigateByUrl(NAV.verification+"/("+NAV.auth+":"+NAV.code+")");
  }

  btnHandlerEnabled(active: boolean) {
    this.btnControl = active;
  }

  timeOutHandler(timeout: boolean){
    this.timeOut = timeout;
  }

  reenviarCodigo(){    
    window.location.reload();
  }

  loadImage() {
    this.imgLoad = true;
  }
}

