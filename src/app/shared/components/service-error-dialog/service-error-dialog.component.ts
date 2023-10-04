import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministratorService } from '../../services/administrator.service';

@Component({
  selector: 'app-service-error-dialog',
  templateUrl: './service-error-dialog.component.html',
  styleUrls: ['./service-error-dialog.component.css']
})
export class ServiceErrorDialogComponent implements OnInit {

  error:boolean = false;
  cerrarSesion: boolean = true;

  constructor(public dialogRef: MatDialogRef<ServiceErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdministratorService) { }

  ngOnInit(): void {
    if(this.data){
      this.cerrarSesion = this.data.cerrarSesion == false ? false : true;
    }
  }

  close(){
    this.dialogRef.close();
  }

  reintentar(){
    this.dialogRef.close(this.data.numero);
  }

  logout(){
    this.dialogRef.close();
    this.adminService.logout();
  }
}
