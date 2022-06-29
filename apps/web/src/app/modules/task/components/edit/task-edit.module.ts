import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormModule } from "@scrum/web/modules/task/dumbs/task-form/task-form.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { TaskEditComponent } from './task-edit.component';

@NgModule({
  declarations: [TaskEditComponent],
  exports: [TaskEditComponent],
  imports: [CommonModule, TaskFormModule, SpinnerModule]
})
export class TaskEditModule {}
