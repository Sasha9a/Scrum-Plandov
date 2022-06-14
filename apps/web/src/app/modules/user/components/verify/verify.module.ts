import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { ChangePasswordFormModule } from "@scrum/web/modules/user/dumbs/change-password-form/change-password-form.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { ButtonModule } from "primeng/button";
import { VerifyComponent } from './verify.component';

const routes: Routes = [
  {
    path: ':path',
    component: VerifyComponent,
    data: {
      title: 'Подтверждение'
    }
  }
];

@NgModule({
  declarations: [VerifyComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SpinnerModule, ButtonModule, ChangePasswordFormModule]
})
export class VerifyModule {}
