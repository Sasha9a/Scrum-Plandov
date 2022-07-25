import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SingleSelectModule } from "@scrum/web/shared/dumbs/dropdowns/single-select/single-select.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { OrderByPipeModule } from "@scrum/web/shared/pipes/order-by/order-by-pipe.module";
import { TimeFromNowPipeModule } from "@scrum/web/shared/pipes/time-from-now/time-from-now-pipe.module";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DragDropModule } from "primeng/dragdrop";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { BoardDashboardComponent } from './board-dashboard.component';
import { TaskOrderByPipeModule } from "@scrum/web/shared/pipes/task-order-by/task-order-by-pipe.module";
import {
  TaskPriorityColorPipeModule
} from "@scrum/web/shared/pipes/task-priority-color/task-priority-color-pipe.module";
import { UserAvatarModule } from "@scrum/web/shared/dumbs/user-avatar/user-avatar.module";
import { TaskPriorityNamePipeModule } from "@scrum/web/shared/pipes/task-priority-name/task-priority-name-pipe.module";
import { ChipModule } from "primeng/chip";
import { InplaceModule } from "primeng/inplace";
import { TooltipModule } from "primeng/tooltip";
import { SelectButtonModule } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { TaskFilterPipeModule } from "@scrum/web/shared/pipes/task-filter/task-filter-pipe.module";
import { TaskShortInfoModule } from "@scrum/web/modules/task/dumbs/task-short-info/task-short-info.module";
import { TaskAddModule } from "@scrum/web/modules/task/components/task/add/task-add.module";

@NgModule({
  declarations: [BoardDashboardComponent],
  exports: [BoardDashboardComponent],
	imports: [
		CommonModule,
		ButtonModule,
		RouterModule,
		OrderByPipeModule,
		CardModule,
		DragDropModule,
		SpinnerModule,
		OverlayPanelModule,
		SingleSelectModule,
		TaskOrderByPipeModule,
		TaskPriorityColorPipeModule,
		UserAvatarModule,
		TaskPriorityNamePipeModule,
		ChipModule,
		InplaceModule,
		TooltipModule,
		SelectButtonModule,
		FormsModule,
		TaskFilterPipeModule,
		TaskShortInfoModule,
		TaskAddModule,
		TimeFromNowPipeModule
	]
})
export class BoardDashboardModule {}
