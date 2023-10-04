import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion-inactividad',
  templateUrl: './configuracion-inactividad.component.html',
  styleUrls: ['./configuracion-inactividad.component.css']
})
export class ConfiguracionInactividadComponent implements OnInit {

  labelPosition:  '1' | '2' = '1';
  
  constructor() { }

  ngOnInit(): void {
    let inactivo = localStorage.getItem('inactividad');
    if(inactivo == '1'){
      this.labelPosition = '1';
    }else{
      this.labelPosition = '2'; 
    }
  }

  incatividad(valor){
    console.log('Valor:',valor);
    localStorage.setItem('inactividad', valor);
  }

}
