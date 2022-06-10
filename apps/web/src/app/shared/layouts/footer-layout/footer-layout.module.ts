import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from "primeng/divider";
import { FooterLayoutComponent } from './footer-layout.component';

@NgModule({
  declarations: [FooterLayoutComponent],
  exports: [FooterLayoutComponent],
  imports: [CommonModule, DividerModule]
})
export class FooterLayoutModule {}
