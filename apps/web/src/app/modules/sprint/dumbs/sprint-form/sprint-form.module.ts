import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { DatepickerModule } from "@scrum/web/shared/dumbs/datepicker/datepicker.module";
import { GoBackButtonModule } from "@scrum/web/shared/dumbs/go-back-button/go-back-button.module";
import { JoinPipeModule } from "@scrum/web/shared/pipes/join/join-pipe.module";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { SprintFormComponent } from './sprint-form.component';

@NgModule({
  declarations: [SprintFormComponent],
  exports: [SprintFormComponent],
  imports: [
    CommonModule,
    ButtonModule,
    GoBackButtonModule,
    InputTextModule,
    JoinPipeModule,
    FormsModule,
    DatepickerModule
  ]
})
export class SprintFormModule {}
