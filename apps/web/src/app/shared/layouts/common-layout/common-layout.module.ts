import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FooterLayoutModule } from "@scrum/web/shared/layouts/footer-layout/footer-layout.module";
import { HeaderLayoutModule } from "@scrum/web/shared/layouts/header-layout/header-layout.module";
import { DividerModule } from "primeng/divider";
import { CommonLayoutComponent } from './common-layout.component';

@NgModule({
  declarations: [CommonLayoutComponent],
  exports: [CommonLayoutComponent],
  imports: [CommonModule, RouterModule, DividerModule, HeaderLayoutModule, FooterLayoutModule]
})
export class CommonLayoutModule {}
