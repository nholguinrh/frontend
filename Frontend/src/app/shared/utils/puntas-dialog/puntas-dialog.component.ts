import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { Paginator } from 'array-paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfiguracionSLA, DetallePunta, Estatus } from '../../model/cliente.model';
import { AdministratorService } from '../../services/administrator.service';
import { WorkspaceService } from '../../services/workspace.service';
import { AlertService } from '../alertas';


@Component({
  selector: 'app-puntas-dialog',
  templateUrl: './puntas-dialog.component.html',
  styleUrls: ['./puntas-dialog.component.css']
})
export class PuntasDialogComponent implements OnInit {

  
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  
  public form: FormGroup;
  public monitoreo: boolean = false;
  public pager:any;
  public tablePuntas: any;
  estatusPunta: string = 'activa';
  idUsuario: number;
  busqueda: string;
  showLatitud: boolean = true;
  showLongitud: boolean = true;
  showEstado: boolean = true;
  estados: string[] = [  
    "Aguascalientes",  
    "Baja California",  
    "Baja California Sur",  
    "Campeche",  
    "Chiapas",  
    "Chihuahua",  
    "Coahuila",  
    "Colima",  
    "Ciudad de México",  
    "Durango",  
    "Guanajuato",  
    "Guerrero",  
    "Hidalgo",  
    "Jalisco",  
    "México",  
    "Michoacán",  
    "Morelos",  
    "Nayarit",  
    "Nuevo León",  
    "Oaxaca",  
    "Puebla",  
    "Querétaro",  
    "Quintana Roo",  
    "San Luis Potosí",  
    "Sinaloa",  
    "Sonora",  
    "Tabasco",  
    "Tamaulipas",  
    "Tlaxcala",  
    "Veracruz",  
    "Yucatán",  
    "Zacatecas"
  ];
  filteredOptions: Observable<string[]>;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PuntasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public detallePunta: DetallePunta,
    private administratorService: AdministratorService,
    public spinner: NgxSpinnerService,
    private workspaceService: WorkspaceService,
    private alertService: AlertService
  ) {
    this.createForm();
  }

  ngOnInit(): void {

    this.filteredOptions = this.form.controls['estado'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.form.get('estado').setValue(this.detallePunta.punta.estado);
    this.form.get('latitud').setValue(this.detallePunta.punta.latitud);
    this.form.get('longitud').setValue(this.detallePunta.punta.longitud);
    this.idUsuario = this.administratorService.getIdUsuarios();
    this.cambiarEstatusPunta(this.detallePunta.punta.tbCatEstatus.idCatEstatus);
    this.monitoreo = this.detallePunta.punta.activarPunta;
    this.dialogRef.disableClose = true;
    this.paginador(this.detallePunta.interfaces);
  }

  validarGeolocalizacion(){
    if((this.estados.find(ele => ele == this.form.controls['estado'].value)) == undefined && this.form.controls['estado'].value != null){
      this.form.get('estado').setValue('');
      this.alertService.error("Ingrese el estado correctamente");
    }

    
    if(!(this.form.controls['latitud'].value > 0 || this.form.controls['latitud'].value == '')){
      if(!(this.form.controls['latitud'].value < 0)){
        this.alertService.error("Ingrese la latitud correctamente");
        this.form.get('latitud').setValue('');
      }
    }
    if(!(this.form.controls['longitud'].value > 0 || this.form.controls['longitud'].value == '')){
      if(!(this.form.controls['longitud'].value < 0)){
        this.form.get('longitud').setValue('');
        this.alertService.error("Ingrese la longitud correctamente");
      }
    }
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
        estado: [null],
        //latitud: [null],
        longitud: [null, [Validators.pattern("^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$")]],
        latitud: [null, [Validators.pattern("^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$")]],
      }
    );
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  confirmDialog() {
    // this.spinner.show();
    let estatus = new Estatus();
    let estatusInterfaz = new Estatus();
    let slaConf: ConfiguracionSLA =  null;
    this.detallePunta.punta.estado = this.form.controls['estado'].value;
    this.detallePunta.punta.longitud = this.form.controls['latitud'].value;
    this.detallePunta.punta.latitud = this.form.controls['longitud'].value;
    this.detallePunta.activacion = true;
    if (this.estatusPunta === 'activa') {
      this.detallePunta.punta.activarPunta = true;
      estatus.idCatEstatus = 16;
      this.detallePunta.punta.tbCatEstatus = estatus;
      this.pager.data.forEach(element => {
        if(element.tbConfiguracionSLA?.idConfiguracionSLA == null){
          element.tbConfiguracionSLA = slaConf;
        }
      });
    } else if(this.estatusPunta === 'inactiva') {
      this.detallePunta.punta.activarPunta = false;
      estatus.idCatEstatus = 17;
      this.detallePunta.punta.tbCatEstatus = estatus;
      estatusInterfaz.idCatEstatus = 28;
      this.pager.data.forEach(element => {
        element.activarInterfaz = false;
        element.tbCatEstatus = estatusInterfaz;
        //Se cambia para que tambien las interfaces cambien a nulo la configuración SLA
        element.tbConfiguracionSLA = slaConf;
        /*if(element.tbConfiguracionSLA?.idConfiguracionSLA == null){
          element.tbConfiguracionSLA = slaConf;
        }*/
      });
    }else {
      this.detallePunta.punta.activarPunta = false;
      estatus.idCatEstatus = 26;
      this.detallePunta.punta.tbCatEstatus = estatus;
      estatusInterfaz.idCatEstatus = 28;
      this.pager.data.forEach(element => {
        element.activarInterfaz = false;
        element.tbCatEstatus = estatusInterfaz;
        if(element.tbConfiguracionSLA?.idConfiguracionSLA == null){
          element.tbConfiguracionSLA = slaConf;
        }
      });
    }
    this.detallePunta.interfaces.forEach(element => {
      if(element.tbCatEstatus.idCatEstatus != 27){
        element.tbConfiguracionSLA = slaConf
      }
    });
    this.modificarDetallePunta();
  }

  modificarDetallePunta() {
    this.workspaceService.modificarDetallePunta(
      this.idUsuario,
      this.detallePunta
    ).subscribe({
      next: ({httpStatus, message}) => {
        if (httpStatus === 200) {
          this.dialogRef.close(true);
          this.spinner.hide();
        } else {
          console.error(message);
          this.spinner.hide();
        }

      }, 
      error: (e) => {
        console.error(e);
        this.spinner.hide();
      }
    });
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  inputClick(event?: any){
    if(event){
      event.stopPropagation();
    }
  }

  setLatitud(event?: any) {
    this.detallePunta.punta.latitud = event.target.value;
  }

  setLongitud(event?: any) {
    this.detallePunta.punta.longitud = event.target.value;
  }

  setEstado(event?: any) {
    this.detallePunta.punta.estado = event.target.value; 
  }

  cambiarEstatus(activar:boolean) {
    let estatusInterfaz = new Estatus();
    let slaConf: ConfiguracionSLA =  null;
    this.monitoreo = activar;
    this.cambiarEstatusPunta(activar);
    if(activar == false){
      estatusInterfaz.idCatEstatus = 28
      this.pager.data.forEach(element => {
        element.activarInterfaz = false;
        element.tbCatEstatus = estatusInterfaz;
        if(element.tbConfiguracionSLA?.idConfiguracionSLA == null){
          element.tbConfiguracionSLA = slaConf;
        }
      });
    }else{
      estatusInterfaz.idCatEstatus = 27
      this.pager.data.forEach(element => {
        element.activarInterfaz = true;
        element.tbCatEstatus = estatusInterfaz;
        if(element.tbConfiguracionSLA?.idConfiguracionSLA == null){
          element.tbConfiguracionSLA = slaConf;
        }
      });
    }
  }

  cambiarEstatusPunta(valor) {
    if (valor == 16) {
      this.estatusPunta = 'activa';
    } else if (valor == 17){
      this.estatusPunta = 'inactiva';
    }else {
      this.estatusPunta = 'mantenimiento';
    }
  }

  onPaged(page: number) {
    this.tablePuntas = this.pager.page(page);
  }

  

  onKeyDownEvent(event: any){
    let filtro = event.target.value;
    let busquedaDeDatos = this.detallePunta.interfaces;
    busquedaDeDatos = busquedaDeDatos.filter( item => 
      item?.interfaz?.toLowerCase().includes(filtro.toLowerCase())  
      || item?.alias?.toLowerCase().includes(filtro.toLowerCase())
      //|| item.tipoServicios.toLowerCase().includes(filtro.toLowerCase())
      )
      this.paginador(busquedaDeDatos);
  }

  paginador(value: any){
    this.pager = new Paginator(value,3,1)
    this.tablePuntas = this.pager.page(1);    
  }

  cambiar(index,tipo){
    let estatusInterfaz = new Estatus();
    if(tipo == 'activo'){
      estatusInterfaz.idCatEstatus = 27;
      this.tablePuntas[index].activarInterfaz = true;
      this.tablePuntas[index].tbCatEstatus = estatusInterfaz;
    }else if(tipo == 'inactivo'){
      estatusInterfaz.idCatEstatus = 28;
      this.tablePuntas[index].activarInterfaz = false;
      this.tablePuntas[index].tbCatEstatus = estatusInterfaz;
    }else{
      estatusInterfaz.idCatEstatus = 29;
      this.tablePuntas[index].activarInterfaz = false;
      this.tablePuntas[index].tbCatEstatus = estatusInterfaz;
    }
    
    /* this.tablePuntas */
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.estados.filter(option => option.toLowerCase().includes(filterValue));
  }

  public onlyNumbers(event) {
    let k;
    k = event.charCode;
    return ((!(k > 31 && (k < 48 || k > 57))) || k == 46 || k == 45);
  }

  eventoKeyShow(event: any, opcion: number){
    if(event.target.value == ''){
      switch (opcion) {
        case 1:
          this.showLatitud = true
          break;
        case 2:
          this.showLongitud = true
          break;
        case 3:
          this.showEstado = true
          break;
      }
    }else{
      switch (opcion) {
        case 1:
          this.showLatitud = false
          break;
        case 2:
          this.showLongitud = false
          break;
        case 3:
          this.showEstado = false
          break;
      }
    }
 }


}
