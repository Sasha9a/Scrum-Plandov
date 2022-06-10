import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NestedPropertyPipe } from './nested-property.pipe';

@NgModule({
  declarations: [NestedPropertyPipe],
  exports: [NestedPropertyPipe],
  imports: [CommonModule]
})
export class NestedPropertyPipeModule { }
