import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskPriorityNamePipe } from './task-priority-name.pipe';

@NgModule({
  declarations: [TaskPriorityNamePipe],
  exports: [TaskPriorityNamePipe],
  imports: [CommonModule]
})
export class TaskPriorityNamePipeModule {}
