import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByPipe } from './filter-by.pipe';

@NgModule({
  declarations: [FilterByPipe],
  exports: [FilterByPipe],
  imports: [CommonModule]
})
export class FilterByPipeModule { }
