import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';

@Component({
  selector: 'app-edit-graph',
  templateUrl: './edit-graph.component.html',
  styleUrls: ['./edit-graph.component.css']
})
export class EditGraphComponent implements OnInit {

  img:number = 1;
  typeGraph:number;
  
  dark:boolean = false;
  isDarkTheme: Observable<boolean>;
  objectCard:any;
  objectGraph:any;
  idUsuario: number;
  dashboard:number;
  constructor(public dialogRef: MatDialogRef<EditGraphComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private themeService: ThemeService,
    public dashboardService: DashboardService,
    private administratorService: AdministratorService,
    private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
    this.idUsuario = this.administratorService.getIdUsuarios();
    this.dashboard = Number(localStorage.getItem('dashboard'));
    this.typeGraph = this.data.typeGraph;
    this.consultaCuadrantesGraficas();
    console.log(this.data)

    if(this.data.viewGraph == 7){
      this.img = 8
    }else if(this.data.viewGraph == 40){
      this.img = 41
    }else{
      this.img = this.data.viewGraph;
    }
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.dark = this.data.dark;
    /* this.workspaceService.getObject().then(result => {

      if(this.typeGraph == 1){
        this.objectGraph = result.data.enlace[0];
      }else if(this.typeGraph == 2){
        this.objectGraph = result.data.enlace[1];
      }else if(this.typeGraph == 3){
        this.objectGraph = result.data.enlace[2];
      }else if(this.typeGraph == 4){
        this.objectGraph = result.data.enlace[3];
      }else if(this.typeGraph == 5){
        this.objectGraph = result.data.enlace[4];
      }else{
        this.objectGraph = result.data.enlace[5];
      }
      console.log(this.objectGraph)
      let mode = localStorage.getItem('darkTheme');
      if(mode != null){
        setTimeout(() => {
          this.themeService.setDarkTheme(mode === '1' ? true: false);
        }, 100);
      }
    }); */
  }

  changeGraph(value:number){
    this.img = value;
  }

  closeData(){
    this.dialogRef.close();
  }

  close(){
    let body = {
      "idUsuario": this.idUsuario,
      "idCuadrante": this.typeGraph,
      "idGrafica": this.img
    }
    this.dashboardService.actualizarCuadranteDashboard(body).subscribe({
      next: ({ data, httpStatus }) => { 
        this.dialogRef.close(this.objectGraph);
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }

  consultaCuadrantesGraficas(){
    this.objectGraph = [];
    this.dashboardService.recuperarCuadranteDashboard(this.idUsuario,this.dashboard).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.objectGraph = data.filter((cuadrante) => cuadrante.idDashboardCudrante === this.typeGraph);
          console.log('ObjectGraph ', this.objectGraph);
          if(this.objectGraph[0].cuadranteGrafica[0].idCuadranteGrafica == 7){
            this.objectGraph[0].cuadranteGrafica.shift();
          }
          if(this.objectGraph[0].cuadranteGrafica[0].idCuadranteGrafica == 40){
            this.objectGraph[0].cuadranteGrafica.shift();
          }
          this.objectGraph.forEach( cua => {
            if(cua.cuadranteActivo == null){
              cua.cuadranteActivo = cua.cuadranteGrafica[0].idCuadranteGrafica;
            }
          });
          console.log(this.typeGraph)
          console.log(this.objectGraph)
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }

}
