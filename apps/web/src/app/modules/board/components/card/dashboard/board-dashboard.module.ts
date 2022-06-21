import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SingleSelectModule } from "@scrum/web/shared/dumbs/dropdowns/single-select/single-select.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { OrderByPipeModule } from "@scrum/web/shared/pipes/order-by/order-by-pipe.module";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DragDropModule } from "primeng/dragdrop";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { BoardDashboardComponent } from './board-dashboard.component';

@NgModule({
  declarations: [BoardDashboardComponent],
  exports: [BoardDashboardComponent],
  imports: [CommonModule, ButtonModule, RouterModule, OrderByPipeModule, CardModule, DragDropModule, SpinnerModule, OverlayPanelModule, SingleSelectModule]
})
export class BoardDashboardModule {}
