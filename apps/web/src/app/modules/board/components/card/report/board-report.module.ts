import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaterangepickerModule } from "@scrum/web/shared/dumbs/daterangepicker/daterangepicker.module";
import { MultiSelectComponentModule } from "@scrum/web/shared/dumbs/dropdowns/multi-select/multi-select-component.module";
import { ButtonModule } from "primeng/button";
import { BoardReportComponent } from './board-report.component';

@NgModule({
  declarations: [BoardReportComponent],
  exports: [BoardReportComponent],
  imports: [
    CommonModule,
    DaterangepickerModule,
    MultiSelectComponentModule,
    ButtonModule
  ]
})
export class BoardReportModule {}
