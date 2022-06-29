import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobRecordFormComponent } from './job-record-form.component';
import { ButtonModule } from "primeng/button";
import { GoBackButtonModule } from "@scrum/web/shared/dumbs/go-back-button/go-back-button.module";
import { JoinPipeModule } from "@scrum/web/shared/pipes/join/join-pipe.module";
import { InputNumberModule } from "primeng/inputnumber";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [JobRecordFormComponent],
  exports: [JobRecordFormComponent],
  imports: [
    CommonModule,
    ButtonModule,
    GoBackButtonModule,
    JoinPipeModule,
    InputNumberModule,
    FormsModule
  ]
})
export class JobRecordFormModule {}
