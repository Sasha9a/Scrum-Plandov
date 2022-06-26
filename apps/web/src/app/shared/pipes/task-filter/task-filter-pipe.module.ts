import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilterPipe } from './task-filter.pipe';

@NgModule({
  declarations: [TaskFilterPipe],
  exports: [TaskFilterPipe],
  imports: [CommonModule]
})
export class TaskFilterPipeModule { }
