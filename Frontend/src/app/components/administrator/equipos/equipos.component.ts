import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Usuario } from 'src/app/shared/model/cliente.model';
import { Page } from 'src/app/shared/model/page';
import { PageRequest } from 'src/app/shared/model/page.request';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';


@Component({
  selector: 'app-administrator-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {

  metodoFormulario: string;
  fetchRequest: PageRequest<any> = new PageRequest<any>();
  pageResponse: Page<any> = new Page<any>();
  public filter: boolean = false;
  public form: FormGroup;
  usuario:any;

  constructor(private workspaceService: WorkspaceService, 
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public spinner: NgxSpinnerService, 
    public router: Router,
    public administratorService: AdministratorService
    ) { }

  ngOnInit(): void {
    this.usuario = this.administratorService.getIdUsuarios();
    localStorage.removeItem('equipoId');
    localStorage.removeItem('pendiente');
    this.form = this.formBuilder.group({      
      busqueda: ['']
    });
    this.onPaged(1);
  }

  onPaged(page: number) {

    if(this.filter){
      this.buscarNombre(page);
    }else{
      this.buscarTodo(page);
    }
    

  }

  descargarActividades(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.descargaActividades+")");
  }

  invitarPersona(){
    localStorage.removeItem('equipoId');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.invitarPersona+")");
  }

  cambiarRol(equipo: any){
    localStorage.setItem('equipoId', equipo.idUsuario);
    this.router.navigateByUrl(NAV.administrator + "/("+'home'+":" + NAV.cambiarRol+")");
  }

  changeFilter(){
    let name = this.form.get('busqueda').value || null;
    if(name){
      this.filter = true;
      this.buscarNombre(1);
    }else{
      this.filter = false;
      this.buscarTodo(1);
    }
  }

  buscarNombre(page: number){
    this.spinner.show();
    let name = this.form.get('busqueda').value;
    this.workspaceService.consultarEquipoAdminTotalplayNombre(6, page, name).subscribe({
      next: (result) => {
        if (result.httpStatus === 200 || result.httpStatus === 301) {
          this.pageResponse.init(result);
        }else{
          this.alertService.info('<b>No se encontraron resultados</b>');
        }
        this.spinner.hide();
      },
      error: (_) => {
        this.spinner.hide();
      }
    });

  }

  buscarTodo(page: number){
    this.spinner.show();
    this.workspaceService.consultarEquipoAdminTotalplay(6, page).subscribe({
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

  returnPage(){
    this.filter = false;
    this.onPaged(0);
    this.form.reset();
  }

}
