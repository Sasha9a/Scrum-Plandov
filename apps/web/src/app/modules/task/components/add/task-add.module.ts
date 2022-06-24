import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormModule } from "@scrum/web/modules/task/dumbs/task-form/task-form.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { TaskAddComponent } from './task-add.component';

@NgModule({
  declarations: [TaskAddComponent],
  exports: [TaskAddComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    TaskFormModule
  ]
})
export class TaskAddModule {}
