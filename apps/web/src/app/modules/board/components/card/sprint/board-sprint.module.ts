import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SprintWorkUsersInfoModule } from "@scrum/web/modules/sprint/dumbs/sprint-work-users-info/sprint-work-users-info.module";
import { TaskAddModule } from "@scrum/web/modules/task/components/add/task-add.module";
import { TaskShortInfoModule } from "@scrum/web/modules/task/dumbs/task-short-info/task-short-info.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { FindByKeyPipeModule } from "@scrum/web/shared/pipes/find-by-key/find-by-key-pipe.module";
import { OrderByPipeModule } from "@scrum/web/shared/pipes/order-by/order-by-pipe.module";
import { TaskPriorityColorPipeModule } from "@scrum/web/shared/pipes/task-priority-color/task-priority-color-pipe.module";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogService } from "primeng/dynamicdialog";
import { TagModule } from "primeng/tag";
import { BoardSprintComponent } from './board-sprint.component';
import { UserAvatarModule } from "@scrum/web/shared/dumbs/user-avatar/user-avatar.module";
import { TaskPriorityNamePipeModule } from "@scrum/web/shared/pipes/task-priority-name/task-priority-name-pipe.module";
import { TaskOrderByPipeModule } from "@scrum/web/shared/pipes/task-order-by/task-order-by-pipe.module";

@NgModule({
  declarations: [BoardSprintComponent],
  exports: [BoardSprintComponent],
	imports: [
		CommonModule,
		ButtonModule,
		RouterModule,
		SpinnerModule,
		AccordionModule,
		TagModule,
		FindByKeyPipeModule,
		SprintWorkUsersInfoModule,
		TaskAddModule,
		CardModule,
		OrderByPipeModule,
		TaskPriorityColorPipeModule,
		UserAvatarModule,
		TaskPriorityNamePipeModule,
		TaskOrderByPipeModule,
		TaskShortInfoModule
	],
  providers: [DialogService]
})
export class BoardSprintModule {}
