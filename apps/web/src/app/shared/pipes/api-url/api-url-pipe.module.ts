import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUrlPipe } from './api-url.pipe';

@NgModule({
  declarations: [ApiUrlPipe],
  exports: [ApiUrlPipe],
  imports: [CommonModule]
})
export class ApiUrlPipeModule { }
