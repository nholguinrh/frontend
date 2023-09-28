import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { DetallePunta, Punta } from '../../model/cliente.model';

@Injectable({ providedIn: 'root' })
export class InterfacesDialogService {
    private dialogConfig = new MatDialogConfig();

    detallePunta(punta: DetallePunta): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = punta;
        return this.dialogConfig;
    }

}
