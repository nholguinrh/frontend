import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Usuario } from 'src/app/shared/model/cliente.model';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {

  tabLoadTimes: Date[] = [];
  selected = new FormControl(0);
  user: Usuario;

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('admin-user'));
    localStorage.setItem('navigation', NAV.detalleCliente);
    localStorage.removeItem('backsla');
    let tabSeleccionada = localStorage.getItem('detalle-cliente');
    if(tabSeleccionada != null){
      this.selectTab(Number(tabSeleccionada));
    }
    
  }

  goToWorkspace(){
    localStorage.removeItem('detalle-cliente');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
  }

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }
    return this.tabLoadTimes[index];
  }

  selectTab(index: number){
    this.selected.setValue(index);
  }

  tabChange(index: any){
    localStorage.setItem('detalle-cliente', index);
  }

}
