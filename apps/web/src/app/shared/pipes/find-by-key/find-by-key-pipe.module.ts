import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindByKeyPipe } from './find-by-key.pipe';

@NgModule({
  declarations: [FindByKeyPipe],
  exports: [FindByKeyPipe],
  imports: [CommonModule]
})
export class FindByKeyPipeModule { }
