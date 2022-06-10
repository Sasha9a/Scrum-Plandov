import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { CommonLayoutComponent } from './common-layout.component';

@NgModule({
  declarations: [CommonLayoutComponent],
  exports: [CommonLayoutComponent],
  imports: [CommonModule, RouterModule]
})
export class CommonLayoutModule {}
