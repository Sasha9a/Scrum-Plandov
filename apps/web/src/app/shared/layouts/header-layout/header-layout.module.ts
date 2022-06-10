import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { UserAvatarModule } from "@scrum/web/shared/dumbs/user-avatar/user-avatar.module";
import { AvatarModule } from "primeng/avatar";
import { MenuModule } from "primeng/menu";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { HeaderLayoutComponent } from './header-layout.component';

@NgModule({
  declarations: [HeaderLayoutComponent],
  exports: [HeaderLayoutComponent],
  imports: [CommonModule, RouterModule, AvatarModule, UserAvatarModule, OverlayPanelModule, MenuModule]
})
export class HeaderLayoutModule {}
