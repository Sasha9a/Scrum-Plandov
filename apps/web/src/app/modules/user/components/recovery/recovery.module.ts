import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RecoveryFormModule } from "@scrum/web/modules/user/dumbs/recovery-form/recovery-form.module";
import { RecoveryComponent } from './recovery.component';

const routes: Routes = [
  {
    path: '',
    component: RecoveryComponent,
    data: {
      title: 'Восстановление'
    }
  }
];

@NgModule({
  declarations: [RecoveryComponent],
	imports: [CommonModule, RouterModule.forChild(routes), RecoveryFormModule],
})
export class RecoveryModule {}
