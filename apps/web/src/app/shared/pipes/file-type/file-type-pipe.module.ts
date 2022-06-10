import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileTypePipe } from './file-type.pipe';

@NgModule({
  declarations: [FileTypePipe],
  exports: [FileTypePipe],
  imports: [CommonModule]
})
export class FileTypePipeModule { }
