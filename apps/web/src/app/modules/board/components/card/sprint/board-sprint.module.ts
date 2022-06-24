import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SprintWorkUsersInfoModule } from "@scrum/web/modules/sprint/dumbs/sprint-work-users-info/sprint-work-users-info.module";
import { TaskAddModule } from "@scrum/web/modules/task/components/add/task-add.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { FindByKeyPipeModule } from "@scrum/web/shared/pipes/find-by-key/find-by-key-pipe.module";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { DialogService } from "primeng/dynamicdialog";
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
		TagModule,
		FindByKeyPipeModule,
    SprintWorkUsersInfoModule,
    TaskAddModule
	],
  providers: [DialogService]
})
export class BoardSprintModule {}
