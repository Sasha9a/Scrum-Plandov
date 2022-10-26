import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthGuard } from '@scrum/web/core/guards/is-auth.guard';
import { RegisterFormModule } from '@scrum/web/modules/user/dumbs/register-form/register-form.module';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsAuthGuard],
    component: RegisterComponent,
    data: {
      title: 'Регистрация'
    }
  }
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), RegisterFormModule]
})
export class RegisterModule {}
