import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FileModule } from "@scrum/web/shared/dumbs/file/file.module";
import { UserAvatarModule } from "@scrum/web/shared/dumbs/user-avatar/user-avatar.module";
import { TaskPriorityNamePipeModule } from "@scrum/web/shared/pipes/task-priority-name/task-priority-name-pipe.module";
import { ButtonModule } from "primeng/button";
import { SidebarModule } from "primeng/sidebar";
import { TaskShortInfoComponent } from './task-short-info.component';

@NgModule({
  declarations: [TaskShortInfoComponent],
  exports: [TaskShortInfoComponent],
	imports: [
		CommonModule,
		RouterModule,
		ButtonModule,
		TaskPriorityNamePipeModule,
		UserAvatarModule,
		FileModule,
		SidebarModule
	]
})
export class TaskShortInfoModule {}
