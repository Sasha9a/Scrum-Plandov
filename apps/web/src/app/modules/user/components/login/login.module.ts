import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthGuard } from '@scrum/web/core/guards/is-auth.guard';
import { LoginFormModule } from '@scrum/web/modules/user/dumbs/login-form/login-form.module';
import { SpinnerModule } from '@scrum/web/shared/dumbs/spinner/spinner.module';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsAuthGuard],
    component: LoginComponent,
    data: {
      title: 'Авторизация'
    }
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LoginFormModule, SpinnerModule]
})
export class LoginModule {}
