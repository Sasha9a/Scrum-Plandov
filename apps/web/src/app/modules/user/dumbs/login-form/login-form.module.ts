import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { JoinPipeModule } from "@scrum/web/shared/pipes/join/join-pipe.module";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { LoginFormComponent } from './login-form.component';

@NgModule({
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
  imports: [CommonModule, InputTextModule, FormsModule, JoinPipeModule, ButtonModule, PasswordModule]
})
export class LoginFormModule {}
