import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HumanRangePipe } from './human-range.pipe';

@NgModule({
  declarations: [HumanRangePipe],
  exports: [HumanRangePipe],
  imports: [CommonModule]
})
export class HumanRangePipeModule { }
