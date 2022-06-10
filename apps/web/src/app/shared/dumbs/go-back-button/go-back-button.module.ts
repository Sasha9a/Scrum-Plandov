import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackButtonComponent } from "@scrum/web/shared/dumbs/go-back-button/go-back-button.component";
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [GoBackButtonComponent],
  exports: [GoBackButtonComponent],
  imports: [
    CommonModule,
    ButtonModule
  ]
})
export class GoBackButtonModule { }
