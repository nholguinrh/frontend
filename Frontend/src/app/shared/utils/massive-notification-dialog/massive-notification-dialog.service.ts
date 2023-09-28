import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class MassiveNotificationDialogService {
    private dialogConfig = new MatDialogConfig();

    sendMassiveNotification(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;        
        return this.dialogConfig;
    }

}
