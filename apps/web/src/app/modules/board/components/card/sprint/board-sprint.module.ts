import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { BoardSprintComponent } from './board-sprint.component';

@NgModule({
  declarations: [BoardSprintComponent],
  exports: [BoardSprintComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    SpinnerModule,
    AccordionModule,
    TagModule
  ]
})
export class BoardSprintModule {}
