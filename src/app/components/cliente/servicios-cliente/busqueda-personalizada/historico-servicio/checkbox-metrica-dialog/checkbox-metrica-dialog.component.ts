import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Metrica } from 'src/app/shared/model/cliente.model';
import { ServicioDialogModel } from 'src/app/shared/model/confirm-dialog';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-checkbox-metrica-dialog',
  templateUrl: './checkbox-metrica-dialog.component.html',
  styleUrls: ['./checkbox-metrica-dialog.component.css']
})
export class CheckboxMetricaDialogComponent{

  configuracion: boolean = true;
  dialogo:any = {
    estatus: false,
    nombre: ''
  }
  listadoMetricas: Metrica[];

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: ServicioDialogModel,
    private administratorService: AdministratorService,
    private alertService: AlertService
  ) {dialogRef.disableClose = true;}
  

  ngOnInit(): void {
    this.listadoMetricas = this.data.listadoItems
  }

  closeDialog() {
    this.dialogRef.close(this.data.listadoItems);
  }

  confirmDialog() {
    this.dialogRef.close(this.data.listadoItems);
  }

  cambiarEstatusMetrica(metrica: Metrica){
    metrica.selected = !metrica.selected
  }

}
