import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterFormModule } from '@scrum/web/modules/user/dumbs/register-form/register-form.module';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    data: {
      title: 'Регистрация',
      onlyNotAuth: true
    }
  }
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), RegisterFormModule]
})
export class RegisterModule {}
