import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AutorizationContainterComponent } from './autorization-containter/autorization-containter.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleToolbarModule } from 'src/app/shared/utils/simple-toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { FirststepComponent } from './verification/firststep/firststep.component';
import { PincodeModule } from '../../shared/utils/pincode/pincode.module';
import { SecondstepComponent } from './verification/secondstep/secondstep.component';
import { FooterModule } from 'src/app/shared/utils/footer';
import { MatButtonModule } from '@angular/material/button';
import { StteperModule } from 'src/app/shared/utils/stteper';
import { CodestepComponent } from './verification/codestep/codestep.component';
import { MaskPipe } from 'src/app/shared/pipe/mask.pipe';
import { RegisterComponent } from './register/register.component';
import { ConfirmDialogModule } from 'src/app/shared/utils/confirm-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { ChangePasswordComponent } from './recover/change-password/change-password.component';
import { EnterCodeComponent } from './recover/enter-code/enter-code.component';
import { NewPasswordComponent } from './recover/new-password/new-password.component';
import { RecoverContainerComponent } from './recover-container/recover-container.component';

@NgModule({
  declarations: [
    LoginComponent,
    AutorizationContainterComponent,    
    FirststepComponent,
    SecondstepComponent,
    CodestepComponent,
    MaskPipe,
    RegisterComponent,
    LoginAdminComponent,
    RegisterAdminComponent,
    ChangePasswordComponent,
    EnterCodeComponent,
    NewPasswordComponent,
    RecoverContainerComponent,
  ],
  imports: [
    CommonModule,
    SimpleToolbarModule,
    FooterModule,
    StteperModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatRadioModule,
    MatDialogModule,
    PincodeModule,
  ],
  exports: [MatStepperModule],
})
export class AutorizationModule {}
