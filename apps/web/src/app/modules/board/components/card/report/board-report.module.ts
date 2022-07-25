import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { DaterangepickerModule } from "@scrum/web/shared/dumbs/daterangepicker/daterangepicker.module";
import { MultiSelectComponentModule } from "@scrum/web/shared/dumbs/dropdowns/multi-select/multi-select-component.module";
import { TaskMultiSelectModule } from "@scrum/web/shared/dumbs/dropdowns/task-multi-select/task-multi-select.module";
import { TableComponentModule } from "@scrum/web/shared/dumbs/table/table-component.module";
import { ButtonModule } from "primeng/button";
import { BoardReportComponent } from './board-report.component';
import { UserMultiSelectModule } from "@scrum/web/shared/dumbs/dropdowns/user-multi-select/user-multi-select.module";
import { ChartModule } from "primeng/chart";
import { SkeletonModule } from "primeng/skeleton";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: BoardReportComponent
  }
];

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
        RouterModule.forChild(routes),
        UserMultiSelectModule,
        ChartModule,
        SkeletonModule
    ]
})
export class BoardReportModule {}
