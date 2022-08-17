import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSelectModule } from "@scrum/web/shared/dumbs/dropdowns/single-select/single-select.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { ButtonModule } from "primeng/button";
import { BoardLeaveDialogComponent } from './board-leave-dialog.component';

@NgModule({
  declarations: [BoardLeaveDialogComponent],
  exports: [BoardLeaveDialogComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    SingleSelectModule,
    ButtonModule
  ]
})
export class BoardLeaveDialogModule {}
