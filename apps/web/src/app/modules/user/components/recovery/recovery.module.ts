import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoveryFormModule } from '@scrum/web/modules/user/dumbs/recovery-form/recovery-form.module';
import { SpinnerModule } from '@scrum/web/shared/dumbs/spinner/spinner.module';
import { RecoveryComponent } from './recovery.component';

const routes: Routes = [
  {
    path: '',
    component: RecoveryComponent,
    data: {
      title: 'Восстановление',
      onlyNotAuth: true
    }
  }
];

@NgModule({
  declarations: [RecoveryComponent],
  imports: [CommonModule, RouterModule.forChild(routes), RecoveryFormModule, SpinnerModule]
})
export class RecoveryModule {}
