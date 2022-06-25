import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskOrderByPipe } from './task-order-by.pipe';

@NgModule({
  declarations: [TaskOrderByPipe],
  exports: [TaskOrderByPipe],
  imports: [CommonModule]
})
export class TaskOrderByPipeModule { }
