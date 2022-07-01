import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { DaterangepickerModule } from "@scrum/web/shared/dumbs/daterangepicker/daterangepicker.module";
import { MultiSelectComponentModule } from "@scrum/web/shared/dumbs/dropdowns/multi-select/multi-select-component.module";
import { TaskMultiSelectModule } from "@scrum/web/shared/dumbs/dropdowns/task-multi-select/task-multi-select.module";
import { TableComponentModule } from "@scrum/web/shared/dumbs/table/table-component.module";
import { ButtonModule } from "primeng/button";
import { BoardReportComponent } from './board-report.component';

@NgModule({
  declarations: [BoardReportComponent],
  exports: [BoardReportComponent],
  imports: [
    CommonModule,
    DaterangepickerModule,
    MultiSelectComponentModule,
    ButtonModule,
    TaskMultiSelectModule,
    TableComponentModule,
    RouterModule
  ]
})
export class BoardReportModule {}
