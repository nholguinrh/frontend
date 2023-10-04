import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Step } from 'src/app/shared/model/stteper.model';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  
  initialStep: Step; 
  steps: Step[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.nuevoClienteConfiguracion);
    localStorage.setItem('backsla', NAV.nuevoClienteConfiguracion);
    this.initialStep = new Step('Información', true, true);
    let grayStep = new Step('Activación', true, true);
    grayStep.gray = true;
    this.steps.push(grayStep);
    let lstStep = new Step('Configuración', true, false);
    lstStep.last = true;
    this.steps.push(lstStep);
  }

  goBack(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteActivacion+")");
  }
  

}
