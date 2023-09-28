import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { ClientService } from 'src/app/shared/services/client.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-miembro-equipo-cliente',
  templateUrl: './miembro-equipo-cliente.component.html',
  styleUrls: ['./miembro-equipo-cliente.component.css']
})
export class MiembroEquipoClienteComponent implements OnInit {

  public data: any;
  public dashboard: any;
  public datadashboard: any;
  constructor(public router: Router,
    private alertService: AlertService,
    private clientService: ClientService,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
    localStorage.getItem('equipoId')
    this.clientService.obtenerClientePorId(Number(localStorage.getItem('equipoId'))).subscribe({
      next: (result) => {
        if (result.data != null) {
          this.data = result.data.usuario;
          this.dashboard = result.data.dashboardDto;
          this.obtenerDashboard();
        }else{
          this.alertService.error('No se pudo recuperar la información del usuario');
        }
      },
      error: (_) => {
        console.log(_)
        this.alertService.error('No se pudo recuperar la información del usuario');
      }
    });
    localStorage.setItem('navigation', NAV.miembroDetalleCliente);
  }

  goToEquipoCliente(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.detalleCliente+")");
  }

  obtenerDashboard(){
    this.dashboardService.obtenerDashboard(this.data.idUsuario).subscribe({
      next: (result) => {
        if (result.data != null) {
          this.datadashboard = result.data;
        }else{
          this.alertService.error('No se pudo recuperar la información');
        }
      },
      error: (_) => {
        console.log(_)
        this.alertService.error('No se pudo recuperar la información del usuario');
      }
    });
  }

}
