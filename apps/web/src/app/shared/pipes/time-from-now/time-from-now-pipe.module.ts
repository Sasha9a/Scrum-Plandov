import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFromNowPipe } from './time-from-now.pipe';

@NgModule({
  declarations: [TimeFromNowPipe],
  exports: [TimeFromNowPipe],
  imports: [CommonModule]
})
export class TimeFromNowPipeModule { }
