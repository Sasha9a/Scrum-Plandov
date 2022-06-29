import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { FileModule } from "@scrum/web/shared/dumbs/file/file.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { UserAvatarModule } from "@scrum/web/shared/dumbs/user-avatar/user-avatar.module";
import { SafeHtmlPipeModule } from "@scrum/web/shared/pipes/safe-html/safe-html-pipe.module";
import { TaskPriorityNamePipeModule } from "@scrum/web/shared/pipes/task-priority-name/task-priority-name-pipe.module";
import { ButtonModule } from "primeng/button";
import { TaskCardComponent } from './task-card.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: TaskCardComponent
  }
];

@NgModule({
  declarations: [TaskCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SpinnerModule,
    ButtonModule,
    TaskPriorityNamePipeModule,
    SafeHtmlPipeModule,
    FileModule,
    UserAvatarModule
  ]
})
export class TaskCardModule {}
