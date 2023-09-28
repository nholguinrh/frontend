import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Page } from 'src/app/shared/model/page';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-equipo-cliente',
  templateUrl: './equipo-cliente.component.html',
  styleUrls: ['./equipo-cliente.component.css']
})
export class EquipoClienteComponent implements OnInit {

  equipos: any[] = []; 
  cliente: string;
  public filter: boolean = false;
  pageResponse: Page<any> = new Page<any>();

  constructor(public router: Router,
    private alertService: AlertService,
    public spinner: NgxSpinnerService, 
    private workspaceService: WorkspaceService,) { }

  ngOnInit(): void {
    this.cliente = localStorage.getItem('cliente');
    this.onPaged(1);
  }

  onPaged(page: number) {
      this.buscarTodo(page);
  }

  cambiarRol(equipoId: any){
    localStorage.setItem('equipoId', equipoId);
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.miembroDetalleCliente+")");
  }


  buscarTodo(page: number){

    this.spinner.show();
    this.workspaceService.consultarEquipoCliente(Number(this.cliente), 6, page).subscribe({
      next: (result) => {
        if (result.data != null) {
          this.pageResponse.init(result);
        }
        this.spinner.hide();
      },
      error: (_) => {
        this.spinner.hide();
      }
    });

  }

}
