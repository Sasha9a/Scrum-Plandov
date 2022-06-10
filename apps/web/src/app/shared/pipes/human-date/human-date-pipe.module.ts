import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HumanDatePipe } from './human-date.pipe';

@NgModule({
  declarations: [HumanDatePipe],
  exports: [HumanDatePipe],
  imports: [CommonModule]
})
export class HumanDatePipeModule { }
