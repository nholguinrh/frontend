import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Page } from 'src/app/shared/model/page';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-equipo-cliente',
  templateUrl: './equipo-cliente.component.html',
  styleUrls: ['./equipo-cliente.component.css']
})
export class EquipoClienteComponent implements OnInit {

  metodoFormulario: string;
  public filtradoBusqueda: string = "nombre";
  public des: boolean = false;
  public form: FormGroup;
  usuario:any;
  public filter: boolean = false;
  public busquedaRealizada:string='';
  pageResponse: Page<any> = new Page<any>();

  constructor( private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService, 
    private workspaceService: WorkspaceService, 
    private administratorService: AdministratorService,
    private alertService: AlertService,
    public router: Router) { }

  ngOnInit(): void {
    this.usuario = this.administratorService.getIdUsuarios();
    localStorage.removeItem('pendiente');        
    this.form = this.formBuilder.group({      
      busqueda: ['']
    });
    this.onPaged(1);
  }

  onPaged(page: number) {
    if(localStorage.getItem('BusquedaRealizada')!=null){      
      this.form.get('busqueda').setValue(localStorage.getItem('BusquedaRealizada'));
      this.buscarCadena();
    }else{      
      this.buscarTodo(page);
    }
  }

  invitarPersona(){
    localStorage.removeItem('equipoId');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.invitarCliente+")");
  }

  cambiarRol(user: any){
    if(user?.tbCatEstatus?.idCatEstatus == 3){
      localStorage.setItem('pendiente', 'true');
    }
    localStorage.setItem('equipoId', user.idUsuario);
    this.router.navigateByUrl(NAV.inicioCliente + "/("+'tablero'+":" + NAV.cambiarRolCliente+")");
  }

  buscarTodo(page: number){           
    //this.spinner.show();
    localStorage.removeItem('BusquedaRealizada');    
    let idCliente = this.administratorService.getIdCliente();
    this.workspaceService.consultarEquipoCliente(Number(idCliente), 6, page).subscribe({
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

  changeFilter(){
    let name = this.form.get('busqueda').value || null;
    if(name){
      this.filter = true;
    }else{
      this.filter = false;
    }
  }

  buscarCadena(){
    //this.spinner.show();
    let idCliente = this.administratorService.getIdCliente();
    
    this.busquedaRealizada=this.form.get('busqueda').value;
    localStorage.setItem('BusquedaRealizada',this.busquedaRealizada);    

    let body = {
      busqueda: this.busquedaRealizada
    }
    this.workspaceService.consultarUsuarioCadena(6, 0,Number(idCliente),body).subscribe({
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

  returnFilter(){
    this.form.reset()
    this.buscarTodo(1);
  }

}