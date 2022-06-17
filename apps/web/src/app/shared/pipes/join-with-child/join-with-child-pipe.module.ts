import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinWithChildPipe } from './join-with-child.pipe';

@NgModule({
  declarations: [JoinWithChildPipe],
  exports: [JoinWithChildPipe],
  imports: [CommonModule]
})
export class JoinWithChildModule { }
