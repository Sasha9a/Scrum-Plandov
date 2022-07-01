import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponentModule } from "@scrum/web/shared/dumbs/dropdowns/multi-select/multi-select-component.module";
import { TruncatePipeModule } from "@scrum/web/shared/pipes/truncate/truncate-pipe.module";
import { TaskMultiSelectComponent } from './task-multi-select.component';

@NgModule({
  declarations: [TaskMultiSelectComponent],
  exports: [TaskMultiSelectComponent],
  imports: [CommonModule, MultiSelectComponentModule, TruncatePipeModule]
})
export class TaskMultiSelectModule {}
