import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUrlPipeModule } from "@scrum/web/shared/pipes/api-url/api-url-pipe.module";
import { AvatarModule } from "primeng/avatar";
import { UserAvatarComponent } from './user-avatar.component';

@NgModule({
  declarations: [UserAvatarComponent],
  exports: [UserAvatarComponent],
  imports: [CommonModule, AvatarModule, ApiUrlPipeModule]
})
export class UserAvatarModule {}
