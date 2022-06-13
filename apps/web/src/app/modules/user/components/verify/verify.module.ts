import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
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
  imports: [CommonModule, RouterModule.forChild(routes), SpinnerModule, ButtonModule]
})
export class VerifyModule {}
