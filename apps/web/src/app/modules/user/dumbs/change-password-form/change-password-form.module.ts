import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ChangePasswordFormComponent } from './change-password-form.component';

@NgModule({
  declarations: [ChangePasswordFormComponent],
  exports: [ChangePasswordFormComponent],
  imports: [CommonModule, InputTextModule, FormsModule, ButtonModule]
})
export class ChangePasswordFormModule {}
