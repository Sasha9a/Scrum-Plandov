import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponentModule } from "@scrum/web/shared/dumbs/table/table-component.module";
import { UserAvatarModule } from "@scrum/web/shared/dumbs/user-avatar/user-avatar.module";
import { SprintWorkUsersInfoComponent } from './sprint-work-users-info.component';

@NgModule({
  declarations: [SprintWorkUsersInfoComponent],
  exports: [SprintWorkUsersInfoComponent],
  imports: [CommonModule, TableComponentModule, UserAvatarModule]
})
export class SprintWorkUsersInfoModule {}
