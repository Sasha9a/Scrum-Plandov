import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { LoginFormModule } from "@scrum/web/modules/user/dumbs/login-form/login-form.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Авторизация'
    }
  }
];


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoginFormModule,
    SpinnerModule
  ]
})
export class LoginModule {}
