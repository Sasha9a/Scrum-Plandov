import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskPriorityColorPipe } from './task-priority-color.pipe';

@NgModule({
  declarations: [TaskPriorityColorPipe],
  exports: [TaskPriorityColorPipe],
  imports: [CommonModule]
})
export class TaskPriorityColorPipeModule { }
