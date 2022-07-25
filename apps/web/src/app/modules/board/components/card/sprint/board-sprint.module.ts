import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { SprintWorkUsersInfoModule } from "@scrum/web/modules/sprint/dumbs/sprint-work-users-info/sprint-work-users-info.module";
import { TaskAddModule } from "@scrum/web/modules/task/components/task/add/task-add.module";
import { TaskShortInfoModule } from "@scrum/web/modules/task/dumbs/task-short-info/task-short-info.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { FindByKeyPipeModule } from "@scrum/web/shared/pipes/find-by-key/find-by-key-pipe.module";
import { OrderByPipeModule } from "@scrum/web/shared/pipes/order-by/order-by-pipe.module";
import { TaskPriorityColorPipeModule } from "@scrum/web/shared/pipes/task-priority-color/task-priority-color-pipe.module";
import { TimeFromNowPipeModule } from "@scrum/web/shared/pipes/time-from-now/time-from-now-pipe.module";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogService } from "primeng/dynamicdialog";
import { TagModule } from "primeng/tag";
import { BoardSprintComponent } from './board-sprint.component';
import { UserAvatarModule } from "@scrum/web/shared/dumbs/user-avatar/user-avatar.module";
import { TaskPriorityNamePipeModule } from "@scrum/web/shared/pipes/task-priority-name/task-priority-name-pipe.module";
import { TaskOrderByPipeModule } from "@scrum/web/shared/pipes/task-order-by/task-order-by-pipe.module";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: BoardSprintComponent
  }
];

@NgModule({
  declarations: [BoardSprintComponent],
  exports: [BoardSprintComponent],
	imports: [
		CommonModule,
		ButtonModule,
		RouterModule.forChild(routes),
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
		TaskShortInfoModule,
		TimeFromNowPipeModule
	],
  providers: [DialogService]
})
export class BoardSprintModule {}
